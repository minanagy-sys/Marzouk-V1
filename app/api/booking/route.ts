import { NextResponse } from "next/server";
import { getServiceClient, getAnonClient } from "@/lib/supabase";

export const runtime = "nodejs";

/** Convert Arabic-Indic (٠-٩) and Persian (۰-۹) numerals to ASCII digits. */
function toAsciiDigits(s: string): string {
  return s
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0));
}

// Best-effort in-memory rate limit (per IP). Resets on restart — enough to blunt
// simple form spam without extra infrastructure.
const RATE = { windowMs: 60_000, max: 5 };
const hits = new Map<string, number[]>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < RATE.windowMs);
  arr.push(now);
  hits.set(ip, arr);
  if (hits.size > 5000) hits.clear(); // guard against unbounded growth
  return arr.length > RATE.max;
}

/**
 * Booking form endpoint.
 * Validates the submission and stores it in the Supabase `bookings` table.
 * If Supabase isn't configured yet, it still succeeds (logs server-side) so the
 * form works during development.
 */
export async function POST(request: Request) {
  let data: Record<string, unknown>;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // Honeypot: a hidden field real users never fill. If present, pretend success
  // and drop the submission silently (don't tip off bots).
  if (String(data.website ?? data.company ?? "").trim()) {
    return NextResponse.json({ ok: true, stored: false });
  }

  // Rate limit per client IP.
  const ip = (request.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  // Trim + cap lengths to stop oversized/abusive payloads.
  const cap = (v: unknown, n: number) => String(v ?? "").trim().slice(0, n);
  const name = cap(data.name, 120);
  const phone = toAsciiDigits(cap(data.phone, 40));
  const email = cap(data.email, 160);
  const service = cap(data.service, 120);
  const message = cap(data.message, 2000);
  const lang = cap(data.lang, 8) || "ar";

  // Basic validation
  if (!name || !phone) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }
  if (phone.replace(/\D/g, "").length < 7) {
    return NextResponse.json({ ok: false, error: "invalid_phone" }, { status: 400 });
  }

  // Note: `created_at` is intentionally omitted — the MySQL `bookings` table
  // fills it via DEFAULT CURRENT_TIMESTAMP (an ISO string with "T"/"Z" is not a
  // valid MySQL datetime and would be rejected).
  const record: Record<string, unknown> = { name, phone, email, service, message, lang };

  const service_client = getServiceClient();
  const anon_client = getAnonClient();
  const primary = service_client ?? anon_client;
  if (!primary) {
    // Supabase not configured yet — accept the booking so the form works.
    console.log("[booking] (no Supabase configured) received:", record);
    return NextResponse.json({ ok: true, stored: false });
  }

  // Insert with a graceful retry for older schemas missing the `email` column.
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const tryInsert = async (client: any) => {
    let { error } = await client.from("bookings").insert(record);
    if (error && /email/i.test(error.message ?? "")) {
      const copy = { ...record }; delete copy.email;
      ({ error } = await client.from("bookings").insert(copy));
    }
    return error;
  };

  let error = await tryInsert(primary);
  // If the service_role client failed (e.g. a misconfigured/rotated key), fall
  // back to the anon client — the RLS policy allows anonymous booking inserts.
  if (error && primary === service_client && anon_client) {
    console.warn("[booking] service client insert failed, retrying with anon:", error.message);
    error = await tryInsert(anon_client);
  }
  if (error) {
    console.error("[booking] Supabase insert error:", error.message);
    return NextResponse.json({ ok: false, error: "db_error", detail: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, stored: true });
}

import { NextResponse } from "next/server";
import { getServiceClient, getAnonClient } from "@/lib/supabase";

export const runtime = "nodejs";

/** Convert Arabic-Indic (٠-٩) and Persian (۰-۹) numerals to ASCII digits. */
function toAsciiDigits(s: string): string {
  return s
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0));
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

  const name = String(data.name ?? "").trim();
  const phone = toAsciiDigits(String(data.phone ?? "").trim());
  const email = String(data.email ?? "").trim();
  const service = String(data.service ?? "").trim();
  const message = String(data.message ?? "").trim();
  const lang = String(data.lang ?? "ar").trim();

  // Basic validation
  if (!name || !phone) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }
  if (phone.replace(/\D/g, "").length < 7) {
    return NextResponse.json({ ok: false, error: "invalid_phone" }, { status: 400 });
  }

  const record: Record<string, unknown> = { name, phone, email, service, message, lang, created_at: new Date().toISOString() };

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

import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";

export const runtime = "nodejs";

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
  const phone = String(data.phone ?? "").trim();
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

  const record = { name, phone, service, message, lang, created_at: new Date().toISOString() };

  const supabase = getServiceClient();
  if (!supabase) {
    // Supabase not configured yet — accept the booking so the form works.
    console.log("[booking] (no Supabase configured) received:", record);
    return NextResponse.json({ ok: true, stored: false });
  }

  const { error } = await supabase.from("bookings").insert(record);
  if (error) {
    console.error("[booking] Supabase insert error:", error.message);
    return NextResponse.json({ ok: false, error: "db_error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, stored: true });
}

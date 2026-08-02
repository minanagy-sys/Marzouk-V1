import { NextResponse } from "next/server";
import { clearCookie } from "@/lib/adminSession";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Clears the admin session cookie. */
export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.headers.set("Set-Cookie", clearCookie());
  return res;
}

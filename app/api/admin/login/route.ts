import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import type { RowDataPacket } from "mysql2";
import { getPool } from "@/lib/db";
import { signSession, sessionCookie, type AdminRole } from "@/lib/adminSession";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** POST { email, password } -> sets an httpOnly session cookie. */
export async function POST(request: Request) {
  if (!process.env.ADMIN_JWT_SECRET) {
    return NextResponse.json({ error: "auth_not_configured" }, { status: 500 });
  }
  const pool = getPool();
  if (!pool) return NextResponse.json({ error: "db_not_configured" }, { status: 500 });

  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");
  if (!email || !password) return NextResponse.json({ error: "missing_credentials" }, { status: 400 });

  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT id, email, name, password_hash, role, is_active FROM admin_users WHERE email = ? LIMIT 1",
    [email],
  );
  const user = rows[0];
  if (!user || user.is_active === 0 || user.is_active === false) {
    return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
  }
  const ok = await bcrypt.compare(password, String(user.password_hash || ""));
  if (!ok) return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });

  const token = signSession({
    id: String(user.id),
    email: String(user.email),
    name: user.name ? String(user.name) : undefined,
    role: (user.role as AdminRole) || "editor",
  });
  const res = NextResponse.json({
    ok: true,
    user: { email: user.email, name: user.name, role: user.role },
  });
  res.headers.set("Set-Cookie", sessionCookie(token));
  return res;
}

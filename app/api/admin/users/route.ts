import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import type { RowDataPacket } from "mysql2";
import { getPool } from "@/lib/db";
import { getAdmin } from "@/lib/admin/auth";
import type { AdminUser } from "@/lib/adminSession";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ROLES = ["admin", "editor"];

/** Managing users requires the `admin` role. Returns the caller or an error. */
function requireAdmin(request: Request): { user: AdminUser } | { error: NextResponse } {
  const user = getAdmin(request);
  if (!user) return { error: NextResponse.json({ error: "unauthorized" }, { status: 401 }) };
  if (user.role !== "admin") return { error: NextResponse.json({ error: "forbidden" }, { status: 403 }) };
  return { user };
}

async function activeAdminCount(pool: NonNullable<ReturnType<typeof getPool>>, excludeId?: string): Promise<number> {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT COUNT(*) AS c FROM admin_users WHERE role = 'admin' AND is_active = 1" + (excludeId ? " AND id <> ?" : ""),
    excludeId ? [excludeId] : [],
  );
  return Number(rows[0]?.c ?? 0);
}

// LIST
export async function GET(request: Request) {
  const g = requireAdmin(request);
  if ("error" in g) return g.error;
  const pool = getPool();
  if (!pool) return NextResponse.json({ error: "db_not_configured" }, { status: 500 });
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT id, email, name, role, is_active, created_at FROM admin_users ORDER BY created_at ASC",
  );
  return NextResponse.json({ data: rows });
}

// CREATE
export async function POST(request: Request) {
  const g = requireAdmin(request);
  if ("error" in g) return g.error;
  const pool = getPool();
  if (!pool) return NextResponse.json({ error: "db_not_configured" }, { status: 500 });

  const body = await request.json().catch(() => ({}));
  const email = String(body.email ?? "").trim().toLowerCase();
  const name = String(body.name ?? "").trim();
  const role = ROLES.includes(body.role) ? body.role : "editor";
  const password = String(body.password ?? "");
  if (!email || !password) return NextResponse.json({ error: "email and password required" }, { status: 400 });
  if (password.length < 6) return NextResponse.json({ error: "password too short (min 6)" }, { status: 400 });

  const hash = await bcrypt.hash(password, 10);
  try {
    await pool.execute(
      "INSERT INTO admin_users (id, email, name, password_hash, role, is_active) VALUES (?, ?, ?, ?, ?, 1)",
      [randomUUID(), email, name, hash, role],
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("Duplicate")) return NextResponse.json({ error: "A user with that email already exists." }, { status: 409 });
    return NextResponse.json({ error: msg }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

// UPDATE (name / role / active / password reset)
export async function PUT(request: Request) {
  const g = requireAdmin(request);
  if ("error" in g) return g.error;
  const pool = getPool();
  if (!pool) return NextResponse.json({ error: "db_not_configured" }, { status: 500 });

  const body = await request.json().catch(() => ({}));
  const id = String(body.id ?? "");
  if (!id) return NextResponse.json({ error: "missing_id" }, { status: 400 });

  const self = g.user.id === id;
  const sets: string[] = [];
  const params: (string | number)[] = [];

  if (typeof body.name === "string") { sets.push("name = ?"); params.push(body.name.trim()); }

  if (body.role !== undefined) {
    if (!ROLES.includes(body.role)) return NextResponse.json({ error: "invalid role" }, { status: 400 });
    // Don't let the last admin demote themselves out of the admin role.
    if (self && body.role !== "admin" && (await activeAdminCount(pool, id)) === 0) {
      return NextResponse.json({ error: "You are the last admin — assign another admin first." }, { status: 400 });
    }
    sets.push("role = ?"); params.push(body.role);
  }

  if (body.is_active !== undefined) {
    const active = body.is_active ? 1 : 0;
    if (self && !active) return NextResponse.json({ error: "You cannot deactivate your own account." }, { status: 400 });
    if (!active && (await activeAdminCount(pool, id)) === 0) {
      // deactivating the last admin
      const [[row]] = await pool.query<RowDataPacket[]>("SELECT role FROM admin_users WHERE id = ?", [id]);
      if (row?.role === "admin") return NextResponse.json({ error: "Cannot deactivate the last admin." }, { status: 400 });
    }
    sets.push("is_active = ?"); params.push(active);
  }

  if (body.password) {
    if (String(body.password).length < 6) return NextResponse.json({ error: "password too short (min 6)" }, { status: 400 });
    sets.push("password_hash = ?"); params.push(await bcrypt.hash(String(body.password), 10));
  }

  if (!sets.length) return NextResponse.json({ error: "nothing to update" }, { status: 400 });
  params.push(id);
  await pool.execute(`UPDATE admin_users SET ${sets.join(", ")} WHERE id = ?`, params);
  return NextResponse.json({ ok: true });
}

// DELETE
export async function DELETE(request: Request) {
  const g = requireAdmin(request);
  if ("error" in g) return g.error;
  const pool = getPool();
  if (!pool) return NextResponse.json({ error: "db_not_configured" }, { status: 500 });

  const id = new URL(request.url).searchParams.get("id") || "";
  if (!id) return NextResponse.json({ error: "missing_id" }, { status: 400 });
  if (id === g.user.id) return NextResponse.json({ error: "You cannot delete your own account." }, { status: 400 });

  const [[row]] = await pool.query<RowDataPacket[]>("SELECT role FROM admin_users WHERE id = ?", [id]);
  if (row?.role === "admin" && (await activeAdminCount(pool, id)) === 0) {
    return NextResponse.json({ error: "Cannot delete the last admin." }, { status: 400 });
  }
  await pool.execute("DELETE FROM admin_users WHERE id = ?", [id]);
  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export const runtime = "nodejs";

/**
 * Records a redirect hit (the recovery metric). Called best-effort from the
 * middleware via event.waitUntil, so it never blocks or fails the redirect.
 * Matches the literal source first; falls back to the highest-priority active
 * regex rule (section fallbacks) when there's no exact/static row.
 */
export async function POST(req: Request) {
  try {
    const { source } = await req.json();
    if (!source || typeof source !== "string") return NextResponse.json({ ok: false }, { status: 400 });
    const pool = getPool();
    if (!pool) return NextResponse.json({ ok: false }, { status: 200 });
    const [res] = await pool.execute(
      "UPDATE `redirects` SET `hit_count`=`hit_count`+1, `last_hit_at`=NOW() WHERE `source`=? AND `is_active`=1",
      [source],
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((res as any)?.affectedRows === 0) {
      await pool.execute(
        "UPDATE `redirects` SET `hit_count`=`hit_count`+1, `last_hit_at`=NOW() WHERE `is_regex`=1 AND `is_active`=1 AND ? REGEXP `source` ORDER BY `priority` DESC LIMIT 1",
        [source],
      );
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}

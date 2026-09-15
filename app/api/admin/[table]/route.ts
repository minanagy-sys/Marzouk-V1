import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServiceClient } from "@/lib/supabase";
import { getAdmin } from "@/lib/admin/auth";
import { COLLECTIONS } from "@/lib/admin/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Refresh the whole site cache so admin edits appear immediately. */
function refreshSite() {
  revalidatePath("/", "layout");
}

function collectionFor(table: string) {
  return COLLECTIONS[table];
}

/**
 * Validate + normalize a redirect before write (spec: source starts with /,
 * stored lowercased; reject source===destination and loops; collapse chains
 * to the final target; warn on overwrite). Returns a normalized patch, an
 * optional warning, or a fatal error string.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
async function prepRedirect(supabase: any, body: any, selfId: string | null) {
  let source = String(body.source || "").trim();
  const dest = String(body.destination || "").trim();
  if (!source.startsWith("/")) return { error: "source_must_start_with_slash" };
  if (!dest) return { error: "destination_required" };
  source = source.toLowerCase().replace(/\/+$/, "") || "/";
  if (source === dest.toLowerCase()) return { error: "source_equals_destination" };

  const patch: Record<string, unknown> = { source };
  let warning: string | undefined;
  const { data: all } = await supabase.from("redirects").select("id,source,destination,is_active");
  const rules = (all || []).filter((r: any) => r.is_active && r.id !== selfId);
  if (rules.some((r: any) => r.source === source)) warning = "overwrites_existing_source";

  // Collapse a chain: while the destination is itself another rule's source,
  // follow it to the final target (max 10 hops); a cycle is a loop.
  const bySource = new Map<string, string>(rules.map((r: any) => [r.source, r.destination]));
  let target = dest;
  const seen = new Set<string>([source]);
  for (let i = 0; i < 10 && bySource.has(target.toLowerCase()); i++) {
    const next = bySource.get(target.toLowerCase())!;
    if (seen.has(next.toLowerCase())) return { error: "redirect_loop" };
    seen.add(next.toLowerCase());
    target = next;
    warning = "chain_collapsed";
  }
  if (target.toLowerCase() === source) return { error: "redirect_loop" };
  if (target !== dest) patch.destination = target;
  return { patch, warning };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

async function guard(request: Request, table: string) {
  const col = collectionFor(table);
  if (!col) return { error: NextResponse.json({ error: "unknown_table" }, { status: 404 }) };
  const user = getAdmin(request);
  if (!user || (user.role !== "admin" && user.role !== "editor")) {
    return { error: NextResponse.json({ error: "unauthorized" }, { status: 401 }) };
  }
  // Admin-only collections (e.g. bookings with customer PII) are hidden from editors.
  if (col.adminOnly && user.role !== "admin") {
    return { error: NextResponse.json({ error: "forbidden" }, { status: 403 }) };
  }
  const supabase = getServiceClient();
  if (!supabase) return { error: NextResponse.json({ error: "supabase_not_configured" }, { status: 500 }) };
  return { col, supabase };
}

// LIST
export async function GET(request: Request, { params }: { params: Promise<{ table: string }> }) {
  const { table } = await params;
  const g = await guard(request, table);
  if (g.error) return g.error;
  const { data, error } = await g.supabase.from(table).select("*").order(g.col.defaultOrder, { ascending: g.col.defaultOrder !== "created_at" });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

// CREATE
export async function POST(request: Request, { params }: { params: Promise<{ table: string }> }) {
  const { table } = await params;
  const g = await guard(request, table);
  if (g.error) return g.error;
  if (g.col.readOnly) return NextResponse.json({ error: "read_only" }, { status: 400 });
  const body = await request.json();
  let warning: string | undefined;
  if (table === "redirects") {
    const v = await prepRedirect(g.supabase, body, null);
    if ("error" in v && v.error) return NextResponse.json({ error: v.error }, { status: 400 });
    Object.assign(body, v.patch);
    warning = v.warning;
  }
  const { data, error } = await g.supabase.from(table).insert(body).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  refreshSite();
  return NextResponse.json({ data, warning });
}

// UPDATE
export async function PUT(request: Request, { params }: { params: Promise<{ table: string }> }) {
  const { table } = await params;
  const g = await guard(request, table);
  if (g.error) return g.error;
  const body = await request.json();
  const { id, ...rest } = body;
  if (!id) return NextResponse.json({ error: "missing_id" }, { status: 400 });
  if (g.col.readOnly) {
    // read-only collections may still update the status field (e.g. bookings)
    const allowed: Record<string, unknown> = {};
    if ("status" in rest) allowed.status = rest.status;
    const { data, error } = await g.supabase.from(table).update(allowed).eq("id", id).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    refreshSite();
    return NextResponse.json({ data });
  }
  let warning: string | undefined;
  if (table === "redirects") {
    const v = await prepRedirect(g.supabase, rest, id);
    if ("error" in v && v.error) return NextResponse.json({ error: v.error }, { status: 400 });
    Object.assign(rest, v.patch);
    warning = v.warning;
  }
  const { data, error } = await g.supabase.from(table).update(rest).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  refreshSite();
  return NextResponse.json({ data, warning });
}

// DELETE
export async function DELETE(request: Request, { params }: { params: Promise<{ table: string }> }) {
  const { table } = await params;
  const g = await guard(request, table);
  if (g.error) return g.error;
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "missing_id" }, { status: 400 });
  const { error } = await g.supabase.from(table).delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  refreshSite();
  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServiceClient } from "@/lib/supabase";
import { verifyAdmin } from "@/lib/admin/auth";
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

async function guard(request: Request, table: string) {
  const col = collectionFor(table);
  if (!col) return { error: NextResponse.json({ error: "unknown_table" }, { status: 404 }) };
  const ok = await verifyAdmin(request);
  if (!ok) return { error: NextResponse.json({ error: "unauthorized" }, { status: 401 }) };
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
  const { data, error } = await g.supabase.from(table).insert(body).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  refreshSite();
  return NextResponse.json({ data });
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
  const { data, error } = await g.supabase.from(table).update(rest).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  refreshSite();
  return NextResponse.json({ data });
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

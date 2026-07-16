import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServiceClient } from "@/lib/supabase";
import { verifyAdmin } from "@/lib/admin/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Pulls the latest media from an Instagram account into `instagram_posts`.
 * Requires INSTAGRAM_ACCESS_TOKEN (Instagram Basic Display long-lived token) in env.
 * POST with an admin Bearer token. Without the IG token it returns a helpful message.
 */
export async function POST(request: Request) {
  if (!(await verifyAdmin(request))) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const supabase = getServiceClient();
  if (!supabase) return NextResponse.json({ error: "supabase_not_configured" }, { status: 500 });

  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) {
    return NextResponse.json({
      ok: false,
      error: "no_instagram_token",
      help: "Set INSTAGRAM_ACCESS_TOKEN (Instagram Basic Display long-lived token) in your environment to enable auto-sync. Until then, add posts manually in the admin.",
    }, { status: 400 });
  }

  const fields = "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp";
  const url = `https://graph.instagram.com/me/media?fields=${fields}&limit=24&access_token=${token}`;

  let json: { data?: Array<Record<string, string>>; error?: { message?: string } };
  try {
    const res = await fetch(url, { cache: "no-store" });
    json = await res.json();
  } catch (e) {
    return NextResponse.json({ error: "fetch_failed", detail: (e as Error).message }, { status: 502 });
  }
  if (json.error) return NextResponse.json({ error: "instagram_error", detail: json.error.message }, { status: 502 });

  const items = (json.data || []).map((m, i) => {
    const isVideo = m.media_type === "VIDEO";
    return {
      external_id: m.id,
      sort_order: i,
      is_published: true,
      is_video: isVideo,
      image_url: isVideo ? (m.thumbnail_url || m.media_url) : m.media_url,
      permalink: m.permalink,
      caption_ar: m.caption || "",
      caption_en: m.caption || "",
    };
  });

  if (items.length === 0) return NextResponse.json({ ok: true, synced: 0 });

  const { error } = await supabase.from("instagram_posts").upsert(items, { onConflict: "external_id" });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, synced: items.length });
}

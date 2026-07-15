import type { MediaItem } from "./types";
import { getServiceClient, getAnonClient } from "@/lib/supabase";
import { mediaContent, GALLERY_SLOTS } from "@/lib/content/media";

export function mediaSeed(): MediaItem[] {
  const ar = mediaContent("ar");
  const en = mediaContent("en");
  const gallery: MediaItem[] = GALLERY_SLOTS.map((g, i) => ({
    id: "g" + i, type: "gallery", gc: g.gc, gr: g.gr, title: { ar: "", en: "" },
  }));
  const videos: MediaItem[] = ar.videos.map((v, i) => ({
    id: "v" + i, type: "video", gc: v.gc, gr: v.gr, title: { ar: v.title, en: en.videos[i]?.title ?? "" },
  }));
  return [...gallery, ...videos];
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function rowTo(r: any): MediaItem {
  return {
    id: r.id, type: r.type === "video" ? "video" : "gallery",
    imageUrl: r.image_url ?? undefined, videoUrl: r.video_url ?? undefined,
    gc: r.span_gc ?? "auto", gr: r.span_gr ?? "auto",
    title: { ar: r.title_ar ?? "", en: r.title_en ?? "" },
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export async function getMedia(): Promise<MediaItem[]> {
  const supabase = getServiceClient() ?? getAnonClient();
  if (!supabase) return mediaSeed();
  const { data, error } = await supabase.from("media_items").select("*").eq("is_published", true).order("sort_order", { ascending: true });
  if (error || !data || data.length === 0) return mediaSeed();
  return data.map(rowTo);
}

import type { InstagramPost } from "./types";
import { getServiceClient, getAnonClient } from "@/lib/supabase";

// A few placeholders so the section renders before real posts are added/synced.
export function instagramSeed(): InstagramPost[] {
  return Array.from({ length: 6 }, (_, i) => ({
    id: "ig" + i,
    caption: { ar: "", en: "" },
    permalink: "https://www.instagram.com/dr.ahmed.marzok/",
    isVideo: i % 3 === 0,
  }));
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function rowTo(r: any): InstagramPost {
  return {
    id: r.id,
    imageUrl: r.image_url ?? undefined,
    permalink: r.permalink ?? undefined,
    isVideo: !!r.is_video,
    caption: { ar: r.caption_ar ?? "", en: r.caption_en ?? "" },
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export async function getInstagramPosts(): Promise<InstagramPost[]> {
  const supabase = getServiceClient() ?? getAnonClient();
  if (!supabase) return instagramSeed();
  const { data, error } = await supabase.from("instagram_posts").select("*").eq("is_published", true).order("sort_order", { ascending: true });
  if (error || !data || data.length === 0) return instagramSeed();
  return data.map(rowTo);
}

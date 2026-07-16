import type { InstagramPost } from "./types";
import { getServiceClient, getAnonClient } from "@/lib/supabase";

// Instagram posts are added manually from the admin dashboard only.
// No placeholders and no API fetch — the section stays hidden until posts exist.
export function instagramSeed(): InstagramPost[] {
  return [];
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

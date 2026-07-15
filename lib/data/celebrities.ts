import type { Celebrity } from "./types";
import { getServiceClient, getAnonClient } from "@/lib/supabase";
import { homeContent } from "@/lib/content/home";

export function celebritiesSeed(): Celebrity[] {
  const ar = homeContent("ar").celebs;
  const en = homeContent("en").celebs;
  return ar.map((c, i) => ({
    id: String(i),
    name: { ar: c.name, en: en[i]?.name ?? "" },
    caption: { ar: c.caption, en: en[i]?.caption ?? "" },
  }));
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function rowTo(r: any): Celebrity {
  return { id: r.id, imageUrl: r.image_url ?? undefined, name: { ar: r.name_ar ?? "", en: r.name_en ?? "" }, caption: { ar: r.caption_ar ?? "", en: r.caption_en ?? "" } };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export async function getCelebrities(): Promise<Celebrity[]> {
  const supabase = getServiceClient() ?? getAnonClient();
  if (!supabase) return celebritiesSeed();
  const { data, error } = await supabase.from("celebrities").select("*").eq("is_published", true).order("sort_order", { ascending: true });
  if (error || !data || data.length === 0) return celebritiesSeed();
  return data.map(rowTo);
}

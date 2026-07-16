import type { HeroSlide, Stat, ValueItem, Feature } from "./types";
import { getServiceClient, getAnonClient } from "@/lib/supabase";
import { homeContent } from "@/lib/content/home";

/* eslint-disable @typescript-eslint/no-explicit-any */

// ---------- Seeds (zipped AR/EN from the built-in content) ----------
export function heroSlidesSeed(): HeroSlide[] {
  const ar = homeContent("ar"), en = homeContent("en");
  return ar.slides.map((s, i) => ({
    id: String(i),
    imageUrl: "/" + ar.heroImages[i],
    kicker: { ar: s.kicker, en: en.slides[i]?.kicker ?? "" },
    title1: { ar: s.t1, en: en.slides[i]?.t1 ?? "" },
    title2: { ar: s.t2, en: en.slides[i]?.t2 ?? "" },
    sub: { ar: s.sub, en: en.slides[i]?.sub ?? "" },
  }));
}
export function statsSeed(): Stat[] {
  const ar = homeContent("ar").stats, en = homeContent("en").stats;
  return ar.map((s, i) => ({ id: String(i), num: { ar: s.num, en: en[i]?.num ?? "" }, label: { ar: s.label, en: en[i]?.label ?? "" } }));
}
export function valuesSeed(): ValueItem[] {
  const ar = homeContent("ar").vm, en = homeContent("en").vm;
  return ar.map((v, i) => ({ id: String(i), num: v.num, title: { ar: v.title, en: en[i]?.title ?? "" }, body: { ar: v.body, en: en[i]?.body ?? "" } }));
}
export function featuresSeed(): Feature[] {
  const ar = homeContent("ar").why, en = homeContent("en").why;
  return ar.map((w, i) => ({ id: String(i), glyph: w.glyph, title: { ar: w.title, en: en[i]?.title ?? "" }, desc: { ar: w.desc, en: en[i]?.desc ?? "" } }));
}

// ---------- Row mappers ----------
const heroRow = (r: any): HeroSlide => ({ id: r.id, imageUrl: r.image_url ?? undefined, kicker: { ar: r.kicker_ar ?? "", en: r.kicker_en ?? "" }, title1: { ar: r.title1_ar ?? "", en: r.title1_en ?? "" }, title2: { ar: r.title2_ar ?? "", en: r.title2_en ?? "" }, sub: { ar: r.sub_ar ?? "", en: r.sub_en ?? "" } });
const statRow = (r: any): Stat => ({ id: r.id, num: { ar: r.num_ar ?? "", en: r.num_en ?? "" }, label: { ar: r.label_ar ?? "", en: r.label_en ?? "" } });
const valueRow = (r: any): ValueItem => ({ id: r.id, num: r.num ?? "", title: { ar: r.title_ar ?? "", en: r.title_en ?? "" }, body: { ar: r.body_ar ?? "", en: r.body_en ?? "" } });
const featureRow = (r: any): Feature => ({ id: r.id, glyph: r.glyph ?? "", title: { ar: r.title_ar ?? "", en: r.title_en ?? "" }, desc: { ar: r.desc_ar ?? "", en: r.desc_en ?? "" } });

async function fetchOr<T>(table: string, map: (r: any) => T, seed: () => T[]): Promise<T[]> {
  const supabase = getServiceClient() ?? getAnonClient();
  if (!supabase) return seed();
  const { data, error } = await supabase.from(table).select("*").eq("is_published", true).order("sort_order", { ascending: true });
  if (error || !data || data.length === 0) return seed();
  return data.map(map);
}

export const getHeroSlides = () => fetchOr("hero_slides", heroRow, heroSlidesSeed);
export const getStats = () => fetchOr("hero_stats", statRow, statsSeed);
export const getValues = () => fetchOr("value_items", valueRow, valuesSeed);
export const getFeatures = () => fetchOr("feature_items", featureRow, featuresSeed);
/* eslint-enable @typescript-eslint/no-explicit-any */

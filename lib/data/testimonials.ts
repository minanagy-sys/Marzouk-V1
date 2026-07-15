import type { Testimonial } from "./types";
import { getServiceClient, getAnonClient } from "@/lib/supabase";
import { aboutContent } from "@/lib/content/about";

export function testimonialsSeed(): Testimonial[] {
  const ar = aboutContent("ar").testimonials;
  const en = aboutContent("en").testimonials;
  return ar.map((t, i) => ({ id: String(i), name: t.name, text: { ar: t.text, en: en[i]?.text ?? "" } }));
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function rowTo(r: any): Testimonial {
  return { id: r.id, name: r.name ?? "", text: { ar: r.text_ar ?? "", en: r.text_en ?? "" } };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = getServiceClient() ?? getAnonClient();
  if (!supabase) return testimonialsSeed();
  const { data, error } = await supabase.from("testimonials").select("*").eq("is_published", true).order("sort_order", { ascending: true });
  if (error || !data || data.length === 0) return testimonialsSeed();
  return data.map(rowTo);
}

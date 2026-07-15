import type { BlogPostBi } from "./types";
import { getServiceClient, getAnonClient } from "@/lib/supabase";
import { blogPosts as seedPosts } from "@/lib/content/blogs";

export function blogSeed(): BlogPostBi[] {
  const ar = seedPosts("ar");
  const en = seedPosts("en");
  return ar.map((p, i) => ({
    slug: p.slug,
    date: p.date,
    tag: { ar: p.tag, en: en[i]?.tag ?? "" },
    title: { ar: p.title, en: en[i]?.title ?? "" },
    excerpt: { ar: p.excerpt, en: en[i]?.excerpt ?? "" },
    body: { ar: p.body, en: en[i]?.body ?? [] },
  }));
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function rowTo(r: any): BlogPostBi {
  const toArr = (v: any): string[] => (Array.isArray(v) ? v : typeof v === "string" && v ? [v] : []);
  return {
    slug: r.slug,
    imageUrl: r.image_url ?? undefined,
    date: r.published_date ?? "",
    tag: { ar: r.tag_ar ?? "", en: r.tag_en ?? "" },
    title: { ar: r.title_ar ?? "", en: r.title_en ?? "" },
    excerpt: { ar: r.excerpt_ar ?? "", en: r.excerpt_en ?? "" },
    body: { ar: toArr(r.body_ar), en: toArr(r.body_en) },
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export async function getBlogPostsBi(): Promise<BlogPostBi[]> {
  const supabase = getServiceClient() ?? getAnonClient();
  if (!supabase) return blogSeed();
  const { data, error } = await supabase.from("blog_posts").select("*").eq("is_published", true).order("sort_order", { ascending: true });
  if (error || !data || data.length === 0) return blogSeed();
  return data.map(rowTo);
}

export async function getBlogPostBi(slug: string): Promise<BlogPostBi | undefined> {
  const supabase = getServiceClient() ?? getAnonClient();
  if (!supabase) return blogSeed().find((p) => p.slug === slug);
  const { data, error } = await supabase.from("blog_posts").select("*").eq("slug", slug).single();
  if (error || !data) return blogSeed().find((p) => p.slug === slug);
  return rowTo(data);
}

export async function getBlogSlugsBi(): Promise<string[]> {
  return (await getBlogPostsBi()).map((p) => p.slug);
}

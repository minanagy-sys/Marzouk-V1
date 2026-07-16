import type { BlogPostBi, BlogCategory } from "./types";
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
  const cat = r.blog_categories;
  return {
    slug: r.slug,
    imageUrl: r.image_url ?? undefined,
    date: r.published_date ?? "",
    tag: { ar: r.tag_ar ?? "", en: r.tag_en ?? "" },
    title: { ar: r.title_ar ?? "", en: r.title_en ?? "" },
    excerpt: { ar: r.excerpt_ar ?? "", en: r.excerpt_en ?? "" },
    body: { ar: toArr(r.body_ar), en: toArr(r.body_en) },
    categorySlug: cat?.slug ?? undefined,
    categoryName: cat ? { ar: cat.name_ar ?? "", en: cat.name_en ?? "" } : undefined,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

const SELECT_WITH_CAT = "*, blog_categories(slug, name_ar, name_en)";

export async function getBlogPostsBi(): Promise<BlogPostBi[]> {
  const supabase = getServiceClient() ?? getAnonClient();
  if (!supabase) return blogSeed();
  let res = await supabase.from("blog_posts").select(SELECT_WITH_CAT).eq("is_published", true).order("sort_order", { ascending: true });
  if (res.error) res = await supabase.from("blog_posts").select("*").eq("is_published", true).order("sort_order", { ascending: true });
  if (res.error || !res.data || res.data.length === 0) return blogSeed();
  return res.data.map(rowTo);
}

export async function getBlogPostBi(slug: string): Promise<BlogPostBi | undefined> {
  const supabase = getServiceClient() ?? getAnonClient();
  if (!supabase) return blogSeed().find((p) => p.slug === slug);
  let res = await supabase.from("blog_posts").select(SELECT_WITH_CAT).eq("slug", slug).single();
  if (res.error) res = await supabase.from("blog_posts").select("*").eq("slug", slug).single();
  if (res.error || !res.data) return blogSeed().find((p) => p.slug === slug);
  return rowTo(res.data);
}

export async function getBlogCategories(): Promise<BlogCategory[]> {
  const supabase = getServiceClient() ?? getAnonClient();
  if (!supabase) return [];
  const { data, error } = await supabase.from("blog_categories").select("*").eq("is_published", true).order("sort_order", { ascending: true });
  if (error || !data) return [];
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  return data.map((c: any) => ({ id: c.id, slug: c.slug, name: { ar: c.name_ar ?? "", en: c.name_en ?? "" } }));
}

export async function getBlogSlugsBi(): Promise<string[]> {
  return (await getBlogPostsBi()).map((p) => p.slug);
}

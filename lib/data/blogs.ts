import type { BlogPostBi, BlogCategory } from "./types";
import { getServiceClient, getAnonClient } from "@/lib/supabase";
import { blogPosts as seedPosts } from "@/lib/content/blogs";
import { slugify } from "@/lib/admin/slug";

const paragraphsToHtml = (arr: string[]): string => arr.map((p) => `<p>${p}</p>`).join("");

export function blogSeed(): BlogPostBi[] {
  const ar = seedPosts("ar");
  const en = seedPosts("en");
  return ar.map((p, i) => ({
    slug: p.slug,
    slugAr: slugify(p.title),
    slugEn: p.slug,
    date: p.date,
    tag: { ar: p.tag, en: en[i]?.tag ?? "" },
    title: { ar: p.title, en: en[i]?.title ?? "" },
    excerpt: { ar: p.excerpt, en: en[i]?.excerpt ?? "" },
    body: { ar: paragraphsToHtml(p.body), en: paragraphsToHtml(en[i]?.body ?? []) },
  }));
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function rowTo(r: any): BlogPostBi {
  // body columns may hold HTML (from the rich-text editor) or a paragraph array (seed).
  const toHtml = (v: any): string => (Array.isArray(v) ? v.map((p) => `<p>${p}</p>`).join("") : typeof v === "string" ? v : "");
  const cat = r.blog_categories;
  return {
    slug: r.slug,
    slugAr: r.slug_ar ?? undefined,
    slugEn: r.slug_en ?? undefined,
    imageUrl: r.image_url ?? undefined,
    date: r.published_date ?? "",
    tag: { ar: r.tag_ar ?? "", en: r.tag_en ?? "" },
    title: { ar: r.title_ar ?? "", en: r.title_en ?? "" },
    excerpt: { ar: r.excerpt_ar ?? "", en: r.excerpt_en ?? "" },
    body: { ar: toHtml(r.body_ar), en: toHtml(r.body_en) },
    categorySlug: cat?.slug ?? undefined,
    categoryName: cat ? { ar: cat.name_ar ?? "", en: cat.name_en ?? "" } : undefined,
    showOnHome: r.show_on_home ?? true,
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

/** Published posts flagged to appear in the home slider. */
export async function getBlogPostsHome(): Promise<BlogPostBi[]> {
  return (await getBlogPostsBi()).filter((p) => p.showOnHome !== false);
}

export async function getBlogPostBi(slug: string): Promise<BlogPostBi | undefined> {
  const all = await getBlogPostsBi();
  return all.find((p) => p.slug === slug || p.slugAr === slug || p.slugEn === slug);
}

export async function getBlogCategories(): Promise<BlogCategory[]> {
  const supabase = getServiceClient() ?? getAnonClient();
  if (!supabase) return [];
  const { data, error } = await supabase.from("blog_categories").select("*").eq("is_published", true).order("sort_order", { ascending: true });
  if (error || !data) return [];
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  return data.map((c: any) => ({ id: c.id, slug: c.slug, name: { ar: c.name_ar ?? "", en: c.name_en ?? "" } }));
}

/** { lang, slug } params for static generation — ASCII only (Arabic slugs render on-demand). */
export async function getBlogParams(): Promise<{ lang: string; slug: string }[]> {
  const all = await getBlogPostsBi();
  return all
    .flatMap((p) => [
      { lang: "ar", slug: p.slugAr || p.slug },
      { lang: "en", slug: p.slugEn || p.slug },
    ])
    .filter((p) => /^[\x20-\x7E]*$/.test(p.slug));
}

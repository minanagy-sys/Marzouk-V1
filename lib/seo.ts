import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { getServiceClient } from "@/lib/supabase";

/** The brand suffix appended to page titles, per language. */
export const BRAND = { ar: "د. أحمد مرزوق", en: "Dr. Ahmed Marzouk" } as const;

/**
 * Remove a trailing brand suffix (either language) from a title so the global
 * `%s | <brand>` template can append it exactly once. Stored titles and the
 * page defaults sometimes already end with "… | د. أحمد مرزوق"; without this we
 * emit the brand twice. Returns the original title if stripping empties it.
 */
export function stripBrand(title: string): string {
  const cleaned = title
    .replace(/\s*[|\-–—]\s*د\.\s*أحمد\s*مرزوق\s*$/u, "")
    .replace(/\s*[|\-–—]\s*Dr\.?\s*Ahmed\s*Marzouk\s*$/iu, "")
    .trim();
  return cleaned || title.trim();
}

/**
 * Build canonical + hreflang alternates for a page that exists in both
 * languages. Pass the locale-relative paths (starting with "/") for each.
 */
export function altLangs(lang: "ar" | "en", arPath: string, enPath: string) {
  const ar = `${SITE.url}/ar${arPath}`;
  const en = `${SITE.url}/en${enPath}`;
  return {
    canonical: lang === "en" ? en : ar,
    languages: { ar, en, "x-default": ar },
  };
}

/** Make an image URL absolute (OpenGraph requires absolute URLs). */
export function absUrl(url?: string): string | undefined {
  if (!url) return undefined;
  return url.startsWith("http") ? url : `${SITE.url}${url.startsWith("/") ? "" : "/"}${url}`;
}

/** Read a few `site_content` values by key (server-side; {} when no DB). */
async function readSettings(keys: string[]): Promise<Record<string, { ar: string; en: string }>> {
  const db = getServiceClient();
  if (!db) return {};
  const { data } = await db.from("site_content").select("key,value_ar,value_en").in("key", keys);
  const out: Record<string, { ar: string; en: string }> = {};
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  (data as any[] | null)?.forEach((r) => { out[r.key] = { ar: r.value_ar || "", en: r.value_en || "" }; });
  return out;
}

/**
 * Metadata for a static/list page. Title & description are editable from
 * Admin → Site text via keys `seo.<page>.title` / `seo.<page>.desc` (per
 * language); the passed defaults are used when those are empty. Adds canonical,
 * hreflang, OpenGraph and Twitter card (with the editable `seo.ogImage`).
 */
export async function pageMetadata(opts: {
  page: string;
  lang: "ar" | "en";
  arPath: string;
  enPath: string;
  /** Clean, brand-free default titles per language (the template adds the brand). */
  defTitleAr: string;
  defTitleEn: string;
  defDesc: string;
  /** Exact title with no template brand suffix — used by the home page only. */
  absoluteTitle?: string;
}): Promise<Metadata> {
  const { page, lang, arPath, enPath, defTitleAr, defTitleEn, defDesc, absoluteTitle } = opts;
  const s = await readSettings([`seo.${page}.title`, `seo.${page}.desc`, "seo.ogImage"]);
  const pick = (v: { ar: string; en: string } | undefined) => (v ? (lang === "ar" ? v.ar : v.en) : "");
  const dbTitle = pick(s[`seo.${page}.title`]);
  // Brand-free page title (the layout template appends "| <brand>" once).
  const bare = stripBrand(dbTitle || (lang === "ar" ? defTitleAr : defTitleEn));
  const description = pick(s[`seo.${page}.desc`]) || defDesc;
  const ogImage = absUrl(s["seo.ogImage"]?.en || s["seo.ogImage"]?.ar);
  const alternates = altLangs(lang, arPath, enPath);
  // Social title should carry the brand explicitly (OG has no template).
  const ogTitle = absoluteTitle || `${bare} | ${BRAND[lang]}`;
  return {
    title: absoluteTitle ? { absolute: absoluteTitle } : bare,
    description,
    alternates,
    openGraph: {
      title: ogTitle, description, url: alternates.canonical, type: "website", siteName: BRAND[lang],
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    twitter: { card: "summary_large_image", title: ogTitle, description, ...(ogImage ? { images: [ogImage] } : {}) },
  };
}

import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { absUrl } from "@/lib/seo";
import { getServices } from "@/lib/data/services";
import { getCases } from "@/lib/data/cases";
import { getBlogPostsBi } from "@/lib/data/blogs";

const LOCALES = ["ar", "en"] as const;
const BASE = SITE.url.replace(/\/+$/, "");
const NOW = new Date();

const loc = (lang: "ar" | "en", path: string) => `${BASE}/${lang}${path}`;

/** A record that exists in both languages with (optionally) its own slug + cover. */
type Localizable = { slug: string; slugAr?: string; slugEn?: string; imageUrl?: string };

/**
 * One sitemap entry per language for a record, each carrying reciprocal
 * hreflang alternates (ar / en / x-default→ar) and, when present, the record's
 * cover image as an <image:image> extension.
 */
function localizedEntries(
  items: Localizable[],
  seg: string,
  priority: number,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
): MetadataRoute.Sitemap {
  const out: MetadataRoute.Sitemap = [];
  for (const it of items) {
    const arPath = `${seg}/${it.slugAr || it.slug}`;
    const enPath = `${seg}/${it.slugEn || it.slug}`;
    const ar = loc("ar", arPath);
    const en = loc("en", enPath);
    const languages = { ar, en, "x-default": ar };
    const img = absUrl(it.imageUrl);
    const images = img ? [img] : undefined;
    out.push({ url: ar, lastModified: NOW, changeFrequency, priority, alternates: { languages }, ...(images ? { images } : {}) });
    out.push({ url: en, lastModified: NOW, changeFrequency, priority, alternates: { languages }, ...(images ? { images } : {}) });
  }
  return out;
}

/** Static pages: same path in both languages, reciprocal hreflang + x-default. */
function staticEntry(path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]): MetadataRoute.Sitemap {
  const ar = loc("ar", path);
  const en = loc("en", path);
  const languages = { ar, en, "x-default": ar };
  return LOCALES.map((l) => ({
    url: loc(l, path),
    lastModified: NOW,
    changeFrequency,
    priority,
    alternates: { languages },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, cases, posts] = await Promise.all([
    getServices(),
    getCases(),
    getBlogPostsBi(),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    ...staticEntry("", 1.0, "daily"),
    ...staticEntry("/services", 0.9, "weekly"),
    ...staticEntry("/about", 0.7, "monthly"),
    ...staticEntry("/cases", 0.7, "weekly"),
    ...staticEntry("/blogs", 0.8, "weekly"),
    ...staticEntry("/media", 0.6, "weekly"),
    ...staticEntry("/contact", 0.6, "yearly"),
  ];

  return [
    ...staticPages,
    ...localizedEntries(services, "/services", 0.8, "monthly"),
    ...localizedEntries(cases, "/cases", 0.6, "monthly"),
    ...localizedEntries(posts, "/blogs", 0.7, "weekly"),
  ];
}

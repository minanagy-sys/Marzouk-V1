import { SITE } from "@/lib/site";
import { absUrl } from "@/lib/seo";
import { getServices } from "@/lib/data/services";
import { getCases } from "@/lib/data/cases";
import { getBlogPostsBi } from "@/lib/data/blogs";

/**
 * Shared sitemap builder. `/sitemap.xml` is a sitemap INDEX that links to one
 * sub-sitemap per category (/sitemaps/<file>), each carrying hreflang alternates
 * (ar / en / x-default) and cover-image extensions. All views share one XSL
 * stylesheet (/sitemap.xsl) so they render as clean tables in the browser.
 */

export const BASE = SITE.url.replace(/\/+$/, "");
export const STYLESHEET = `<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>`;

/** XML-escape text / attribute values. */
const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

/** Absolute URL for a locale + path segments, percent-encoding non-ASCII slugs. */
const locUrl = (lang: "ar" | "en", segments: string[]) =>
  `${BASE}/${lang}${segments.map((s) => encodeURIComponent(s)).map((s) => `/${s}`).join("")}`;

export type Entry = {
  loc: string;
  alts: { hreflang: string; href: string }[];
  images: string[];
  changefreq: string;
  priority: string;
};

/** The sub-sitemaps that make up the index (order shown in the index table). */
export const SUB_SITEMAPS: { file: string; label: string }[] = [
  { file: "pages.xml", label: "Pages" },
  { file: "services.xml", label: "Services" },
  { file: "cases.xml", label: "Cases" },
  { file: "blogs.xml", label: "Blog" },
];

function staticEntries(path: string[], priority: string, changefreq: string): Entry[] {
  const ar = locUrl("ar", path);
  const en = locUrl("en", path);
  const alts = [
    { hreflang: "ar", href: ar },
    { hreflang: "en", href: en },
    { hreflang: "x-default", href: ar },
  ];
  return [
    { loc: ar, alts, images: [], changefreq, priority },
    { loc: en, alts, images: [], changefreq, priority },
  ];
}

function localizedEntries(
  items: { slug: string; slugAr?: string; slugEn?: string; imageUrl?: string }[],
  seg: string,
  priority: string,
  changefreq: string,
): Entry[] {
  const out: Entry[] = [];
  for (const it of items) {
    const ar = locUrl("ar", [seg, it.slugAr || it.slug]);
    const en = locUrl("en", [seg, it.slugEn || it.slug]);
    const alts = [
      { hreflang: "ar", href: ar },
      { hreflang: "en", href: en },
      { hreflang: "x-default", href: ar },
    ];
    const img = absUrl(it.imageUrl);
    out.push({ loc: ar, alts, images: img ? [img] : [], changefreq, priority });
    out.push({ loc: en, alts, images: img ? [img] : [], changefreq, priority });
  }
  return out;
}

/** Entries for one sub-sitemap file, or null when the file name is unknown. */
export async function entriesFor(file: string): Promise<Entry[] | null> {
  switch (file) {
    case "pages.xml":
      return [
        ...staticEntries([], "1.0", "daily"),
        ...staticEntries(["about"], "0.7", "monthly"),
        ...staticEntries(["services"], "0.9", "weekly"),
        ...staticEntries(["cases"], "0.7", "weekly"),
        ...staticEntries(["blogs"], "0.8", "weekly"),
        ...staticEntries(["media"], "0.6", "weekly"),
        ...staticEntries(["contact"], "0.6", "yearly"),
      ];
    case "services.xml":
      return localizedEntries(await getServices(), "services", "0.8", "monthly");
    case "cases.xml":
      return localizedEntries(await getCases(), "cases", "0.6", "monthly");
    case "blogs.xml":
      return localizedEntries(await getBlogPostsBi(), "blogs", "0.7", "weekly");
    default:
      return null;
  }
}

function renderEntry(e: Entry): string {
  const alts = e.alts.map((a) => `    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${esc(a.href)}"/>`).join("\n");
  const imgs = e.images.map((i) => `    <image:image><image:loc>${esc(i)}</image:loc></image:image>`).join("\n");
  return [
    "  <url>",
    `    <loc>${esc(e.loc)}</loc>`,
    alts,
    imgs || null,
    `    <lastmod>${new Date().toISOString()}</lastmod>`,
    `    <changefreq>${e.changefreq}</changefreq>`,
    `    <priority>${e.priority}</priority>`,
    "  </url>",
  ].filter(Boolean).join("\n");
}

/** Render a <urlset> document (one sub-sitemap). */
export function renderUrlset(entries: Entry[]): string {
  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n${STYLESHEET}\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"` +
    ` xmlns:xhtml="http://www.w3.org/1999/xhtml"` +
    ` xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n` +
    entries.map(renderEntry).join("\n") +
    `\n</urlset>\n`
  );
}

/** Render the <sitemapindex> document (the top-level /sitemap.xml). */
export function renderIndex(): string {
  const now = new Date().toISOString();
  const items = SUB_SITEMAPS.map(
    (s) => `  <sitemap>\n    <loc>${BASE}/sitemaps/${s.file}</loc>\n    <lastmod>${now}</lastmod>\n  </sitemap>`,
  ).join("\n");
  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n${STYLESHEET}\n` +
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    items +
    `\n</sitemapindex>\n`
  );
}

export const XML_HEADERS = {
  "Content-Type": "application/xml; charset=utf-8",
  "Cache-Control": "public, max-age=0, s-maxage=3600, must-revalidate",
};

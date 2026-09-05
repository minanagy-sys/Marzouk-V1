import { SITE } from "@/lib/site";
import { absUrl } from "@/lib/seo";
import { getServices } from "@/lib/data/services";
import { getCases } from "@/lib/data/cases";
import { getBlogPostsBi } from "@/lib/data/blogs";

export const runtime = "nodejs";
export const revalidate = 3600;

const BASE = SITE.url.replace(/\/+$/, "");
const NOW = new Date().toISOString();

/** XML-escape text content / attribute values. */
const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

/** Absolute URL for a locale + path, percent-encoding non-ASCII slug characters. */
const url = (lang: "ar" | "en", segments: string[]) =>
  `${BASE}/${lang}${segments.map((s) => encodeURIComponent(s)).map((s) => `/${s}`).join("")}`;

type Entry = {
  loc: string;
  alts: { hreflang: string; href: string }[];
  images: string[];
  changefreq: string;
  priority: string;
};

function renderEntry(e: Entry): string {
  const alts = e.alts.map((a) => `    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${esc(a.href)}"/>`).join("\n");
  const imgs = e.images.map((i) => `    <image:image><image:loc>${esc(i)}</image:loc></image:image>`).join("\n");
  return [
    "  <url>",
    `    <loc>${esc(e.loc)}</loc>`,
    alts,
    imgs || null,
    `    <lastmod>${NOW}</lastmod>`,
    `    <changefreq>${e.changefreq}</changefreq>`,
    `    <priority>${e.priority}</priority>`,
    "  </url>",
  ].filter(Boolean).join("\n");
}

/** A static page: same path both languages, reciprocal hreflang + x-default→ar. */
function staticEntries(path: string[], priority: string, changefreq: string): Entry[] {
  const ar = url("ar", path);
  const en = url("en", path);
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

/** A record present in both languages, with its own slug + cover image. */
function localizedEntries(
  items: { slug: string; slugAr?: string; slugEn?: string; imageUrl?: string }[],
  seg: string,
  priority: string,
  changefreq: string,
): Entry[] {
  const out: Entry[] = [];
  for (const it of items) {
    const ar = url("ar", [seg, it.slugAr || it.slug]);
    const en = url("en", [seg, it.slugEn || it.slug]);
    const alts = [
      { hreflang: "ar", href: ar },
      { hreflang: "en", href: en },
      { hreflang: "x-default", href: ar },
    ];
    const img = absUrl(it.imageUrl);
    const images = img ? [img] : [];
    out.push({ loc: ar, alts, images, changefreq, priority });
    out.push({ loc: en, alts, images, changefreq, priority });
  }
  return out;
}

export async function GET() {
  const [services, cases, posts] = await Promise.all([getServices(), getCases(), getBlogPostsBi()]);

  const entries: Entry[] = [
    ...staticEntries([], "1.0", "daily"),
    ...staticEntries(["services"], "0.9", "weekly"),
    ...staticEntries(["about"], "0.7", "monthly"),
    ...staticEntries(["cases"], "0.7", "weekly"),
    ...staticEntries(["blogs"], "0.8", "weekly"),
    ...staticEntries(["media"], "0.6", "weekly"),
    ...staticEntries(["contact"], "0.6", "yearly"),
    ...localizedEntries(services, "services", "0.8", "monthly"),
    ...localizedEntries(cases, "cases", "0.6", "monthly"),
    ...localizedEntries(posts, "blogs", "0.7", "weekly"),
  ];

  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"` +
    ` xmlns:xhtml="http://www.w3.org/1999/xhtml"` +
    ` xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n` +
    entries.map(renderEntry).join("\n") +
    `\n</urlset>\n`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, must-revalidate",
    },
  });
}

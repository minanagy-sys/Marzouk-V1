import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { getServiceParams } from "@/lib/data/services";
import { getCaseParams } from "@/lib/data/cases";
import { getBlogParams } from "@/lib/data/blogs";

const LOCALES = ["ar", "en"] as const;

/** Build an entry with hreflang alternates for both languages. */
function entry(pathAr: string, pathEn: string, lang: "ar" | "en", priority: number, changeFrequency: "weekly" | "monthly") {
  const ar = `${SITE.url}/ar${pathAr}`;
  const en = `${SITE.url}/en${pathEn}`;
  return {
    url: lang === "en" ? en : ar,
    lastModified: new Date(),
    changeFrequency,
    priority,
    alternates: { languages: { ar, en } },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = ["", "/about", "/services", "/cases", "/blogs", "/media", "/contact"];
  const staticPages = LOCALES.flatMap((l) =>
    staticPaths.map((p) => entry(p, p, l, p === "" ? 1 : 0.8, "weekly")),
  );

  const [services, cases, posts] = await Promise.all([getServiceParams(), getCaseParams(), getBlogParams()]);
  // Group localized slugs by their record so ar/en alternates pair up.
  const pair = (arr: { lang: string; slug: string }[], seg: string, priority: number) => {
    const out: MetadataRoute.Sitemap = [];
    for (let i = 0; i < arr.length; i += 2) {
      const ar = arr[i], en = arr[i + 1];
      out.push(entry(`${seg}/${ar.slug}`, `${seg}/${en?.slug ?? ar.slug}`, "ar", priority, "monthly"));
      out.push(entry(`${seg}/${ar.slug}`, `${seg}/${en?.slug ?? ar.slug}`, "en", priority, "monthly"));
    }
    return out;
  };

  return [
    ...staticPages,
    ...pair(services, "/services", 0.7),
    ...pair(cases, "/cases", 0.6),
    ...pair(posts, "/blogs", 0.6),
  ];
}

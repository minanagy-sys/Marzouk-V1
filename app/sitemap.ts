import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { getServiceSlugs } from "@/lib/data/services";
import { getCaseSlugs } from "@/lib/data/cases";
import { BLOG_SLUGS } from "@/lib/content/blogs";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url;
  const staticPages = ["", "/about", "/services", "/cases", "/blogs", "/media", "/contact"].map((p) => ({
    url: `${base}${p}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.8,
  }));

  const serviceSlugs = await getServiceSlugs();
  const servicePages = serviceSlugs.map((slug) => ({
    url: `${base}/services/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const caseSlugs = await getCaseSlugs();
  const casePages = caseSlugs.map((slug) => ({
    url: `${base}/cases/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const blogPages = BLOG_SLUGS.map((slug) => ({
    url: `${base}/blogs/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...servicePages, ...casePages, ...blogPages];
}

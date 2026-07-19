import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import CaseDetailView from "./CaseDetailView";
import { getCases, getCase, getCaseParams } from "@/lib/data/cases";
import { pick, slugFor, type Lang } from "@/lib/data/types";
import { altLangs } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const revalidate = 3600;
export const dynamicParams = true; // Arabic slugs render on-demand

export async function generateStaticParams() {
  return getCaseParams();
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const l: Lang = lang === "en" ? "en" : "ar";
  const item = await getCase(slug);
  if (!item) return { title: "Not found" };
  const arSlug = item.slugAr || item.slug;
  const enSlug = item.slugEn || item.slug;
  const title = pick(item.title, l);
  const description = pick(item.excerpt, l);
  const alternates = altLangs(l, `/cases/${arSlug}`, `/cases/${enSlug}`);
  return {
    title,
    description,
    alternates,
    openGraph: { title, description, url: alternates.canonical, type: "article", siteName: SITE.nameAr },
  };
}

export default async function CasePage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const l: Lang = lang === "en" ? "en" : "ar";
  const item = await getCase(slug);
  if (!item) notFound();

  const all = await getCases();
  const related = all.filter((c) => c.slug !== item.slug && c.category === item.category).slice(0, 3);
  const url = `${SITE.url}/${l}/cases/${slugFor(item, l)}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: item.title.en || item.title.ar,
    description: item.excerpt.en || item.excerpt.ar,
    url,
    inLanguage: l,
    author: { "@type": "Physician", name: SITE.nameEn },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <CaseDetailView item={item} related={related} />
    </>
  );
}

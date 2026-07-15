import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import CaseDetailView from "./CaseDetailView";
import { getCases, getCase, getCaseSlugs } from "@/lib/data/cases";
import { SITE } from "@/lib/site";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getCaseSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = await getCase(slug);
  if (!item) return { title: "Not found" };
  const title = item.title.ar;
  const description = item.excerpt.ar;
  const url = `${SITE.url}/cases/${slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "article", siteName: SITE.nameAr },
  };
}

export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getCase(slug);
  if (!item) notFound();

  const all = await getCases();
  const related = all.filter((c) => c.slug !== slug && c.category === item.category).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: item.title.en || item.title.ar,
    description: item.excerpt.en || item.excerpt.ar,
    url: `${SITE.url}/cases/${slug}`,
    author: { "@type": "Physician", name: SITE.nameEn },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <CaseDetailView item={item} related={related} />
    </>
  );
}

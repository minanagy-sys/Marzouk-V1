import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import ServiceDetailView from "./ServiceDetailView";
import { getServices, getService, getServiceParams } from "@/lib/data/services";
import { pick, slugFor, type Lang } from "@/lib/data/types";
import { altLangs } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const revalidate = 3600;

export async function generateStaticParams() {
  return getServiceParams();
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const l: Lang = lang === "en" ? "en" : "ar";
  const service = await getService(slug);
  if (!service) return { title: "Not found" };
  const arSlug = service.slugAr || service.slug;
  const enSlug = service.slugEn || service.slug;
  const title = pick(service.metaTitle, l) || pick(service.title, l);
  const description = pick(service.metaDesc, l) || pick(service.shortDesc, l);
  const alternates = altLangs(l, `/services/${arSlug}`, `/services/${enSlug}`);
  return {
    title,
    description,
    alternates,
    openGraph: { title, description, url: alternates.canonical, type: "article", siteName: SITE.nameAr },
  };
}

export default async function ServicePage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const l: Lang = lang === "en" ? "en" : "ar";
  const service = await getService(slug);
  if (!service) notFound();

  const all = await getServices();
  const related = all.filter((s) => s.slug !== service.slug).slice(0, 3);
  const url = `${SITE.url}/${l}/services/${slugFor(service, l)}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name: service.title.en || service.title.ar,
    description: service.metaDesc.en || service.shortDesc.en,
    url,
    provider: { "@type": "Physician", name: SITE.nameEn, medicalSpecialty: "Gynecologic", telephone: SITE.phone },
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE.url}/${l}` },
      { "@type": "ListItem", position: 2, name: "Services", item: `${SITE.url}/${l}/services` },
      { "@type": "ListItem", position: 3, name: service.title.en || service.title.ar, item: url },
    ],
  };

  return (
    <>
      <JsonLd data={[jsonLd, breadcrumb]} />
      <ServiceDetailView service={service} related={related} />
    </>
  );
}

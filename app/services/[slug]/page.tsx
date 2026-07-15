import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import ServiceDetailView from "./ServiceDetailView";
import { getServices, getService, getServiceSlugs } from "@/lib/data/services";
import { SITE } from "@/lib/site";

export const revalidate = 3600; // ISR: refresh from Supabase hourly

export async function generateStaticParams() {
  const slugs = await getServiceSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) return { title: "Not found" };
  const title = service.metaTitle.ar || service.title.ar;
  const description = service.metaDesc.ar || service.shortDesc.ar;
  const url = `${SITE.url}/services/${slug}`;
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: { ar: url, en: url, "x-default": url },
    },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      siteName: SITE.nameAr,
    },
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) notFound();

  const all = await getServices();
  const related = all.filter((s) => s.slug !== slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name: service.title.en || service.title.ar,
    description: service.metaDesc.en || service.shortDesc.en,
    url: `${SITE.url}/services/${slug}`,
    provider: {
      "@type": "Physician",
      name: SITE.nameEn,
      medicalSpecialty: "Gynecologic",
      telephone: SITE.phone,
    },
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
      { "@type": "ListItem", position: 2, name: "Services", item: `${SITE.url}/services` },
      { "@type": "ListItem", position: 3, name: service.title.en || service.title.ar, item: `${SITE.url}/services/${slug}` },
    ],
  };

  return (
    <>
      <JsonLd data={[jsonLd, breadcrumb]} />
      <ServiceDetailView service={service} related={related} />
    </>
  );
}

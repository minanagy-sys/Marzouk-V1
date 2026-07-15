import HomeView from "./HomeView";
import JsonLd from "@/components/JsonLd";
import { getServices } from "@/lib/data/services";
import { SITE } from "@/lib/site";

export const revalidate = 3600;

export default async function HomePage() {
  const services = await getServices();

  const physician = {
    "@context": "https://schema.org",
    "@type": "Physician",
    name: SITE.nameEn,
    alternateName: SITE.nameAr,
    url: SITE.url,
    telephone: SITE.phone,
    email: SITE.email,
    medicalSpecialty: ["Gynecologic", "Obstetric"],
    address: SITE.clinics.map((c) => ({
      "@type": "PostalAddress",
      name: c.nameEn,
      streetAddress: c.addressEn,
      addressLocality: c.city,
      addressRegion: c.region,
      addressCountry: c.country,
    })),
    location: SITE.clinics.map((c) => ({
      "@type": "MedicalClinic",
      name: c.nameEn,
      address: c.addressEn,
      telephone: SITE.phone,
    })),
  };

  return (
    <>
      <JsonLd data={physician} />
      <HomeView services={services} />
    </>
  );
}

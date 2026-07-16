import HomeView from "./HomeView";
import JsonLd from "@/components/JsonLd";
import { getServices } from "@/lib/data/services";
import { getCelebrities } from "@/lib/data/celebrities";
import { getTestimonials } from "@/lib/data/testimonials";
import { getInstagramPosts } from "@/lib/data/instagram";
import { getBlogPostsBi } from "@/lib/data/blogs";
import { getHeroSlides, getStats, getValues, getFeatures } from "@/lib/data/sections";
import { SITE } from "@/lib/site";

export const revalidate = 3600;

export default async function HomePage() {
  const [services, celebrities, reviews, instagram, posts, heroSlides, stats, values, features] = await Promise.all([
    getServices(),
    getCelebrities(),
    getTestimonials(),
    getInstagramPosts(),
    getBlogPostsBi(),
    getHeroSlides(),
    getStats(),
    getValues(),
    getFeatures(),
  ]);

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
  };

  return (
    <>
      <JsonLd data={physician} />
      <HomeView services={services} celebrities={celebrities} reviews={reviews} instagram={instagram} posts={posts.slice(0, 8)} heroSlides={heroSlides} stats={stats} values={values} features={features} />
    </>
  );
}

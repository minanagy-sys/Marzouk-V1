import HomeView from "./HomeView";
import JsonLd from "@/components/JsonLd";
import { getServicesHome } from "@/lib/data/services";
import { getHomeCelebrities } from "@/lib/data/cases";
import { getTestimonialsHome } from "@/lib/data/testimonials";
import { getInstagramPosts } from "@/lib/data/instagram";
import { getBlogPostsHome } from "@/lib/data/blogs";
import { getHeroSlides, getStats, getValues, getFeatures } from "@/lib/data/sections";
import { SITE } from "@/lib/site";
import { altLangs } from "@/lib/seo";
import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const l: "ar" | "en" = lang === "en" ? "en" : "ar";
  return { alternates: altLangs(l, "", "") };
}

export default async function HomePage() {
  const [services, celebrities, reviews, instagram, posts, heroSlides, stats, values, features] = await Promise.all([
    getServicesHome(),
    getHomeCelebrities(),
    getTestimonialsHome(),
    getInstagramPosts(),
    getBlogPostsHome(),
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

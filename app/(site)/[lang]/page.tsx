import HomeView from "./HomeView";
import JsonLd from "@/components/JsonLd";
import { getServicesHome } from "@/lib/data/services";
import { getHomeCelebrities } from "@/lib/data/cases";
import { getTestimonialsHome } from "@/lib/data/testimonials";
import { getInstagramPosts } from "@/lib/data/instagram";
import { getBlogPostsHome } from "@/lib/data/blogs";
import { getHeroSlides, getStats, getValues, getFeatures } from "@/lib/data/sections";
import { getSiteContent } from "@/lib/data/siteContent";
import { SITE } from "@/lib/site";
import { CONTACT_INFO } from "@/lib/content/common";
import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const l: "ar" | "en" = lang === "en" ? "en" : "ar";
  return pageMetadata({
    page: "home", lang: l, arPath: "", enPath: "",
    absoluteTitle: "د. أحمد مرزوق | Dr. Ahmed Marzouk",
    defTitleAr: "د. أحمد مرزوق", defTitleEn: "Dr. Ahmed Marzouk",
    defDesc: "استشاري النساء والتوليد وجراحة الأورام — مبتكر الولادة بدون ألم في مصر. Consultant of OB-GYN & Oncologic Surgery.",
  });
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

  // Social profile links (from the DB, falling back to the defaults) → sameAs.
  const settings = await getSiteContent();
  const social = ["footer.facebook", "footer.instagram", "footer.youtube", "footer.tiktok", "footer.snapchat"]
    .map((k) => settings[k]?.en || settings[k]?.ar || (CONTACT_INFO as Record<string, string>)[k.replace("footer.", "")] || "")
    .filter((u) => u && /^https?:\/\//.test(u));

  // Aggregate rating from published testimonials (helps rich results).
  const rated = reviews.filter((r) => (r.rating ?? 0) > 0);
  const avg = rated.length ? rated.reduce((s, r) => s + (r.rating ?? 0), 0) / rated.length : 0;

  const physician = {
    "@context": "https://schema.org",
    "@type": ["Physician", "MedicalBusiness"],
    name: SITE.nameEn,
    alternateName: SITE.nameAr,
    url: SITE.url,
    telephone: SITE.phone,
    email: SITE.email,
    medicalSpecialty: ["Gynecologic", "Obstetric"],
    ...(social.length ? { sameAs: social } : {}),
    ...(rated.length ? { aggregateRating: { "@type": "AggregateRating", ratingValue: avg.toFixed(1), reviewCount: rated.length, bestRating: 5 } } : {}),
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

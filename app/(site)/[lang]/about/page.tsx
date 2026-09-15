import type { Metadata } from "next";
import AboutView from "./AboutView";
import JsonLd from "@/components/JsonLd";
import { getTestimonials } from "@/lib/data/testimonials";
import { getValues, getFeatures, getStats } from "@/lib/data/sections";
import { getSiteContent } from "@/lib/data/siteContent";
import { CONTACT_INFO } from "@/lib/content/common";
import type { Lang } from "@/lib/data/types";
import { pageMetadata } from "@/lib/seo";
import { aboutGraph } from "@/lib/schema";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const l: "ar" | "en" = lang === "en" ? "en" : "ar";
  return pageMetadata({
    page: "about", lang: l, arPath: "/about", enPath: "/about",
    defTitleAr: "عن الطبيب", defTitleEn: "About",
    defDesc: "استشاري النساء والتوليد وجراحة الأورام ومبتكر تجربة الولادة بدون ألم في مصر. رعاية إنسانية قبل أن تكون طبية.",
  });
}

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l: Lang = lang === "en" ? "en" : "ar";
  const [testimonials, values, features, stats, settings] = await Promise.all([
    getTestimonials(),
    getValues(),
    getFeatures(),
    getStats(),
    getSiteContent(),
  ]);
  const social = ["footer.facebook", "footer.instagram", "footer.youtube", "footer.tiktok", "footer.snapchat"]
    .map((k) => settings[k]?.en || settings[k]?.ar || (CONTACT_INFO as Record<string, string>)[k.replace("footer.", "")] || "")
    .filter((u) => u && /^https?:\/\//.test(u));
  return (
    <>
      <JsonLd data={aboutGraph(l, social)} />
      <AboutView testimonials={testimonials} values={values} features={features} stats={stats} />
    </>
  );
}

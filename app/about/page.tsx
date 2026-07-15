import type { Metadata } from "next";
import AboutView from "./AboutView";
import { getTestimonials } from "@/lib/data/testimonials";
import { SITE } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "عن د. أحمد مرزوق — About",
  description:
    "استشاري النساء والتوليد وجراحة الأورام ومبتكر تجربة الولادة بدون ألم في مصر. رعاية إنسانية قبل أن تكون طبية.",
  alternates: { canonical: `${SITE.url}/about` },
};

export default async function AboutPage() {
  const testimonials = await getTestimonials();
  return <AboutView testimonials={testimonials} />;
}

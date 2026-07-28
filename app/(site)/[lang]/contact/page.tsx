import type { Metadata } from "next";
import ContactView from "./ContactView";
import { getClinics } from "@/lib/data/clinics";
import { SITE } from "@/lib/site";
import { altLangs } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const l: "ar" | "en" = lang === "en" ? "en" : "ar";
  return {
  title: "اتصل بنا — Contact",
  description:
    "احجزي موعدك مع د. أحمد مرزوق — عيادة التجمع الخامس، بولاريس مول. Book an appointment — Fifth Settlement clinic, Polaris Mall.",
  alternates: altLangs(l, "/contact", "/contact"),
  };
}

export default async function ContactPage() {
  const clinics = await getClinics();
  return <ContactView clinics={clinics} />;
}

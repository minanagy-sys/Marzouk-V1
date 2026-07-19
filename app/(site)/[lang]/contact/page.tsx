import type { Metadata } from "next";
import ContactView from "./ContactView";
import { getClinics } from "@/lib/data/clinics";
import { getServices } from "@/lib/data/services";
import { SITE } from "@/lib/site";
import { altLangs } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const l: "ar" | "en" = lang === "en" ? "en" : "ar";
  return {
  title: "اتصل بنا — Contact",
  description:
    "احجزي موعدك مع د. أحمد مرزوق — عيادتا التجمع الخامس ومدينة نصر. Book an appointment — Fifth Settlement & Nasr City clinics.",
  alternates: altLangs(l, "/contact", "/contact"),
  };
}

export default async function ContactPage() {
  const [clinics, services] = await Promise.all([getClinics(), getServices()]);
  const serviceOptions = services.map((s) => ({ ar: s.title.ar, en: s.title.en }));
  return <ContactView clinics={clinics} serviceOptions={serviceOptions} />;
}

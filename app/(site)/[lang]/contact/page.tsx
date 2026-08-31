import type { Metadata } from "next";
import ContactView from "./ContactView";
import { getClinics } from "@/lib/data/clinics";
import { SITE } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const l: "ar" | "en" = lang === "en" ? "en" : "ar";
  return pageMetadata({
    page: "contact", lang: l, arPath: "/contact", enPath: "/contact",
    defTitle: "اتصل بنا — Contact",
    defDesc: "احجزي موعدك مع د. أحمد مرزوق — عيادة التجمع الخامس، بولاريس مول. Book an appointment — Fifth Settlement clinic, Polaris Mall.",
  });
}

export default async function ContactPage() {
  const clinics = await getClinics();
  return <ContactView clinics={clinics} />;
}

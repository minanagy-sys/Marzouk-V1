import type { Metadata } from "next";
import ContactView from "./ContactView";
import { getClinics } from "@/lib/data/clinics";
import { getServices } from "@/lib/data/services";
import { SITE } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "اتصل بنا — Contact",
  description:
    "احجزي موعدك مع د. أحمد مرزوق — عيادتا التجمع الخامس ومدينة نصر. Book an appointment — Fifth Settlement & Nasr City clinics.",
  alternates: { canonical: `${SITE.url}/contact` },
};

export default async function ContactPage() {
  const [clinics, services] = await Promise.all([getClinics(), getServices()]);
  const serviceOptions = services.map((s) => ({ ar: s.title.ar, en: s.title.en }));
  return <ContactView clinics={clinics} serviceOptions={serviceOptions} />;
}

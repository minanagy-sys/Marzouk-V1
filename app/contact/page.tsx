import type { Metadata } from "next";
import ContactView from "./ContactView";
import { getClinics } from "@/lib/data/clinics";
import { SITE } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "اتصل بنا — Contact",
  description:
    "احجزي موعدك مع د. أحمد مرزوق — عيادتا التجمع الخامس ومدينة نصر. Book an appointment — Fifth Settlement & Nasr City clinics.",
  alternates: { canonical: `${SITE.url}/contact` },
};

export default async function ContactPage() {
  const clinics = await getClinics();
  return <ContactView clinics={clinics} />;
}

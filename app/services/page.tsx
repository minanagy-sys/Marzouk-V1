import type { Metadata } from "next";
import ServicesView from "./ServicesView";
import { getServices } from "@/lib/data/services";
import { getServiceCategories } from "@/lib/data/serviceCategories";
import { SITE } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "خدماتنا | د. أحمد مرزوق — Our Services",
  description:
    "رعاية متكاملة لصحة المرأة — الولادة بدون ألم، استئصال الأورام الليفية المعقدة، بطانة الرحم المهاجرة، والتجميل النسائي مع د. أحمد مرزوق.",
  alternates: { canonical: `${SITE.url}/services` },
};

export default async function ServicesPage() {
  const [services, categories] = await Promise.all([getServices(), getServiceCategories()]);
  return <ServicesView services={services} categories={categories} />;
}

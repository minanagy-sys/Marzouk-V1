import type { Metadata } from "next";
import ServicesView from "./ServicesView";
import { getServices } from "@/lib/data/services";
import { getServiceCategories } from "@/lib/data/serviceCategories";
import { SITE } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const l: "ar" | "en" = lang === "en" ? "en" : "ar";
  return pageMetadata({
    page: "services", lang: l, arPath: "/services", enPath: "/services",
    defTitle: "خدماتنا | د. أحمد مرزوق — Our Services",
    defDesc: "رعاية متكاملة لصحة المرأة — الولادة بدون ألم، استئصال الأورام الليفية المعقدة، بطانة الرحم المهاجرة، والتجميل النسائي مع د. أحمد مرزوق.",
  });
}

export default async function ServicesPage() {
  const [services, categories] = await Promise.all([getServices(), getServiceCategories()]);
  return <ServicesView services={services} categories={categories} />;
}

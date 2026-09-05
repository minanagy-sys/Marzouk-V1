import type { Metadata } from "next";
import CasesView from "./CasesView";
import { getCases } from "@/lib/data/cases";
import { SITE } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const l: "ar" | "en" = lang === "en" ? "en" : "ar";
  return pageMetadata({
    page: "cases", lang: l, arPath: "/cases", enPath: "/cases",
    defTitleAr: "الحالات وقصص النجاح", defTitleEn: "Cases & Success Stories",
    defDesc: "قصص نجاح حقيقية ومشاهير وثقوا بنا — من الولادة بدون ألم إلى استئصال أعقد الأورام مع الحفاظ على الرحم مع د. أحمد مرزوق.",
  });
}

export default async function CasesPage() {
  const cases = await getCases();
  return <CasesView cases={cases} />;
}

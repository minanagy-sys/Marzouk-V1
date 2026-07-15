import type { Metadata } from "next";
import CasesView from "./CasesView";
import { getCases } from "@/lib/data/cases";
import { SITE } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "الحالات وقصص النجاح | د. أحمد مرزوق — Cases",
  description:
    "قصص نجاح حقيقية ومشاهير وثقوا بنا — من الولادة بدون ألم إلى استئصال أعقد الأورام مع الحفاظ على الرحم مع د. أحمد مرزوق.",
  alternates: { canonical: `${SITE.url}/cases` },
};

export default async function CasesPage() {
  const cases = await getCases();
  return <CasesView cases={cases} />;
}

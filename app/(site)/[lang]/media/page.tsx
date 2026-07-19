import type { Metadata } from "next";
import MediaView from "./MediaView";
import { getMedia } from "@/lib/data/media";
import { SITE } from "@/lib/site";
import { altLangs } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const l: "ar" | "en" = lang === "en" ? "en" : "ar";
  return {
  title: "الإعلام — Media",
  description:
    "صور وفيديوهات من داخل عيادات د. أحمد مرزوق وغرف العمليات — لحظات حقيقية توثق آلاف قصص الفرح.",
  alternates: altLangs(l, "/media", "/media"),
  };
}

export default async function MediaPage() {
  const media = await getMedia();
  return <MediaView media={media} />;
}

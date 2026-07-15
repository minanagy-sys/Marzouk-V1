import type { Metadata } from "next";
import MediaView from "./MediaView";
import { getMedia } from "@/lib/data/media";
import { SITE } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "الإعلام — Media",
  description:
    "صور وفيديوهات من داخل عيادات د. أحمد مرزوق وغرف العمليات — لحظات حقيقية توثق آلاف قصص الفرح.",
  alternates: { canonical: `${SITE.url}/media` },
};

export default async function MediaPage() {
  const media = await getMedia();
  return <MediaView media={media} />;
}

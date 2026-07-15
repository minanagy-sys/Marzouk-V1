import type { Lang } from "@/lib/lang";

const VIDEO_SPANS = [
  { gc: "span 2", gr: "span 2" },
  { gc: "auto", gr: "auto" },
  { gc: "auto", gr: "auto" },
  { gc: "auto", gr: "auto" },
  { gc: "auto", gr: "auto" },
  { gc: "span 2", gr: "auto" },
];

// Gallery mosaic layout (8 slots) — matches the original grid spans.
export const GALLERY_SLOTS = [
  { id: "gal-1", gc: "span 2", gr: "span 2" },
  { id: "gal-2", gc: "auto", gr: "auto" },
  { id: "gal-3", gc: "auto", gr: "auto" },
  { id: "gal-4", gc: "auto", gr: "auto" },
  { id: "gal-5", gc: "auto", gr: "auto" },
  { id: "gal-6", gc: "span 2", gr: "auto" },
  { id: "gal-7", gc: "auto", gr: "auto" },
  { id: "gal-8", gc: "auto", gr: "auto" },
];

export function mediaContent(lang: Lang) {
  const isAr = lang === "ar";

  const t = isAr
    ? {
        pageTitle: "الإعلام",
        pageSub: "لحظات حقيقية من داخل العيادة وغرف العمليات — صور وفيديوهات توثق آلاف قصص الفرح.",
        tabGallery: "الصور",
        tabVideos: "فيديوهات",
        watchOnYt: "المشاهدة على يوتيوب",
        photoPh: "أسقطي صورة هنا",
      }
    : {
        pageTitle: "Media",
        pageSub: "Real moments from the clinic and operating rooms — photos and videos documenting thousands of joyful stories.",
        tabGallery: "Gallery",
        tabVideos: "Videos",
        watchOnYt: "Watch on YouTube",
        photoPh: "Drop a photo here",
      };

  const videos = (isAr
    ? [
        { title: "ما هي الولادة بدون ألم؟" },
        { title: "استئصال الأورام الليفية مع الحفاظ على الرحم" },
        { title: "تجربة ولادة المطربة رنا سماحة" },
        { title: "شد البطن مع القيصرية — كيف يتم؟" },
        { title: "نصائح لمتابعة الحمل الآمن" },
        { title: "قصة استئصال ورم 14 كيلو أثناء الحمل" },
      ]
    : [
        { title: "What is pain-free delivery?" },
        { title: "Fibroid removal while preserving the uterus" },
        { title: "Singer Rana Samaha’s delivery experience" },
        { title: "Tummy tuck with cesarean — how it works" },
        { title: "Tips for a safe pregnancy follow-up" },
        { title: "The story of the 14 kg tumor removed during pregnancy" },
      ]
  ).map((v, i) => ({ ...v, ...(VIDEO_SPANS[i] || VIDEO_SPANS[1]), slotId: "vid-" + (i + 1) }));

  return { t, videos };
}

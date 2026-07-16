import type { Lang } from "@/lib/lang";

/** A bilingual string. */
export type BiText = { ar: string; en: string };

/** Pick the right language from a bilingual field. */
export function pick(v: BiText, lang: Lang): string {
  return v[lang] ?? v.ar ?? "";
}

export type ServiceSection = { heading: BiText; body: BiText };
export type ServiceFaq = { q: BiText; a: BiText };

export type Service = {
  slug: string;
  slotId: string;
  glyph: string;
  parentId?: string;
  id?: string;
  imageUrl?: string;
  gc: string; // mosaic column span
  gr: string; // mosaic row span
  tag: BiText;
  title: BiText;
  shortDesc: BiText;
  heroSub: BiText;
  intro: BiText;
  sections: ServiceSection[];
  benefits: BiText[];
  faq: ServiceFaq[];
  metaTitle: BiText;
  metaDesc: BiText;
};

export type CaseItem = {
  slug: string;
  category: "success" | "celebrity";
  imageUrl?: string;
  tag: BiText;
  title: BiText;
  excerpt: BiText;
  body: BiText;
};

export type MediaItem = {
  id: string;
  type: "gallery" | "video";
  imageUrl?: string;
  videoUrl?: string;
  gc: string;
  gr: string;
  title: BiText;
};

export type Celebrity = {
  id: string;
  imageUrl?: string;
  name: BiText;
  caption: BiText;
};

export type Testimonial = {
  id: string;
  name: string;
  text: BiText;
  rating?: number;
};

export type HeroSlide = {
  id: string;
  imageUrl?: string;
  kicker: BiText;
  title1: BiText;
  title2: BiText;
  sub: BiText;
};

export type Stat = {
  id: string;
  num: BiText;
  label: BiText;
};

export type ValueItem = {
  id: string;
  num: string;
  title: BiText;
  body: BiText;
};

export type Feature = {
  id: string;
  glyph: string;
  title: BiText;
  desc: BiText;
};

export type InstagramPost = {
  id: string;
  imageUrl?: string;
  permalink?: string;
  isVideo?: boolean;
  caption: BiText;
};

export type Clinic = {
  id: string;
  phone: string;
  mapsUrl: string;
  name: BiText;
  address: BiText;
  hours: BiText;
  area: BiText;
};

export type BlogCategory = {
  id: string;
  slug: string;
  name: BiText;
};

export type BlogPostBi = {
  slug: string;
  imageUrl?: string;
  date: string;
  tag: BiText;
  title: BiText;
  excerpt: BiText;
  body: { ar: string; en: string }; // HTML
  categorySlug?: string;
  categoryName?: BiText;
};

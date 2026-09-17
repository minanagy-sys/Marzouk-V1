import { SITE } from "@/lib/site";
import { pick, type Lang } from "@/lib/data/types";
import type { Service, CaseItem, BlogPostBi } from "@/lib/data/types";

/**
 * JSON-LD @graph builders. One graph per page; every URL absolute on the
 * canonical https+www host. No aggregateRating / review / reviewedBy / award /
 * credential is emitted unless it comes from real, verifiable data — per the
 * recovery bundle's schema rules.
 */
const BASE = SITE.url.replace(/\/+$/, "");
const abs = (p: string) => (p.startsWith("http") ? p : `${BASE}${p.startsWith("/") ? "" : "/"}${p}`);
const langUrl = (lang: Lang, path: string) => abs(`/${lang}${path}`);

export function graph(nodes: unknown[]) {
  return { "@context": "https://schema.org", "@graph": nodes.filter(Boolean) };
}

/** The doctor, reused as author/provider across pages. */
function physician(lang: Lang) {
  return {
    "@type": "Physician",
    "@id": `${BASE}/#physician`,
    name: lang === "ar" ? SITE.nameAr : SITE.nameEn,
    url: BASE,
    telephone: SITE.phone,
    medicalSpecialty: ["Gynecologic", "Obstetric"],
  };
}

function breadcrumb(lang: Lang, trail: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: langUrl(lang, t.path),
    })),
  };
}

/* ---------------- site-wide (root layout) ---------------- */
export function siteGraph(lang: Lang) {
  const name = lang === "ar" ? SITE.nameAr : SITE.nameEn;
  return graph([
    { "@type": "Organization", "@id": `${BASE}/#org`, name, url: BASE, telephone: SITE.phone, email: SITE.email },
    { "@type": "WebSite", "@id": `${BASE}/#website`, name, url: BASE, inLanguage: lang, publisher: { "@id": `${BASE}/#org` } },
  ]);
}

/* ---------------- /ar/about ---------------- */
export function aboutGraph(lang: Lang, social: string[] = []) {
  const clinics = SITE.clinics.map((c) => ({
    "@type": "PostalAddress",
    streetAddress: c.addressEn,
    addressLocality: c.city,
    addressRegion: c.region,
    addressCountry: c.country,
  }));
  return graph([
    {
      ...physician(lang),
      alternateName: lang === "ar" ? SITE.nameEn : SITE.nameAr,
      email: SITE.email,
      knowsLanguage: ["ar", "en"],
      ...(social.length ? { sameAs: social } : {}),
      address: clinics,
    },
    {
      "@type": "MedicalBusiness",
      "@id": `${BASE}/#business`,
      name: lang === "ar" ? SITE.nameAr : SITE.nameEn,
      url: BASE,
      telephone: SITE.phone,
      address: clinics,
      ...(social.length ? { sameAs: social } : {}),
    },
  ]);
}

/* ---------------- /<lang>/blogs/<slug> ---------------- */
export function blogGraph(lang: Lang, post: BlogPostBi, url: string, hubName: string) {
  const condition = (post.keywords && pick(post.keywords, lang)) || (post.tag && pick(post.tag, lang)) || pick(post.title, lang);
  const node: Record<string, unknown> = {
    "@type": post.schemaType && post.schemaType !== "BlogPosting" ? post.schemaType : "MedicalWebPage",
    "@id": `${url}#page`,
    name: pick(post.title, lang),
    headline: pick(post.title, lang),
    description: (post.metaDesc && pick(post.metaDesc, lang)) || pick(post.excerpt, lang),
    url,
    inLanguage: lang,
    isPartOf: { "@id": `${BASE}/#website` },
    author: physician(lang),
    ...(condition ? { about: { "@type": "MedicalCondition", name: condition } } : {}),
    ...(post.imageUrl ? { image: abs(post.imageUrl) } : {}),
    ...(post.date ? { datePublished: post.date, dateModified: post.date } : {}),
    // reviewedBy intentionally omitted until a real reviewer is assigned.
  };
  const nodes: unknown[] = [
    node,
    breadcrumb(lang, [
      { name: lang === "ar" ? "الرئيسية" : "Home", path: "" },
      { name: hubName, path: "/blogs" },
      { name: pick(post.title, lang), path: `/blogs/${post.slugAr || post.slug}` },
    ]),
  ];
  if (post.faq && post.faq.length) {
    nodes.push({
      "@type": "FAQPage",
      mainEntity: post.faq.map((f) => ({
        "@type": "Question",
        name: pick(f.q, lang),
        acceptedAnswer: { "@type": "Answer", text: pick(f.a, lang) },
      })),
    });
  }
  return graph(nodes);
}

/* ---------------- /<lang>/services/<slug> ---------------- */
const SURGICAL = /استئصال|منظار|laparoscop|removal|hysterect|fibroid|cyst|adhesiolysis|abdominoplasty|نحت|شد-البطن/i;
const BODY_LOC: { re: RegExp; ar: string; en: string }[] = [
  { re: /ovar|مبيض|أكياس/i, ar: "المبيض", en: "Ovary" },
  { re: /fibroid|ورم|ليفي/i, ar: "الرحم", en: "Uterus" },
  { re: /hysterect|رحم/i, ar: "الرحم", en: "Uterus" },
  { re: /endometrios|بطانة/i, ar: "الرحم", en: "Uterus" },
  { re: /cesarean|قيصر|natural|طبيعية|ولادة/i, ar: "الرحم", en: "Uterus" },
  { re: /cosmetic|تجميل|gynecolog/i, ar: "الجهاز التناسلي الأنثوي", en: "Female reproductive system" },
];
export function serviceGraph(lang: Lang, service: Service, url: string, hubName: string) {
  const key = `${service.slug} ${service.slugAr || ""} ${service.slugEn || ""}`;
  const isSurgery = SURGICAL.test(key);
  const bl = BODY_LOC.find((b) => b.re.test(key));
  const proc: Record<string, unknown> = {
    "@type": "MedicalProcedure",
    "@id": `${url}#procedure`,
    name: pick(service.title, lang),
    description: pick(service.shortDesc, lang) || pick(service.intro, lang),
    url,
    ...(isSurgery ? { procedureType: { "@type": "MedicalProcedureType", name: "SurgicalProcedure" } } : {}),
    ...(bl ? { bodyLocation: { "@type": "AnatomicalStructure", name: lang === "ar" ? bl.ar : bl.en } } : {}),
    provider: physician(lang),
  };
  const page = {
    "@type": "MedicalWebPage",
    "@id": `${url}#page`,
    name: pick(service.title, lang),
    description: pick(service.shortDesc, lang) || pick(service.intro, lang),
    url,
    inLanguage: lang,
    isPartOf: { "@id": `${BASE}/#website` },
    ...(service.imageUrl ? { image: abs(service.imageUrl) } : {}),
    ...(service.keywords && pick(service.keywords, lang) ? { keywords: pick(service.keywords, lang) } : {}),
    about: { "@id": `${url}#procedure` },
  };
  const nodes: unknown[] = [proc, page, breadcrumb(lang, [
    { name: lang === "ar" ? "الرئيسية" : "Home", path: "" },
    { name: hubName, path: "/services" },
    { name: pick(service.title, lang), path: `/services/${service.slugAr || service.slug}` },
  ])];
  return graph(nodes);
}

/* ---------------- /<lang>/cases/<slug> ---------------- */
export function caseGraph(lang: Lang, item: CaseItem, url: string, hubName: string) {
  // Patient stories are narrative Articles, NOT MedicalWebPage / medical advice.
  const article: Record<string, unknown> = {
    "@type": "Article",
    "@id": `${url}#article`,
    headline: pick(item.title, lang),
    description: pick(item.excerpt, lang),
    url,
    inLanguage: lang,
    author: physician(lang),
    publisher: { "@id": `${BASE}/#org` },
    ...(item.imageUrl ? { image: abs(item.imageUrl) } : {}),
    ...(item.keywords && pick(item.keywords, lang) ? { keywords: pick(item.keywords, lang) } : {}),
    about: (item.keywords && pick(item.keywords, lang)) || pick(item.tag, lang) || undefined,
  };
  return graph([article, breadcrumb(lang, [
    { name: lang === "ar" ? "الرئيسية" : "Home", path: "" },
    { name: hubName, path: "/cases" },
    { name: pick(item.title, lang), path: `/cases/${item.slugAr || item.slug}` },
  ])]);
}

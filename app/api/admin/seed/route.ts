import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServiceClient } from "@/lib/supabase";
import { verifyAdmin } from "@/lib/admin/auth";
import { SERVICES_SEED } from "@/lib/data/services";
import { CASES_SEED } from "@/lib/data/cases";
import { homeContent } from "@/lib/content/home";
import { aboutContent } from "@/lib/content/about";
import { contactContent } from "@/lib/content/contact";
import { servicesContent } from "@/lib/content/services";
import { casesContent } from "@/lib/content/cases";
import { blogPosts, blogsUi } from "@/lib/content/blogs";
import { mediaContent, GALLERY_SLOTS } from "@/lib/content/media";
import { COMMON, CONTACT_INFO } from "@/lib/content/common";
import { heroSlidesSeed, statsSeed, valuesSeed, featuresSeed } from "@/lib/data/sections";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Seeds all tables from the built-in content (single source of truth).
 * Idempotent: upserts slug-keyed tables; only fills list tables if empty.
 * POST with an admin Bearer token.
 */
export async function POST(request: Request) {
  if (!(await verifyAdmin(request))) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const supabase = getServiceClient();
  if (!supabase) return NextResponse.json({ error: "supabase_not_configured" }, { status: 500 });

  const results: Record<string, string> = {};

  // Parent services / categories (upsert by slug) — powers the services-page filter.
  const SERVICE_CATEGORIES = [
    { slug: "delivery", sort_order: 1, is_published: true, name_ar: "الولادة", name_en: "Delivery" },
    { slug: "tumor-surgery", sort_order: 2, is_published: true, name_ar: "جراحة الأورام", name_en: "Tumor Surgery" },
    { slug: "cosmetic", sort_order: 3, is_published: true, name_ar: "التجميل النسائي", name_en: "Cosmetic Gynecology" },
    { slug: "specialized", sort_order: 4, is_published: true, name_ar: "رعاية تخصصية", name_en: "Specialized Care" },
  ];
  const catIdBySlug: Record<string, string> = {};
  {
    const { error } = await supabase.from("service_categories").upsert(SERVICE_CATEGORIES, { onConflict: "slug" });
    if (error) {
      results.service_categories = `error: ${error.message}`;
    } else {
      const { data } = await supabase.from("service_categories").select("id, slug");
      (data ?? []).forEach((c: { id: string; slug: string }) => { catIdBySlug[c.slug] = c.id; });
      results.service_categories = `${SERVICE_CATEGORIES.length} upserted`;
    }
  }

  // Map each seed service to its parent category.
  const SERVICE_CAT_MAP: Record<string, string> = {
    "pain-free-cesarean": "delivery",
    "pain-free-natural-birth": "delivery",
    "complex-fibroid-removal": "tumor-surgery",
    "endometriosis-care": "specialized",
    "cosmetic-gynecology": "cosmetic",
    "tummy-tuck-with-cesarean": "cosmetic",
  };

  // Services (upsert by slug)
  const serviceRows = SERVICES_SEED.map((s, i) => ({
    slug: s.slug, sort_order: i, is_published: true, show_on_home: true, glyph: s.glyph, image_url: s.imageUrl ?? null,
    category_id: catIdBySlug[SERVICE_CAT_MAP[s.slug] ?? ""] ?? null,
    span_gc: s.gc, span_gr: s.gr,
    tag_ar: s.tag.ar, tag_en: s.tag.en, title_ar: s.title.ar, title_en: s.title.en,
    short_desc_ar: s.shortDesc.ar, short_desc_en: s.shortDesc.en, hero_sub_ar: s.heroSub.ar, hero_sub_en: s.heroSub.en,
    intro_ar: s.intro.ar, intro_en: s.intro.en,
    sections: s.sections.map((x) => ({ heading_ar: x.heading.ar, heading_en: x.heading.en, body_ar: x.body.ar, body_en: x.body.en })),
    benefits: s.benefits.map((b) => ({ ar: b.ar, en: b.en })),
    faq: s.faq.map((f) => ({ q_ar: f.q.ar, q_en: f.q.en, a_ar: f.a.ar, a_en: f.a.en })),
    meta_title_ar: s.metaTitle.ar, meta_title_en: s.metaTitle.en, meta_desc_ar: s.metaDesc.ar, meta_desc_en: s.metaDesc.en,
  }));
  {
    let { error } = await supabase.from("services").upsert(serviceRows, { onConflict: "slug" });
    if (error) {
      // Older schema without category_id / show_on_home — retry without them.
      const fallback = serviceRows.map((r) => {
        const copy: Record<string, unknown> = { ...r };
        delete copy.category_id; delete copy.show_on_home;
        return copy;
      });
      ({ error } = await supabase.from("services").upsert(fallback, { onConflict: "slug" }));
    }
    results.services = error ? `error: ${error.message}` : `${serviceRows.length} upserted`;
  }

  // Cases (upsert by slug)
  const caseRows = CASES_SEED.map((c, i) => ({
    slug: c.slug, category: c.category, sort_order: i, is_published: true, image_url: c.imageUrl ?? null,
    tag_ar: c.tag.ar, tag_en: c.tag.en, title_ar: c.title.ar, title_en: c.title.en,
    excerpt_ar: c.excerpt.ar, excerpt_en: c.excerpt.en, body_ar: c.body.ar, body_en: c.body.en,
  }));
  {
    const { error } = await supabase.from("cases").upsert(caseRows, { onConflict: "slug" });
    results.cases = error ? `error: ${error.message}` : `${caseRows.length} upserted`;
  }

  // Blog posts (upsert by slug)
  const ar = blogPosts("ar");
  const en = blogPosts("en");
  const blogRows = ar.map((p, i) => ({
    slug: p.slug, sort_order: i, is_published: true,
    tag_ar: p.tag, tag_en: en[i]?.tag ?? "", title_ar: p.title, title_en: en[i]?.title ?? "",
    excerpt_ar: p.excerpt, excerpt_en: en[i]?.excerpt ?? "", body_ar: p.body, body_en: en[i]?.body ?? [],
  }));
  {
    const { error } = await supabase.from("blog_posts").upsert(blogRows, { onConflict: "slug" });
    results.blog_posts = error ? `error: ${error.message}` : `${blogRows.length} upserted`;
  }

  // Helper: only insert into list tables if empty
  async function seedList(table: string, rows: Record<string, unknown>[]) {
    const { count } = await supabase!.from(table).select("*", { count: "exact", head: true });
    if (count && count > 0) { results[table] = `skipped (${count} existing)`; return; }
    const { error } = await supabase!.from(table).insert(rows);
    results[table] = error ? `error: ${error.message}` : `${rows.length} inserted`;
  }

  // Celebrities (from home content, zipped ar/en)
  const hAr = homeContent("ar"), hEn = homeContent("en");
  await seedList("celebrities", hAr.celebs.map((c, i) => ({
    sort_order: i, is_published: true, name_ar: c.name, name_en: hEn.celebs[i]?.name ?? "",
    caption_ar: c.caption, caption_en: hEn.celebs[i]?.caption ?? "",
  })));

  // Testimonials (from about content)
  const aAr = aboutContent("ar"), aEn = aboutContent("en");
  await seedList("testimonials", aAr.testimonials.map((t, i) => ({
    sort_order: i, is_published: true, name: t.name, text_ar: t.text, text_en: aEn.testimonials[i]?.text ?? "",
  })));

  // Clinics (from contact content)
  const cAr = contactContent("ar"), cEn = contactContent("en");
  await seedList("clinics", cAr.pins.map((p, i) => ({
    sort_order: i, is_published: true, phone: p.phone, maps_url: p.url,
    name_ar: p.name, name_en: cEn.pins[i]?.name ?? "", address_ar: p.address, address_en: cEn.pins[i]?.address ?? "",
    hours_ar: cAr.clinics[i]?.hours ?? "", hours_en: cEn.clinics[i]?.hours ?? "",
    area_ar: p.area, area_en: cEn.pins[i]?.area ?? "",
  })));

  // Media (gallery placeholders + videos)
  const mAr = mediaContent("ar"), mEn = mediaContent("en");
  const galleryRows = GALLERY_SLOTS.map((g, i) => ({ type: "gallery", sort_order: i, is_published: true, span_gc: g.gc, span_gr: g.gr }));
  const videoRows = mAr.videos.map((v, i) => ({ type: "video", sort_order: 100 + i, is_published: true, span_gc: v.gc, span_gr: v.gr, title_ar: v.title, title_en: mEn.videos[i]?.title ?? "" }));
  await seedList("media_items", [...galleryRows, ...videoRows]);

  // Home list sections
  await seedList("hero_slides", heroSlidesSeed().map((s, i) => ({ sort_order: i, is_published: true, image_url: s.imageUrl ?? null, kicker_ar: s.kicker.ar, kicker_en: s.kicker.en, title1_ar: s.title1.ar, title1_en: s.title1.en, title2_ar: s.title2.ar, title2_en: s.title2.en, sub_ar: s.sub.ar, sub_en: s.sub.en })));
  await seedList("hero_stats", statsSeed().map((s, i) => ({ sort_order: i, is_published: true, num_ar: s.num.ar, num_en: s.num.en, label_ar: s.label.ar, label_en: s.label.en })));
  await seedList("value_items", valuesSeed().map((v, i) => ({ sort_order: i, is_published: true, num: v.num, title_ar: v.title.ar, title_en: v.title.en, body_ar: v.body.ar, body_en: v.body.en })));
  await seedList("feature_items", featuresSeed().map((f, i) => ({ sort_order: i, is_published: true, glyph: f.glyph, title_ar: f.title.ar, title_en: f.title.en, desc_ar: f.desc.ar, desc_en: f.desc.en })));

  // Site text (header/footer) — editable in the "Site text" admin section
  const A = COMMON.ar, E = COMMON.en;
  const sc = [
    { key: "brand", section: "Header/Footer", value_ar: A.brand, value_en: E.brand },
    { key: "brand.sub", section: "Header", value_ar: A.brandSub, value_en: E.brandSub },
    { key: "nav.home", section: "Header", value_ar: A.navHome, value_en: E.navHome },
    { key: "nav.about", section: "Header", value_ar: A.navAbout, value_en: E.navAbout },
    { key: "nav.services", section: "Header", value_ar: A.navServices, value_en: E.navServices },
    { key: "nav.cases", section: "Header", value_ar: A.navCases, value_en: E.navCases },
    { key: "nav.success", section: "Header", value_ar: A.navSuccess, value_en: E.navSuccess },
    { key: "nav.celebs", section: "Header", value_ar: A.navCelebs, value_en: E.navCelebs },
    { key: "nav.blogs", section: "Header", value_ar: A.navBlogs, value_en: E.navBlogs },
    { key: "nav.media", section: "Header", value_ar: A.navMedia, value_en: E.navMedia },
    { key: "nav.gallery", section: "Header", value_ar: A.navGallery, value_en: E.navGallery },
    { key: "nav.videos", section: "Header", value_ar: A.navVideos, value_en: E.navVideos },
    { key: "nav.contact", section: "Header", value_ar: A.navContact, value_en: E.navContact },
    { key: "nav.lang", section: "Header", value_ar: A.langBtn, value_en: E.langBtn },
    { key: "nav.book", section: "Header", value_ar: A.book, value_en: E.book },
    { key: "footer.about", section: "Footer", value_ar: A.footerAbout, value_en: E.footerAbout },
    { key: "footer.linksTitle", section: "Footer", value_ar: A.footerLinks, value_en: E.footerLinks },
    { key: "footer.contactTitle", section: "Footer", value_ar: A.footerContact, value_en: E.footerContact },
    { key: "footer.clinic1", section: "Footer", value_ar: A.clinic1, value_en: E.clinic1 },
    { key: "footer.clinic2", section: "Footer", value_ar: A.clinic2, value_en: E.clinic2 },
    { key: "footer.phone1", section: "Footer", value_ar: CONTACT_INFO.phone1, value_en: CONTACT_INFO.phone1 },
    { key: "footer.phone2", section: "Footer", value_ar: CONTACT_INFO.phone2, value_en: CONTACT_INFO.phone2 },
    { key: "footer.email", section: "Footer", value_ar: CONTACT_INFO.email, value_en: CONTACT_INFO.email },
    { key: "footer.copyright", section: "Footer", value_ar: A.copyright, value_en: E.copyright },
  ];
  // Every page's text — editable in the "Site text" admin section (key: page.field)
  const pageRows = (prefix: string, arObj: Record<string, string>, enObj: Record<string, string>, section: string) =>
    Object.keys(arObj).map((k) => ({ key: `${prefix}.${k}`, section, value_ar: arObj[k] ?? "", value_en: enObj[k] ?? arObj[k] ?? "" }));

  const pageText = [
    ...pageRows("home", homeContent("ar").t, homeContent("en").t, "Home page"),
    ...pageRows("about", aboutContent("ar").t, aboutContent("en").t, "About page"),
    ...pageRows("services", servicesContent("ar").t, servicesContent("en").t, "Services page"),
    ...pageRows("cases", casesContent("ar").t, casesContent("en").t, "Cases page"),
    ...pageRows("blogs", blogsUi("ar"), blogsUi("en"), "Blog page"),
    ...pageRows("media", mediaContent("ar").t, mediaContent("en").t, "Media page"),
    ...pageRows("contact", contactContent("ar").t, contactContent("en").t, "Contact page"),
  ];

  {
    const all = [...sc, ...pageText];
    const { error } = await supabase.from("site_content").upsert(all, { onConflict: "key" });
    results.site_content = error ? `error: ${error.message}` : `${all.length} upserted`;
  }

  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, results });
}

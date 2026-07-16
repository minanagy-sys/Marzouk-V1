"use client";

import Link from "next/link";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsappFloat from "@/components/WhatsappFloat";
import PageHero from "@/components/PageHero";
import HoverBox from "@/components/HoverBox";
import ImageSlot from "@/components/ImageSlot";
import { useLang } from "@/lib/lang";
import { usePageText } from "@/lib/settings";
import { blogsUi } from "@/lib/content/blogs";
import { common } from "@/lib/content/common";
import { pick, type BlogPostBi, type BlogCategory } from "@/lib/data/types";
import { SERIF, SANS } from "@/lib/theme";

export default function BlogsView({ posts, categories }: { posts: BlogPostBi[]; categories: BlogCategory[] }) {
  const { lang, dir } = useLang();
  const ui = usePageText("blogs", lang, blogsUi(lang));
  const tc = common(lang);
  const [cat, setCat] = useState<string>("all");

  const filtered = cat === "all" ? posts : posts.filter((p) => p.categorySlug === cat);
  const allLabel = lang === "ar" ? "الكل" : "All";

  const chip = (key: string, label: string) => {
    const active = cat === key;
    return (
      <button key={key} onClick={() => setCat(key)} style={{ borderRadius: 999, padding: "9px 20px", fontFamily: SANS, fontWeight: 700, fontSize: 14, cursor: "pointer", border: "1.5px solid " + (active ? "#30B6DE" : "rgba(12,52,70,0.15)"), background: active ? "#30B6DE" : "#ffffff", color: active ? "#ffffff" : "#46687A" }}>
        {label}
      </button>
    );
  };

  return (
    <div style={{ fontFamily: SANS, direction: dir, color: "#0C3446", background: "#ffffff", minHeight: "100vh" }}>
      <Navbar active="blogs" cta="book" />
      <PageHero crumbLabel={tc.navBlogs} title={ui.pageTitle} sub={ui.pageSub} spin={false} />

      <section data-screen-label="Articles grid" style={{ padding: "60px 24px 90px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          {categories.length > 0 && (
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 40 }}>
              {chip("all", allLabel)}
              {categories.map((c) => chip(c.slug, pick(c.name, lang)))}
            </div>
          )}
          <div className="dam-3col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 26 }}>
            {filtered.map((p) => (
              <HoverBox key={p.slug} as={Link} href={`/blogs/${p.slug}`} style={{ background: "#ffffff", border: "1px solid rgba(12,52,70,0.08)", borderRadius: 24, overflow: "hidden", boxShadow: "0 4px 14px rgba(12,52,70,0.04)", display: "flex", flexDirection: "column", color: "#0C3446" }} hoverStyle={{ transform: "translateY(-8px)", boxShadow: "0 24px 50px rgba(48,182,222,0.18)", borderColor: "rgba(48,182,222,0.5)", color: "#0C3446" }}>
                <div style={{ height: 200 }}>
                  <ImageSlot src={p.imageUrl} placeholder={ui.photoPh} style={{ width: "100%", height: 200 }} />
                </div>
                <div style={{ padding: 26, display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                    <span style={{ background: "rgba(48,182,222,0.12)", border: "1px solid rgba(48,182,222,0.35)", color: "#1E92B8", borderRadius: 999, padding: "4px 13px", fontSize: 12, fontWeight: 800 }}>{p.categoryName ? pick(p.categoryName, lang) : pick(p.tag, lang)}</span>
                    <span style={{ fontSize: 12.5, color: "#8AA5B1", fontWeight: 700 }}>{p.date}</span>
                  </div>
                  <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 19, lineHeight: 1.5 }}>{pick(p.title, lang)}</div>
                  <p style={{ fontSize: 14, lineHeight: 1.9, color: "#5B7A88", margin: 0, flex: 1 }}>{pick(p.excerpt, lang)}</p>
                  <span style={{ fontSize: 13.5, fontWeight: 800, color: "#30B6DE", marginTop: 4 }}>{ui.readMore} {dir === "rtl" ? "←" : "→"}</span>
                </div>
              </HoverBox>
            ))}
          </div>
          {filtered.length === 0 && <div style={{ color: "#5B7A88", padding: "40px 0" }}>{lang === "ar" ? "لا توجد مقالات في هذا التصنيف بعد." : "No articles in this category yet."}</div>}
        </div>
      </section>

      <Footer variant="simple" />
      <WhatsappFloat />
    </div>
  );
}

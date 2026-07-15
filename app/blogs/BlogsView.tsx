"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsappFloat from "@/components/WhatsappFloat";
import PageHero from "@/components/PageHero";
import HoverBox from "@/components/HoverBox";
import ImageSlot from "@/components/ImageSlot";
import { useLang } from "@/lib/lang";
import { blogsUi } from "@/lib/content/blogs";
import { common } from "@/lib/content/common";
import { pick, type BlogPostBi } from "@/lib/data/types";
import { SERIF, SANS } from "@/lib/theme";

export default function BlogsView({ posts }: { posts: BlogPostBi[] }) {
  const { lang, dir } = useLang();
  const ui = blogsUi(lang);
  const tc = common(lang);

  return (
    <div style={{ fontFamily: SANS, direction: dir, color: "#0C3446", background: "#ffffff", minHeight: "100vh" }}>
      <Navbar active="blogs" cta="book" />
      <PageHero crumbLabel={tc.navBlogs} title={ui.pageTitle} sub={ui.pageSub} spin={false} />

      <section data-screen-label="Articles grid" style={{ padding: "90px 24px" }}>
        <div className="dam-3col" style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 26 }}>
          {posts.map((p) => (
            <HoverBox key={p.slug} as={Link} href={`/blogs/${p.slug}`} style={{ background: "#ffffff", border: "1px solid rgba(12,52,70,0.08)", borderRadius: 24, overflow: "hidden", boxShadow: "0 4px 14px rgba(12,52,70,0.04)", display: "flex", flexDirection: "column", color: "#0C3446" }} hoverStyle={{ transform: "translateY(-8px)", boxShadow: "0 24px 50px rgba(48,182,222,0.18)", borderColor: "rgba(48,182,222,0.5)", color: "#0C3446" }}>
              <div style={{ height: 200 }}>
                <ImageSlot src={p.imageUrl} placeholder={ui.photoPh} style={{ width: "100%", height: 200 }} />
              </div>
              <div style={{ padding: 26, display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ background: "rgba(48,182,222,0.12)", border: "1px solid rgba(48,182,222,0.35)", color: "#1E92B8", borderRadius: 999, padding: "4px 13px", fontSize: 12, fontWeight: 800 }}>{pick(p.tag, lang)}</span>
                  <span style={{ fontSize: 12.5, color: "#8AA5B1", fontWeight: 700 }}>{p.date}</span>
                </div>
                <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 19, lineHeight: 1.5 }}>{pick(p.title, lang)}</div>
                <p style={{ fontSize: 14, lineHeight: 1.9, color: "#5B7A88", margin: 0, flex: 1 }}>{pick(p.excerpt, lang)}</p>
                <span style={{ fontSize: 13.5, fontWeight: 800, color: "#30B6DE", marginTop: 4 }}>{ui.readMore} {dir === "rtl" ? "←" : "→"}</span>
              </div>
            </HoverBox>
          ))}
        </div>
      </section>

      <Footer variant="simple" />
      <WhatsappFloat />
    </div>
  );
}

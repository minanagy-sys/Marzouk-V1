"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsappFloat from "@/components/WhatsappFloat";
import HoverBox from "@/components/HoverBox";
import ImageSlot from "@/components/ImageSlot";
import { useLang } from "@/lib/lang";
import { common } from "@/lib/content/common";
import { pick, type CaseItem } from "@/lib/data/types";
import { SERIF, SANS } from "@/lib/theme";

export default function CaseDetailView({ item, related }: { item: CaseItem; related: CaseItem[] }) {
  const { lang, dir } = useLang();
  const tc = common(lang);
  const ui = lang === "ar"
    ? { crumb: "الحالات", back: "كل الحالات", related: "حالات أخرى", photoPh: "أسقطي صورة هنا" }
    : { crumb: "Cases", back: "All cases", related: "Other cases", photoPh: "Drop a photo here" };

  return (
    <div style={{ fontFamily: SANS, direction: dir, color: "#0C3446", background: "#ffffff", minHeight: "100vh" }}>
      <Navbar active="cases" cta="book" />

      <section style={{ position: "relative", overflow: "hidden", background: "linear-gradient(140deg, #04202E 0%, #0A3950 55%, #0E5372 100%)", padding: "80px 24px" }}>
        <div style={{ position: "absolute", top: -160, insetInlineEnd: -100, width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle, rgba(48,182,222,0.3), transparent 65%)" }} />
        <div style={{ maxWidth: 900, margin: "0 auto", position: "relative", animation: "damFadeUp 0.8s ease-out both" }}>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", fontWeight: 500 }}>
            <Link href="/" style={{ color: "#8FE0F7" }}>{tc.navHome}</Link> · <Link href="/cases" style={{ color: "#8FE0F7" }}>{ui.crumb}</Link>
          </div>
          <div style={{ marginTop: 20 }}>
            <span style={{ background: "rgba(48,182,222,0.18)", border: "1px solid rgba(48,182,222,0.4)", color: "#8FE0F7", borderRadius: 999, padding: "6px 16px", fontSize: 12.5, fontWeight: 800 }}>{pick(item.tag, lang)}</span>
          </div>
          <h1 style={{ fontFamily: SERIF, fontWeight: 700, fontSize: "clamp(28px, 4vw, 46px)", color: "#ffffff", margin: "18px 0 0", lineHeight: 1.35 }}>{pick(item.title, lang)}</h1>
          <p style={{ fontSize: 17.5, lineHeight: 1.9, color: "rgba(255,255,255,0.75)", margin: "16px 0 0", textWrap: "pretty" }}>{pick(item.excerpt, lang)}</p>
        </div>
      </section>

      <article style={{ maxWidth: 860, margin: "0 auto", padding: "60px 24px 40px" }}>
        <div style={{ borderRadius: 24, overflow: "hidden", border: "1px solid rgba(12,52,70,0.08)", boxShadow: "0 14px 40px rgba(12,52,70,0.08)", height: 360, marginBottom: 40, background: "linear-gradient(160deg, #0A3950, #0E5372)" }}>
          <ImageSlot src={item.imageUrl} placeholder={ui.photoPh} style={{ width: "100%", height: "100%" }} />
        </div>
        <div className="article-body" dir={dir} style={{ fontSize: 17.5, lineHeight: 2.15, color: "#46687A" }} dangerouslySetInnerHTML={{ __html: pick(item.body, lang) }} />

        <div style={{ marginTop: 34, paddingTop: 26, borderTop: "1px solid rgba(12,52,70,0.08)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <HoverBox as={Link} href="/cases" style={{ color: "#30B6DE", fontWeight: 800, fontSize: 15 }} hoverStyle={{ color: "#1E92B8" }}>
            {dir === "rtl" ? "→" : "←"} {ui.back}
          </HoverBox>
          <HoverBox as={Link} href="/contact" style={{ background: "linear-gradient(135deg, #30B6DE, #1E92B8)", color: "#ffffff", borderRadius: 999, padding: "12px 28px", fontWeight: 800, fontSize: 15, boxShadow: "0 8px 20px rgba(48,182,222,0.4)" }} hoverStyle={{ boxShadow: "0 12px 28px rgba(48,182,222,0.55)", color: "#ffffff" }}>
            {tc.book}
          </HoverBox>
        </div>
      </article>

      {related.length > 0 && (
        <section style={{ padding: "40px 24px 100px" }}>
          <div style={{ maxWidth: 1240, margin: "0 auto" }}>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(24px, 3vw, 34px)", fontWeight: 700, color: "#0C3446", marginBottom: 30 }}>{ui.related}</h2>
            <div className="dam-3col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 26 }}>
              {related.map((r) => (
                <HoverBox key={r.slug} as={Link} href={`/cases/${r.slug}`} style={{ background: "#ffffff", border: "1px solid rgba(12,52,70,0.08)", borderRadius: 24, overflow: "hidden", boxShadow: "0 4px 14px rgba(12,52,70,0.04)", display: "flex", flexDirection: "column", color: "#0C3446" }} hoverStyle={{ transform: "translateY(-8px)", boxShadow: "0 24px 50px rgba(48,182,222,0.18)", borderColor: "rgba(48,182,222,0.5)", color: "#0C3446" }}>
                  <div style={{ height: 170 }}>
                    <ImageSlot src={r.imageUrl} placeholder={ui.photoPh} style={{ width: "100%", height: 170 }} />
                  </div>
                  <div style={{ padding: 22, display: "flex", flexDirection: "column", gap: 10 }}>
                    <span style={{ fontSize: 12, color: "#1E92B8", fontWeight: 800 }}>{pick(r.tag, lang)}</span>
                    <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 17.5, lineHeight: 1.5 }}>{pick(r.title, lang)}</span>
                  </div>
                </HoverBox>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer variant="simple" />
      <WhatsappFloat />
    </div>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsappFloat from "@/components/WhatsappFloat";
import PageHero from "@/components/PageHero";
import HoverBox from "@/components/HoverBox";
import ImageSlot from "@/components/ImageSlot";
import { useLang } from "@/lib/lang";
import { usePageText } from "@/lib/settings";
import { casesContent, caseCardStyle } from "@/lib/content/cases";
import { common } from "@/lib/content/common";
import { slugFor, pick, type CaseItem } from "@/lib/data/types";
import { SERIF, SANS } from "@/lib/theme";

export default function CasesView({ cases }: { cases: CaseItem[] }) {
  const { lang, dir, lp } = useLang();
  const t = usePageText("cases", lang, casesContent(lang).t);
  const tc = common(lang);
  const [tab, setTab] = useState<"success" | "celebrity">("success");

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#celebs") setTab("celebrity");
    const onHash = () => {
      if (window.location.hash === "#celebs") setTab("celebrity");
      if (window.location.hash === "#success") setTab("success");
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const list = cases.filter((c) => c.category === tab);
  const readMore = lang === "ar" ? "اقرأ القصة كاملة" : "Read the full story";

  const tabBtn = (key: "success" | "celebrity", label: string) => {
    const activeTab = tab === key;
    return (
      <button onClick={() => setTab(key)} style={{ borderRadius: 999, padding: "12px 28px", fontFamily: SANS, fontWeight: 800, fontSize: 15, cursor: "pointer", border: "1.5px solid " + (activeTab ? "#30B6DE" : "rgba(255,255,255,0.35)"), background: activeTab ? "#30B6DE" : "transparent", color: activeTab ? "#ffffff" : "#8FE0F7" }}>
        {label}
      </button>
    );
  };

  return (
    <div style={{ fontFamily: SANS, direction: dir, color: "#0C3446", background: "#ffffff", minHeight: "100vh" }}>
      <Navbar active="cases" cta="book" />
      <PageHero page="cases" crumbLabel={tc.navCases} title={t.pageTitle} sub={t.pageSub} spin={false} padding="90px 24px 70px">
        <div style={{ display: "flex", gap: 12, marginTop: 34, flexWrap: "wrap" }}>
          {tabBtn("success", t.tabSuccess)}
          {tabBtn("celebrity", t.tabCelebs)}
        </div>
      </PageHero>

      <section data-screen-label="Cases showcase" style={{ background: "#04202E" }}>
        {list.map((c, i) => {
          const s = caseCardStyle(i, tab);
          return (
            <div key={c.slug} className="dam-case" style={{ position: "sticky", top: 78, minHeight: "calc(100vh - 78px)", background: s.bg, boxShadow: "0 -30px 70px rgba(4,32,46,0.35)", display: "flex", flexWrap: "wrap", overflow: "hidden" }}>
              <div className="dam-caseimg" style={{ flex: "1 1 400px", minHeight: 380, position: "relative" }}>
                <ImageSlot src={c.imageUrl} placeholder={t.photoPh} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
                <span style={{ position: "absolute", inset: 0, background: s.imgGrad, pointerEvents: "none" }} />
              </div>
              <div className="dam-casebody" style={{ flex: "1.1 1 380px", padding: "clamp(40px, 6vw, 100px) clamp(24px, 5vw, 90px)", display: "flex", flexDirection: "column", gap: 18, justifyContent: "center", position: "relative", overflow: "hidden", boxSizing: "border-box" }}>
                <div style={{ position: "absolute", top: -24, insetInlineEnd: 12, fontFamily: SERIF, fontWeight: 700, fontSize: "clamp(110px, 13vw, 180px)", lineHeight: 1.2, color: s.numC, pointerEvents: "none", userSelect: "none" }}>{s.numStr}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ width: 46, height: 2, background: "#30B6DE", borderRadius: 2 }} />
                  <span style={{ background: s.chipBg, color: s.chipFg, border: "1px solid rgba(48,182,222,0.4)", borderRadius: 999, padding: "6px 18px", fontSize: 12.5, fontWeight: 800, letterSpacing: "0.6px" }}>{pick(c.tag, lang)}</span>
                </div>
                <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: "clamp(26px, 3.4vw, 42px)", lineHeight: 1.4, color: s.fg, textWrap: "pretty" }}>{pick(c.title, lang)}</div>
                <p style={{ fontSize: "clamp(15px, 1.5vw, 17px)", lineHeight: 2.05, color: s.subC, margin: 0, maxWidth: 560, textWrap: "pretty" }}>{pick(c.excerpt, lang)}</p>
                <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 8 }}>
                  <HoverBox as={Link} href={lp(`/cases/${slugFor(c, lang)}`)} style={{ background: "linear-gradient(135deg, #30B6DE, #1E92B8)", color: "#ffffff", borderRadius: 999, padding: "15px 34px", fontWeight: 800, fontSize: 15, boxShadow: "0 10px 26px rgba(48,182,222,0.4)" }} hoverStyle={{ boxShadow: "0 14px 34px rgba(48,182,222,0.55)", color: "#ffffff" }}>
                    {readMore}
                  </HoverBox>
                  <HoverBox as={Link} href={lp("/contact")} style={{ border: "1.5px solid " + (s.fg === "#ffffff" ? "rgba(255,255,255,0.4)" : "rgba(12,52,70,0.25)"), color: s.fg, borderRadius: 999, padding: "15px 30px", fontWeight: 700, fontSize: 15 }} hoverStyle={{ borderColor: "#30B6DE", color: "#30B6DE" }}>
                    {tc.book}
                  </HoverBox>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <section data-screen-label="Booking CTA" style={{ padding: "40px 24px 100px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", background: "linear-gradient(135deg, #0A3950 0%, #1E92B8 70%, #30B6DE 100%)", borderRadius: 30, padding: 56, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 40, flexWrap: "wrap", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -80, insetInlineEnd: -60, width: 280, height: 280, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.2)" }} />
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(26px, 2.8vw, 36px)", fontWeight: 700, color: "#ffffff", margin: 0, position: "relative" }}>{t.ctaTitle}</h2>
          <HoverBox as={Link} href={lp("/contact")} style={{ position: "relative", background: "#ffffff", color: "#0A3950", borderRadius: 999, padding: "16px 36px", fontWeight: 800, fontSize: 16, boxShadow: "0 12px 30px rgba(4,32,46,0.3)" }} hoverStyle={{ color: "#0A3950", transform: "translateY(-2px)" }}>
            {tc.book}
          </HoverBox>
        </div>
      </section>

      <Footer variant="simple" />
      <WhatsappFloat />
    </div>
  );
}

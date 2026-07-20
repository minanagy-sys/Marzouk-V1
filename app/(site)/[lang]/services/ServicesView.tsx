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
import { servicesContent } from "@/lib/content/services";
import { common } from "@/lib/content/common";
import { slugFor, pick, type Service, type ServiceCategory } from "@/lib/data/types";
import { SERIF, SANS } from "@/lib/theme";

export default function ServicesView({ services, categories = [] }: { services: Service[]; categories?: ServiceCategory[] }) {
  const { lang, dir, isAr, lp } = useLang();
  const t = usePageText("services", lang, servicesContent(lang).t);
  const tc = common(lang);
  const arrow = isAr ? "←" : "→";
  const [filter, setFilter] = useState<string>("all");

  // Only show category chips that actually have services attached (kept in sync
  // with the parent category each service belongs to).
  const parents = categories.filter((cat) => services.some((s) => s.categoryId === cat.id));
  const shown = filter === "all" ? services : services.filter((s) => s.categoryId === filter);
  const allLabel = isAr ? "الكل" : "All";
  const chip = (key: string, label: string) => {
    const active = filter === key;
    return (
      <button key={key} onClick={() => setFilter(key)} style={{ borderRadius: 999, padding: "9px 20px", fontFamily: SANS, fontWeight: 700, fontSize: 14, cursor: "pointer", border: "1.5px solid " + (active ? "#30B6DE" : "rgba(12,52,70,0.15)"), background: active ? "#30B6DE" : "#ffffff", color: active ? "#ffffff" : "#46687A" }}>{label}</button>
    );
  };

  return (
    <div style={{ fontFamily: SANS, direction: dir, color: "#0C3446", background: "#ffffff", minHeight: "100vh" }}>
      <Navbar active="services" cta="book" />
      <PageHero page="services" crumbLabel={tc.navServices} title={t.pageTitle} sub={t.pageSub} />

      <section data-screen-label="Services mosaic" style={{ padding: "60px 24px 90px" }}>
        {parents.length > 0 && (
          <div style={{ maxWidth: 1240, margin: "0 auto 36px", display: "flex", gap: 10, flexWrap: "wrap" }}>
            {chip("all", allLabel)}
            {parents.map((p) => chip(p.id, pick(p.name, lang)))}
          </div>
        )}
        <div className="dam-mosaic" style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gridAutoRows: "215px", gap: 20 }}>
          {shown.map((svc) => (
            <HoverBox
              key={svc.slug}
              as={Link}
              href={lp(`/services/${slugFor(svc, lang)}`)}
              style={{ position: "relative", borderRadius: 26, overflow: "hidden", border: "1px solid rgba(12,52,70,0.1)", boxShadow: "0 10px 28px rgba(12,52,70,0.08)", gridColumn: svc.gc, gridRow: svc.gr, background: "linear-gradient(160deg, #0A3950, #0E5372)", transition: "all 0.35s ease", color: "#ffffff" }}
              hoverStyle={{ boxShadow: "0 26px 56px rgba(48,182,222,0.3)", borderColor: "rgba(48,182,222,0.5)", color: "#ffffff" }}
            >
              <ImageSlot src={svc.imageUrl} placeholder={t.photoPh} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
              <span style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(4,32,46,0.18) 0%, rgba(4,32,46,0) 42%, rgba(4,32,46,0.9) 100%)", pointerEvents: "none" }} />
              <span className="dam-svc-tag" style={{ position: "absolute", top: 18, insetInlineStart: 18, background: "rgba(48,182,222,0.92)", color: "#ffffff", borderRadius: 999, padding: "6px 16px", fontSize: 12, fontWeight: 800, letterSpacing: "0.5px", pointerEvents: "none", boxShadow: "0 6px 16px rgba(4,32,46,0.35)" }}>{pick(svc.tag, lang)}</span>
              <span className="dam-svc-cap" style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "24px 24px 22px", pointerEvents: "none", display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12 }}>
                <span className="dam-svc-title" style={{ fontFamily: SERIF, fontWeight: 700, fontSize: "clamp(19px, 1.8vw, 25px)", lineHeight: 1.45, color: "#ffffff" }}>{pick(svc.title, lang)}</span>
                <span className="dam-svc-arrow" style={{ flexShrink: 0, width: 42, height: 42, borderRadius: "50%", background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.35)", backdropFilter: "blur(6px)", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>{arrow}</span>
              </span>
            </HoverBox>
          ))}
        </div>
      </section>

      <section data-screen-label="Booking CTA" style={{ padding: "0 24px 100px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", background: "linear-gradient(135deg, #0A3950 0%, #1E92B8 70%, #30B6DE 100%)", borderRadius: 30, padding: "clamp(26px, 5vw, 56px)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 40, flexWrap: "wrap", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -80, insetInlineEnd: -60, width: 280, height: 280, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.2)" }} />
          <div style={{ position: "relative" }}>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(26px, 2.8vw, 36px)", fontWeight: 700, color: "#ffffff", margin: 0 }}>{t.ctaTitle}</h2>
            <p style={{ fontSize: 15.5, color: "rgba(255,255,255,0.85)", margin: "12px 0 0", maxWidth: 560, lineHeight: 1.9 }}>{t.ctaBody}</p>
          </div>
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

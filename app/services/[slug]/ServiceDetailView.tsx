"use client";

import Link from "next/link";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsappFloat from "@/components/WhatsappFloat";
import HoverBox from "@/components/HoverBox";
import ImageSlot from "@/components/ImageSlot";
import { useLang } from "@/lib/lang";
import { common } from "@/lib/content/common";
import { pick, type Service } from "@/lib/data/types";
import { SERIF, SANS } from "@/lib/theme";

export default function ServiceDetailView({ service, related }: { service: Service; related: Service[] }) {
  const { lang, dir, isAr } = useLang();
  const tc = common(lang);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const arrow = isAr ? "←" : "→";

  const ui = isAr
    ? { crumb: "خدماتنا", benefitsTitle: "المزايا", faqTitle: "أسئلة شائعة", relatedTitle: "خدمات أخرى", ctaTitle: "هل ترغبين في حجز هذه الخدمة؟", ctaBtn: "احجزي الآن", back: "كل الخدمات" }
    : { crumb: "Our Services", benefitsTitle: "Benefits", faqTitle: "Frequently asked questions", relatedTitle: "Other services", ctaTitle: "Would you like to book this service?", ctaBtn: "Book now", back: "All services" };

  return (
    <div style={{ fontFamily: SANS, direction: dir, color: "#0C3446", background: "#ffffff", minHeight: "100vh" }}>
      <Navbar active="services" cta="book" />

      {/* HERO */}
      <section style={{ position: "relative", overflow: "hidden", background: "linear-gradient(140deg, #04202E 0%, #0A3950 55%, #0E5372 100%)", padding: "80px 24px" }}>
        <div style={{ position: "absolute", top: -160, insetInlineEnd: -100, width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle, rgba(48,182,222,0.3), transparent 65%)" }} />
        <div style={{ maxWidth: 1000, margin: "0 auto", position: "relative", animation: "damFadeUp 0.8s ease-out both" }}>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", fontWeight: 500 }}>
            <Link href="/" style={{ color: "#8FE0F7" }}>{tc.navHome}</Link> ·{" "}
            <Link href="/services" style={{ color: "#8FE0F7" }}>{ui.crumb}</Link>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 22 }}>
            <span style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(48,182,222,0.15)", border: "1px solid rgba(48,182,222,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, color: "#8FE0F7", fontFamily: SERIF }}>{service.glyph}</span>
            <span style={{ background: "rgba(48,182,222,0.18)", border: "1px solid rgba(48,182,222,0.4)", color: "#8FE0F7", borderRadius: 999, padding: "6px 16px", fontSize: 12.5, fontWeight: 800 }}>{pick(service.tag, lang)}</span>
          </div>
          <h1 style={{ fontFamily: SERIF, fontWeight: 700, fontSize: "clamp(32px, 4.4vw, 54px)", color: "#ffffff", margin: "18px 0 0", lineHeight: 1.3 }}>{pick(service.title, lang)}</h1>
          <p style={{ fontSize: 18, lineHeight: 1.9, color: "rgba(255,255,255,0.75)", margin: "18px 0 0", maxWidth: 680, textWrap: "pretty" }}>{pick(service.heroSub, lang)}</p>
          <HoverBox as={Link} href="/contact" style={{ display: "inline-block", marginTop: 30, background: "linear-gradient(135deg, #30B6DE, #1E92B8)", color: "#ffffff", borderRadius: 999, padding: "15px 34px", fontWeight: 800, fontSize: 16, boxShadow: "0 12px 30px rgba(48,182,222,0.45)" }} hoverStyle={{ boxShadow: "0 16px 38px rgba(48,182,222,0.6)", color: "#ffffff" }}>
            {ui.ctaBtn}
          </HoverBox>
        </div>
      </section>

      {/* INTRO + IMAGE */}
      <section style={{ padding: "80px 24px" }}>
        <div className="dam-2col" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 50, alignItems: "center" }}>
          <div>
            <div className="article-body" dir={isAr ? "rtl" : "ltr"} style={{ fontSize: 18, lineHeight: 2.1, color: "#46687A" }} dangerouslySetInnerHTML={{ __html: pick(service.intro, lang) }} />
          </div>
          <div style={{ borderRadius: 26, overflow: "hidden", border: "1px solid rgba(48,182,222,0.25)", boxShadow: "0 20px 50px rgba(12,52,70,0.12)", height: 320, background: "linear-gradient(160deg, #0A3950, #0E5372)" }}>
            <ImageSlot src={service.imageUrl} placeholder={isAr ? "أسقطي صورة هنا" : "Drop a photo here"} style={{ width: "100%", height: "100%" }} />
          </div>
        </div>
      </section>

      {/* SECTIONS */}
      <section style={{ padding: "0 24px 20px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", flexDirection: "column", gap: 40 }}>
          {service.sections.map((s, i) => (
            <div key={i} style={{ borderInlineStart: "3px solid #30B6DE", paddingInlineStart: 24 }}>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(22px, 2.6vw, 30px)", fontWeight: 700, color: "#0C3446", margin: 0 }}>{pick(s.heading, lang)}</h2>
              <div className="article-body" dir={isAr ? "rtl" : "ltr"} style={{ fontSize: 16.5, lineHeight: 2.05, color: "#46687A", marginTop: 14 }} dangerouslySetInnerHTML={{ __html: pick(s.body, lang) }} />
            </div>
          ))}
        </div>
      </section>

      {/* BENEFITS */}
      {service.benefits.length > 0 && (
        <section style={{ padding: "70px 24px" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(24px, 3vw, 34px)", fontWeight: 700, color: "#0C3446", marginBottom: 28 }}>{ui.benefitsTitle}</h2>
            <div className="dam-2col-sm" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
              {service.benefits.map((b, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14, background: "#F4FBFD", border: "1px solid rgba(48,182,222,0.2)", borderRadius: 16, padding: "20px 22px" }}>
                  <span style={{ flexShrink: 0, width: 26, height: 26, borderRadius: "50%", background: "#30B6DE", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 800 }}>✓</span>
                  <span style={{ fontSize: 15.5, lineHeight: 1.7, color: "#0C3446", fontWeight: 600 }}>{pick(b, lang)}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {service.faq.length > 0 && (
        <section style={{ padding: "0 24px 80px" }}>
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(24px, 3vw, 34px)", fontWeight: 700, color: "#0C3446", marginBottom: 24 }}>{ui.faqTitle}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {service.faq.map((f, i) => {
                const open = openFaq === i;
                return (
                  <div key={i} style={{ border: "1px solid rgba(12,52,70,0.1)", borderRadius: 16, overflow: "hidden", background: open ? "#F4FBFD" : "#ffffff" }}>
                    <button onClick={() => setOpenFaq(open ? null : i)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "20px 24px", background: "none", border: "none", cursor: "pointer", fontFamily: SANS, textAlign: "start" }}>
                      <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 17.5, color: "#0C3446" }}>{pick(f.q, lang)}</span>
                      <span style={{ flexShrink: 0, color: "#30B6DE", fontSize: 22, transform: open ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>+</span>
                    </button>
                    {open && <div style={{ padding: "0 24px 22px", fontSize: 15.5, lineHeight: 2, color: "#46687A" }}>{pick(f.a, lang)}</div>}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section style={{ padding: "0 24px 80px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", background: "linear-gradient(135deg, #0A3950 0%, #1E92B8 70%, #30B6DE 100%)", borderRadius: 30, padding: "clamp(28px, 5vw, 56px)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 32, flexWrap: "wrap", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -80, insetInlineEnd: -60, width: 260, height: 260, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.2)" }} />
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(24px, 2.8vw, 34px)", fontWeight: 700, color: "#ffffff", margin: 0, position: "relative" }}>{ui.ctaTitle}</h2>
          <HoverBox as={Link} href="/contact" style={{ position: "relative", background: "#ffffff", color: "#0A3950", borderRadius: 999, padding: "16px 36px", fontWeight: 800, fontSize: 16, boxShadow: "0 12px 30px rgba(4,32,46,0.3)" }} hoverStyle={{ color: "#0A3950", transform: "translateY(-2px)" }}>
            {tc.book}
          </HoverBox>
        </div>
      </section>

      {/* RELATED */}
      {related.length > 0 && (
        <section style={{ padding: "0 24px 100px" }}>
          <div style={{ maxWidth: 1240, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 28, flexWrap: "wrap" }}>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(24px, 3vw, 34px)", fontWeight: 700, color: "#0C3446", margin: 0 }}>{ui.relatedTitle}</h2>
              <HoverBox as={Link} href="/services" style={{ fontWeight: 700, fontSize: 15 }}>{ui.back} {arrow}</HoverBox>
            </div>
            <div className="dam-3col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
              {related.map((r) => (
                <HoverBox key={r.slug} as={Link} href={`/services/${r.slug}`} style={{ position: "relative", height: 240, borderRadius: 22, overflow: "hidden", border: "1px solid rgba(12,52,70,0.08)", background: "linear-gradient(160deg, #0A3950, #0E5372)", color: "#ffffff", transition: "all 0.35s ease" }} hoverStyle={{ transform: "translateY(-6px)", boxShadow: "0 24px 50px rgba(48,182,222,0.28)" }}>
                  <ImageSlot src={r.imageUrl} placeholder={isAr ? "أسقطي صورة هنا" : "Drop a photo here"} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
                  <span style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(4,32,46,0.2) 0%, rgba(4,32,46,0) 40%, rgba(4,32,46,0.92) 100%)", pointerEvents: "none" }} />
                  <span style={{ position: "absolute", bottom: 0, insetInline: 0, padding: "22px 22px", fontFamily: SERIF, fontWeight: 700, fontSize: 19, color: "#ffffff", pointerEvents: "none" }}>{pick(r.title, lang)}</span>
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

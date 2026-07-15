"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsappFloat from "@/components/WhatsappFloat";
import PageHero from "@/components/PageHero";
import HoverBox from "@/components/HoverBox";
import { useLang } from "@/lib/lang";
import { aboutContent } from "@/lib/content/about";
import { common } from "@/lib/content/common";
import { pick, type Testimonial } from "@/lib/data/types";
import { SERIF, SANS } from "@/lib/theme";

export default function AboutView({ testimonials }: { testimonials: Testimonial[] }) {
  const { lang, dir } = useLang();
  const { t, facts, vm, why } = aboutContent(lang);
  const tc = common(lang);

  return (
    <div style={{ fontFamily: SANS, direction: dir, color: "#0C3446", background: "#ffffff", minHeight: "100vh" }}>
      <Navbar active="about" cta="book" />
      <PageHero crumbLabel={tc.navAbout} title={t.pageTitle} sub={t.pageSub} />

      {/* WHO WE ARE */}
      <section data-screen-label="Who we are" style={{ padding: "100px 24px" }}>
        <div className="dam-2col" style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "0.85fr 1.15fr", gap: 64, alignItems: "center" }}>
          <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
            <div style={{ position: "absolute", inset: "-6%", borderRadius: "50%", background: "radial-gradient(circle, rgba(48,182,222,0.16), transparent 62%)" }} />
            <div style={{ position: "relative", width: "min(380px, 100%)", borderRadius: "220px 220px 24px 24px", overflow: "hidden", border: "1px solid rgba(48,182,222,0.4)", boxShadow: "0 30px 70px rgba(12,52,70,0.25)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/doctor-crop.png" alt="Dr. Ahmed Marzouk" style={{ display: "block", width: "100%", height: "auto" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 60%, rgba(4,32,46,0.75) 100%)", pointerEvents: "none" }} />
            </div>
            <div style={{ position: "absolute", bottom: "6%", insetInlineEnd: 0, background: "#ffffff", border: "1px solid rgba(48,182,222,0.35)", borderRadius: 16, padding: "14px 22px", boxShadow: "0 14px 34px rgba(12,52,70,0.15)", animation: "damFloat 6s ease-in-out infinite" }}>
              <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 24, color: "#30B6DE" }}>+10,000</div>
              <div style={{ fontSize: 12.5, color: "#5B7A88" }}>{t.statBirths}</div>
            </div>
          </div>
          <div>
            <div style={{ color: "#30B6DE", fontWeight: 800, fontSize: 14, letterSpacing: "2px", textTransform: "uppercase" }}>{t.whoKicker}</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px, 3.2vw, 42px)", fontWeight: 700, margin: "14px 0 0", color: "#0C3446", lineHeight: 1.35 }}>{t.whoTitle}</h2>
            <p style={{ fontSize: 16.5, lineHeight: 2.05, color: "#46687A", margin: "22px 0 0", textWrap: "pretty" }}>{t.whoBody1}</p>
            <p style={{ fontSize: 16.5, lineHeight: 2.05, color: "#46687A", margin: "16px 0 0", textWrap: "pretty" }}>{t.whoBody2}</p>
            <div style={{ display: "flex", gap: 34, marginTop: 32, flexWrap: "wrap" }}>
              {facts.map((f) => (
                <div key={f.label}>
                  <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 28, color: "#30B6DE" }}>{f.num}</div>
                  <div style={{ fontSize: 13.5, color: "#5B7A88", maxWidth: 150 }}>{f.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MISSION VISION VALUES */}
      <section data-screen-label="Mission vision values" style={{ padding: "100px 24px", background: "linear-gradient(140deg, #04202E 0%, #0A3950 60%, #0C4661 100%)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -140, insetInlineStart: -100, width: 440, height: 440, borderRadius: "50%", background: "radial-gradient(circle, rgba(48,182,222,0.2), transparent 65%)" }} />
        <div style={{ maxWidth: 1240, margin: "0 auto", position: "relative" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "#30B6DE", fontWeight: 800, fontSize: 14, letterSpacing: "2px", textTransform: "uppercase" }}>{t.vmKicker}</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px, 3.4vw, 44px)", fontWeight: 700, margin: "12px 0 0", color: "#ffffff" }}>{t.vmTitle}</h2>
          </div>
          <div className="dam-3col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 26, marginTop: 54 }}>
            {vm.map((v) => (
              <HoverBox key={v.num} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(48,182,222,0.25)", borderRadius: 24, padding: "38px 32px" }} hoverStyle={{ borderColor: "rgba(48,182,222,0.6)", background: "rgba(48,182,222,0.08)" }}>
                <div style={{ fontFamily: SERIF, fontSize: 44, fontWeight: 700, color: "rgba(48,182,222,0.45)" }}>{v.num}</div>
                <div style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 700, color: "#ffffff", marginTop: 10 }}>{v.title}</div>
                <p style={{ fontSize: 15, lineHeight: 1.95, color: "rgba(255,255,255,0.7)", margin: "14px 0 0" }}>{v.body}</p>
              </HoverBox>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section data-screen-label="Why choose us" style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "#30B6DE", fontWeight: 800, fontSize: 14, letterSpacing: "2px", textTransform: "uppercase" }}>{t.whyKicker}</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px, 3.4vw, 44px)", fontWeight: 700, margin: "12px 0 0", color: "#0C3446" }}>{t.whyTitle}</h2>
          </div>
          <div className="dam-4col" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 22, marginTop: 50 }}>
            {why.map((w) => (
              <HoverBox key={w.title} style={{ background: "#F4FBFD", border: "1px solid rgba(48,182,222,0.2)", borderRadius: 20, padding: "30px 26px", textAlign: "center" }} hoverStyle={{ background: "#EAF7FB", borderColor: "rgba(48,182,222,0.5)", transform: "translateY(-6px)" }}>
                <span style={{ width: 56, height: 56, margin: "0 auto", borderRadius: "50%", background: "#ffffff", border: "1px solid rgba(48,182,222,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 25, color: "#1E92B8", boxShadow: "0 6px 14px rgba(48,182,222,0.15)", fontFamily: SERIF, fontWeight: 700 }}>{w.glyph}</span>
                <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 19, color: "#0C3446", marginTop: 16 }}>{w.title}</div>
                <div style={{ fontSize: 14, lineHeight: 1.8, color: "#5B7A88", marginTop: 8 }}>{w.desc}</div>
              </HoverBox>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS (dynamic) */}
      <section data-screen-label="Testimonials" style={{ padding: "0 24px 100px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "#30B6DE", fontWeight: 800, fontSize: 14, letterSpacing: "2px", textTransform: "uppercase" }}>{t.testiKicker}</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px, 3.4vw, 44px)", fontWeight: 700, margin: "12px 0 0", color: "#0C3446" }}>{t.testiTitle}</h2>
          </div>
          <div className="dam-3col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 26, marginTop: 50 }}>
            {testimonials.map((q) => (
              <div key={q.id} style={{ background: "#ffffff", border: "1px solid rgba(12,52,70,0.08)", borderRadius: 22, padding: "34px 30px", boxShadow: "0 4px 14px rgba(12,52,70,0.05)", display: "flex", flexDirection: "column", gap: 16 }}>
                <span style={{ fontFamily: SERIF, fontSize: 46, lineHeight: 0.6, color: "rgba(48,182,222,0.4)" }}>&#8220;</span>
                <p style={{ fontSize: 15, lineHeight: 2, color: "#46687A", margin: 0, flex: 1 }}>{pick(q.text, lang)}</p>
                <div style={{ fontWeight: 800, fontSize: 14.5, color: "#0C3446" }}>{q.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section data-screen-label="Booking CTA" style={{ padding: "0 24px 100px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", background: "linear-gradient(135deg, #0A3950 0%, #1E92B8 70%, #30B6DE 100%)", borderRadius: 30, padding: 56, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 40, flexWrap: "wrap", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -80, insetInlineEnd: -60, width: 280, height: 280, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.2)" }} />
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(26px, 2.8vw, 36px)", fontWeight: 700, color: "#ffffff", margin: 0, position: "relative" }}>{t.ctaTitle}</h2>
          <HoverBox as={Link} href="/contact" style={{ position: "relative", background: "#ffffff", color: "#0A3950", borderRadius: 999, padding: "16px 36px", fontWeight: 800, fontSize: 16, boxShadow: "0 12px 30px rgba(4,32,46,0.3)" }} hoverStyle={{ color: "#0A3950", transform: "translateY(-2px)" }}>
            {tc.book}
          </HoverBox>
        </div>
      </section>

      <Footer variant="simple" />
      <WhatsappFloat />
    </div>
  );
}

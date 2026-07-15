"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsappFloat from "@/components/WhatsappFloat";
import ImageSlot from "@/components/ImageSlot";
import HoverBox from "@/components/HoverBox";
import { useLang } from "@/lib/lang";
import { homeContent } from "@/lib/content/home";
import { common, CONTACT_INFO } from "@/lib/content/common";
import { SERIF, SANS } from "@/lib/theme";

export default function HomePage() {
  const { lang, dir, isAr } = useLang();
  const c = homeContent(lang);
  const t = c.t;
  const tc = common(lang);

  const [slide, setSlide] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => setSlide((s) => (s + 1) % 3), 6500);
  };
  useEffect(() => {
    startTimer();
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, []);
  const goSlide = (n: number) => {
    setSlide(((n % 3) + 3) % 3);
    startTimer();
  };

  const even = slide % 2 === 0;
  const slideAnim = (even ? "damFadeUpA" : "damFadeUpB") + " 0.85s ease-out both";
  const visualAnim = (even ? "damZoomA" : "damZoomB") + " 0.9s ease-out both";
  const arrow = isAr ? "←" : "→";
  const arrowPrev = isAr ? "→" : "←";
  const arrowNext = isAr ? "←" : "→";
  const cs = c.slides[slide];
  const nextTitle = c.slides[(slide + 1) % 3].t1 + " " + c.slides[(slide + 1) % 3].t2;

  return (
    <div style={{ fontFamily: SANS, direction: dir, color: "#0C3446", background: "#ffffff", minHeight: "100vh" }}>
      <Navbar active="home" dropdowns cta="book" />

      {/* ============ HERO SLIDER ============ */}
      <section
        data-screen-label="Hero slider"
        style={{ position: "relative", overflow: "hidden", background: "#04202E", minHeight: "94vh", display: "flex", flexDirection: "column" }}
      >
        <div key={slide} style={{ position: "absolute", inset: 0, animation: visualAnim }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={"/" + c.heroImages[slide]}
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "78% center",
              transform: isAr ? "scaleX(-1)" : "none",
            }}
          />
        </div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(4,32,46,0) 82%, rgba(4,32,46,0.55) 100%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "14%", insetInlineStart: "5%", width: 200, height: 200, border: "1px solid rgba(48,182,222,0.22)", borderRadius: "50%", animation: "damFloatSlow 11s ease-in-out infinite", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "60%", insetInlineStart: "46%", width: 80, height: 80, border: "1px dashed rgba(48,182,222,0.3)", borderRadius: "50%", animation: "damSpin 30s linear infinite", pointerEvents: "none" }} />
        <svg viewBox="0 0 1200 120" style={{ position: "absolute", bottom: "16%", left: 0, width: "100%", opacity: 0.35, pointerEvents: "none" }} preserveAspectRatio="none">
          <path d="M0 60 H300 l18 0 12 -34 16 62 14 -46 10 18 h60 l14 -40 16 74 14 -34 h718" stroke="#30B6DE" strokeWidth="2.5" fill="none" strokeDasharray="1200" style={{ animation: "damEcg 5s ease-out infinite" }} />
        </svg>
        <div style={{ position: "absolute", top: 40, insetInlineEnd: "2%", fontFamily: SERIF, fontWeight: 700, fontSize: "clamp(140px, 18vw, 280px)", lineHeight: 1, color: "rgba(143,224,247,0.07)", pointerEvents: "none", userSelect: "none" }}>
          {"0" + (slide + 1)}
        </div>

        <div style={{ position: "relative", maxWidth: 1240, margin: "0 auto", width: "100%", padding: "120px 24px 60px", flex: 1, display: "flex", alignItems: "center", boxSizing: "border-box" }}>
          <div key={"s" + slide} style={{ maxWidth: 660, animation: slideAnim }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ width: 54, height: 2, background: "linear-gradient(90deg, #30B6DE, transparent)", borderRadius: 2 }} />
              <span style={{ color: "#7FD6EF", fontSize: 14, fontWeight: 800, letterSpacing: "3px", textTransform: "uppercase" }}>{cs.kicker}</span>
            </div>
            <h1 style={{ fontFamily: SERIF, fontWeight: 700, fontSize: "clamp(44px, 5.6vw, 80px)", lineHeight: 1.15, color: "#ffffff", margin: "28px 0 0", textShadow: "0 3px 30px rgba(4,32,46,0.75)" }}>
              {cs.t1}
              <span style={{ display: "block", background: "linear-gradient(90deg, #30B6DE, #8FE0F7)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>{cs.t2}</span>
            </h1>
            <p style={{ fontSize: "clamp(16px, 1.6vw, 19px)", lineHeight: 1.95, color: "#ffffff", margin: "24px 0 0", maxWidth: 560, textWrap: "pretty", textShadow: "0 2px 18px rgba(4,32,46,0.8)" }}>{cs.sub}</p>
            <div style={{ display: "flex", gap: 16, marginTop: 38, flexWrap: "wrap" }}>
              <HoverBox as={Link} href="/contact" style={{ background: "linear-gradient(135deg, #30B6DE, #1E92B8)", color: "#ffffff", borderRadius: 999, padding: "17px 38px", fontWeight: 800, fontSize: 16, boxShadow: "0 12px 30px rgba(48,182,222,0.45)" }} hoverStyle={{ boxShadow: "0 16px 38px rgba(48,182,222,0.6)", color: "#ffffff" }}>
                {t.heroCta1}
              </HoverBox>
              <HoverBox as={Link} href="/services" style={{ border: "1.5px solid rgba(255,255,255,0.4)", color: "#ffffff", borderRadius: 999, padding: "17px 38px", fontWeight: 700, fontSize: 16, backdropFilter: "blur(4px)" }} hoverStyle={{ borderColor: "#30B6DE", color: "#8FE0F7" }}>
                {t.heroCta2}
              </HoverBox>
            </div>
          </div>
        </div>

        <div style={{ position: "relative", borderTop: "1px solid rgba(255,255,255,0.14)", background: "rgba(4,32,46,0.55)", backdropFilter: "blur(12px)" }}>
          <div style={{ maxWidth: 1240, margin: "0 auto", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 28, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <HoverBox as="button" onClick={() => goSlide(slide - 1)} style={{ width: 50, height: 50, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.05)", color: "#ffffff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }} hoverStyle={{ borderColor: "#30B6DE", color: "#8FE0F7", background: "rgba(48,182,222,0.12)" }}>
                {arrowPrev}
              </HoverBox>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {c.slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goSlide(i)}
                    aria-label={"Slide " + (i + 1)}
                    style={{ height: 5, border: "none", borderRadius: 3, cursor: "pointer", padding: 0, transition: "all 0.4s ease", width: i === slide ? 44 : 18, background: i === slide ? "#30B6DE" : "rgba(255,255,255,0.25)" }}
                  />
                ))}
              </div>
              <HoverBox as="button" onClick={() => goSlide(slide + 1)} style={{ width: 50, height: 50, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.05)", color: "#ffffff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }} hoverStyle={{ borderColor: "#30B6DE", color: "#8FE0F7", background: "rgba(48,182,222,0.12)" }}>
                {arrowNext}
              </HoverBox>
              <span style={{ fontFamily: SERIF, fontSize: 15, color: "rgba(255,255,255,0.55)", letterSpacing: "2px", direction: "ltr" }}>{"0" + (slide + 1) + " / 03"}</span>
            </div>

            <div style={{ display: "flex", gap: 36, flexWrap: "wrap" }}>
              {c.stats.map((s, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 24, color: "#30B6DE" }}>{s.num}</span>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", maxWidth: 170 }}>{s.label}</span>
                </div>
              ))}
            </div>

            <HoverBox as="button" onClick={() => goSlide(slide + 1)} style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 4, background: "none", border: "none", cursor: "pointer", fontFamily: SANS, textAlign: "start", padding: "8px 0" }} hoverStyle={{ opacity: 0.85 }}>
              <span style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: "2px", color: "#7FD6EF", textTransform: "uppercase" }}>{t.nextLabel} {arrowNext}</span>
              <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 17, color: "#ffffff", maxWidth: 260 }}>{nextTitle}</span>
            </HoverBox>
          </div>
        </div>
      </section>

      {/* ============ MESSAGE ============ */}
      <section data-screen-label="Doctor message" style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <div style={{ color: "#30B6DE", fontWeight: 800, fontSize: 14, letterSpacing: "2px", textTransform: "uppercase" }}>{t.msgKicker}</div>
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px, 3.4vw, 44px)", fontWeight: 700, margin: "14px 0 0", color: "#0C3446" }}>{t.msgTitle}</h2>
          <div style={{ width: 64, height: 3, background: "linear-gradient(90deg, #30B6DE, #8FE0F7)", borderRadius: 3, margin: "22px auto 0" }} />
          <p style={{ fontSize: 18, lineHeight: 2.05, color: "#46687A", margin: "28px 0 0", textWrap: "pretty" }}>{t.msgBody}</p>
        </div>
      </section>

      {/* ============ SERVICES ============ */}
      <section data-screen-label="Services" style={{ padding: "90px 24px", background: "linear-gradient(180deg, #F4FBFD 0%, #ffffff 100%)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
            <div>
              <div style={{ color: "#30B6DE", fontWeight: 800, fontSize: 14, letterSpacing: "2px", textTransform: "uppercase" }}>{t.svcKicker}</div>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px, 3.4vw, 44px)", fontWeight: 700, margin: "12px 0 0", color: "#0C3446" }}>{t.svcTitle}</h2>
            </div>
            <HoverBox as={Link} href="/services" style={{ fontWeight: 700, fontSize: 15, display: "flex", alignItems: "center", gap: 8 }}>
              {t.viewAll} <span style={{ fontSize: 18 }}>{arrow}</span>
            </HoverBox>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: 24, marginTop: 48 }}>
            {c.services.map((svc) => (
              <HoverBox
                key={svc.slotId}
                style={{ position: "relative", height: 460, borderRadius: 26, overflow: "hidden", border: "1px solid rgba(12,52,70,0.08)", boxShadow: "0 10px 30px rgba(12,52,70,0.08)", background: "linear-gradient(160deg, #0A3950, #0E5372)", transition: "all 0.35s ease" }}
                hoverStyle={{ transform: "translateY(-8px)", boxShadow: "0 28px 60px rgba(48,182,222,0.28)" }}
              >
                <ImageSlot placeholder={t.photoPh} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(4,32,46,0.25) 0%, rgba(4,32,46,0) 38%, rgba(4,32,46,0.55) 62%, rgba(4,32,46,0.94) 100%)", pointerEvents: "none" }} />
                <span style={{ position: "absolute", top: 18, insetInlineStart: 18, background: "rgba(48,182,222,0.92)", color: "#ffffff", borderRadius: 999, padding: "6px 16px", fontSize: 12, fontWeight: 800, letterSpacing: "0.6px", pointerEvents: "none", boxShadow: "0 6px 16px rgba(4,32,46,0.35)" }}>{svc.tag}</span>
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "28px 26px", pointerEvents: "none" }}>
                  <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 24, lineHeight: 1.45, color: "#ffffff", display: "block" }}>{svc.title}</span>
                </div>
              </HoverBox>
            ))}
          </div>
        </div>
      </section>

      {/* ============ VISION & MISSION ============ */}
      <section data-screen-label="Vision and mission" style={{ padding: "100px 24px", background: "linear-gradient(140deg, #04202E 0%, #0A3950 60%, #0C4661 100%)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -140, insetInlineEnd: -100, width: 440, height: 440, borderRadius: "50%", background: "radial-gradient(circle, rgba(48,182,222,0.22), transparent 65%)" }} />
        <div style={{ position: "absolute", bottom: "10%", insetInlineStart: "4%", width: 160, height: 160, border: "1px dashed rgba(48,182,222,0.3)", borderRadius: "50%", animation: "damSpin 40s linear infinite" }} />
        <div style={{ maxWidth: 1240, margin: "0 auto", position: "relative" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "#30B6DE", fontWeight: 800, fontSize: 14, letterSpacing: "2px", textTransform: "uppercase" }}>{t.vmKicker}</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px, 3.4vw, 44px)", fontWeight: 700, margin: "12px 0 0", color: "#ffffff" }}>{t.vmTitle}</h2>
          </div>
          <div className="dam-3col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 26, marginTop: 54 }}>
            {c.vm.map((v) => (
              <HoverBox key={v.num} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(48,182,222,0.25)", borderRadius: 24, padding: "38px 32px", backdropFilter: "blur(6px)" }} hoverStyle={{ borderColor: "rgba(48,182,222,0.6)", background: "rgba(48,182,222,0.08)" }}>
                <div style={{ fontFamily: SERIF, fontSize: 44, fontWeight: 700, color: "rgba(48,182,222,0.45)" }}>{v.num}</div>
                <div style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 700, color: "#ffffff", marginTop: 10 }}>{v.title}</div>
                <p style={{ fontSize: 15, lineHeight: 1.95, color: "rgba(255,255,255,0.7)", margin: "14px 0 0" }}>{v.body}</p>
              </HoverBox>
            ))}
          </div>
        </div>
      </section>

      {/* ============ WHY CHOOSE US ============ */}
      <section data-screen-label="Why choose us" style={{ padding: "100px 24px" }}>
        <div className="dam-2col" style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "0.9fr 1.1fr", gap: 60, alignItems: "center" }}>
          <div>
            <div style={{ color: "#30B6DE", fontWeight: 800, fontSize: 14, letterSpacing: "2px", textTransform: "uppercase" }}>{t.whyKicker}</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px, 3.4vw, 44px)", fontWeight: 700, margin: "14px 0 0", color: "#0C3446", lineHeight: 1.3 }}>{t.whyTitle}</h2>
            <p style={{ fontSize: 16.5, lineHeight: 2, color: "#46687A", margin: "20px 0 0", textWrap: "pretty" }}>{t.whyBody}</p>
            <HoverBox as={Link} href="/about" style={{ display: "inline-flex", marginTop: 30, background: "#0C3446", color: "#ffffff", borderRadius: 999, padding: "14px 30px", fontWeight: 700, fontSize: 15 }} hoverStyle={{ background: "#1E92B8", color: "#ffffff" }}>
              {t.whyCta}
            </HoverBox>
          </div>
          <div className="dam-2col-sm" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
            {c.why.map((w) => (
              <HoverBox key={w.title} style={{ background: "#F4FBFD", border: "1px solid rgba(48,182,222,0.2)", borderRadius: 20, padding: "30px 26px" }} hoverStyle={{ background: "#EAF7FB", borderColor: "rgba(48,182,222,0.5)" }}>
                <span style={{ width: 52, height: 52, borderRadius: "50%", background: "#ffffff", border: "1px solid rgba(48,182,222,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, color: "#1E92B8", boxShadow: "0 6px 14px rgba(48,182,222,0.15)", fontFamily: SERIF, fontWeight: 700 }}>{w.glyph}</span>
                <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 19, color: "#0C3446", marginTop: 16 }}>{w.title}</div>
                <div style={{ fontSize: 14, lineHeight: 1.8, color: "#5B7A88", marginTop: 8 }}>{w.desc}</div>
              </HoverBox>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CELEBRITIES STRIP ============ */}
      <section data-screen-label="Celebrity cases" style={{ padding: "90px 0", background: "linear-gradient(180deg, #F4FBFD 0%, #ffffff 100%)", overflow: "hidden" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
          <div>
            <div style={{ color: "#30B6DE", fontWeight: 800, fontSize: 14, letterSpacing: "2px", textTransform: "uppercase" }}>{t.celebKicker}</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px, 3.4vw, 44px)", fontWeight: 700, margin: "12px 0 0", color: "#0C3446" }}>{t.celebTitle}</h2>
          </div>
          <HoverBox as={Link} href="/cases#celebs" style={{ fontWeight: 700, fontSize: 15 }}>{t.viewAll} {arrow}</HoverBox>
        </div>
        <div className="dam-scroll-row" style={{ display: "flex", gap: 22, overflowX: "auto", padding: "44px 24px 10px", scrollSnapType: "x mandatory", maxWidth: 1240, margin: "0 auto" }}>
          {c.celebs.map((cel) => (
            <HoverBox key={cel.slotId} as={Link} href="/cases#celebs" style={{ flex: "0 0 250px", scrollSnapAlign: "start", background: "#ffffff", border: "1px solid rgba(12,52,70,0.08)", borderRadius: 22, padding: 26, textAlign: "center", color: "#0C3446", boxShadow: "0 4px 14px rgba(12,52,70,0.05)" }} hoverStyle={{ transform: "translateY(-6px)", boxShadow: "0 20px 44px rgba(48,182,222,0.18)", color: "#0C3446" }}>
              <span style={{ display: "block", width: 110, height: 110, margin: "0 auto", borderRadius: "50%", padding: 4, background: "linear-gradient(135deg, #30B6DE, #8FE0F7)" }}>
                <ImageSlot shape="circle" placeholder={t.photoPh} style={{ width: 102, height: 102 }} />
              </span>
              <span style={{ display: "block", fontFamily: SERIF, fontWeight: 700, fontSize: 18, marginTop: 18 }}>{cel.name}</span>
              <span style={{ display: "block", fontSize: 13, color: "#5B7A88", marginTop: 6, lineHeight: 1.7 }}>{cel.caption}</span>
            </HoverBox>
          ))}
        </div>
      </section>

      {/* ============ BOOKING CTA ============ */}
      <section data-screen-label="Booking CTA" style={{ padding: "40px 24px 100px" }}>
        <div className="dam-2col" style={{ maxWidth: 1240, margin: "0 auto", background: "linear-gradient(135deg, #0A3950 0%, #1E92B8 70%, #30B6DE 100%)", borderRadius: 30, padding: "clamp(28px, 5vw, 64px) clamp(22px, 4.5vw, 56px)", position: "relative", overflow: "hidden", display: "grid", gridTemplateColumns: "1.3fr 0.7fr", gap: 40, alignItems: "center" }}>
          <div style={{ position: "absolute", top: -80, insetInlineEnd: -60, width: 300, height: 300, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.2)" }} />
          <div style={{ position: "absolute", bottom: -110, insetInlineEnd: 60, width: 240, height: 240, borderRadius: "50%", border: "1px dashed rgba(255,255,255,0.25)", animation: "damSpin 36s linear infinite" }} />
          <div style={{ position: "relative" }}>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px, 3vw, 40px)", fontWeight: 700, color: "#ffffff", margin: 0, lineHeight: 1.35 }}>{t.ctaTitle}</h2>
            <p style={{ fontSize: 16, lineHeight: 1.95, color: "rgba(255,255,255,0.85)", margin: "16px 0 0", maxWidth: 560 }}>{t.ctaBody}</p>
          </div>
          <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 14 }}>
            <HoverBox as={Link} href="/contact" style={{ background: "#ffffff", color: "#0A3950", borderRadius: 999, padding: "16px 32px", fontWeight: 800, fontSize: 16, textAlign: "center", boxShadow: "0 12px 30px rgba(4,32,46,0.3)" }} hoverStyle={{ transform: "translateY(-2px)", color: "#0A3950" }}>
              {tc.book}
            </HoverBox>
            <HoverBox as="a" href={`tel:${CONTACT_INFO.phone1}`} style={{ border: "1.5px solid rgba(255,255,255,0.5)", color: "#ffffff", borderRadius: 999, padding: "15px 32px", fontWeight: 700, fontSize: 16, textAlign: "center", direction: "ltr" }} hoverStyle={{ borderColor: "#ffffff", background: "rgba(255,255,255,0.1)", color: "#ffffff" }}>
              {CONTACT_INFO.phone1}
            </HoverBox>
          </div>
        </div>
      </section>

      {/* ============ NEWS ============ */}
      <section data-screen-label="News" style={{ padding: "0 24px 100px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
            <div>
              <div style={{ color: "#30B6DE", fontWeight: 800, fontSize: 14, letterSpacing: "2px", textTransform: "uppercase" }}>{t.newsKicker}</div>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px, 3.4vw, 44px)", fontWeight: 700, margin: "12px 0 0", color: "#0C3446" }}>{t.newsTitle}</h2>
            </div>
            <HoverBox as={Link} href="/blogs" style={{ fontWeight: 700, fontSize: 15 }}>{t.viewAll} {arrow}</HoverBox>
          </div>
          <div className="dam-3col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 26, marginTop: 46 }}>
            {c.news.map((n) => (
              <HoverBox key={n.slotId} as={Link} href="/blogs" style={{ background: "#ffffff", border: "1px solid rgba(12,52,70,0.08)", borderRadius: 22, overflow: "hidden", color: "#0C3446", boxShadow: "0 4px 14px rgba(12,52,70,0.04)", display: "flex", flexDirection: "column" }} hoverStyle={{ transform: "translateY(-6px)", boxShadow: "0 20px 44px rgba(48,182,222,0.16)", color: "#0C3446" }}>
                <span style={{ display: "block", height: 190 }}>
                  <ImageSlot placeholder={t.photoPh} style={{ width: "100%", height: 190 }} />
                </span>
                <span style={{ display: "flex", flexDirection: "column", gap: 10, padding: 24 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: "#30B6DE", letterSpacing: "0.5px" }}>{n.date}</span>
                  <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 19, lineHeight: 1.5 }}>{n.title}</span>
                </span>
              </HoverBox>
            ))}
          </div>
        </div>
      </section>

      <Footer variant="full" />
      <WhatsappFloat />
    </div>
  );
}

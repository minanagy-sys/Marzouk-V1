"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsappFloat from "@/components/WhatsappFloat";
import ImageSlot from "@/components/ImageSlot";
import HoverBox from "@/components/HoverBox";
import Slider from "@/components/Slider";
import { useLang } from "@/lib/lang";
import { homeContent } from "@/lib/content/home";
import { common, CONTACT_INFO } from "@/lib/content/common";
import { pick, type Service, type Celebrity, type Testimonial, type InstagramPost, type BlogPostBi } from "@/lib/data/types";
import { ytThumb } from "@/lib/youtube";
import { SERIF, SANS } from "@/lib/theme";

export default function HomeView({
  services, celebrities, reviews, instagram, posts,
}: {
  services: Service[]; celebrities: Celebrity[]; reviews: Testimonial[]; instagram: InstagramPost[]; posts: BlogPostBi[];
}) {
  const { lang, dir, isAr } = useLang();
  const c = homeContent(lang);
  const t = c.t;
  const tc = common(lang);

  const [slide, setSlide] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimer = () => { if (timer.current) clearInterval(timer.current); timer.current = setInterval(() => setSlide((s) => (s + 1) % 3), 6500); };
  useEffect(() => { startTimer(); return () => { if (timer.current) clearInterval(timer.current); }; }, []);
  const goSlide = (n: number) => { setSlide(((n % 3) + 3) % 3); startTimer(); };

  const even = slide % 2 === 0;
  const slideAnim = (even ? "damFadeUpA" : "damFadeUpB") + " 0.85s ease-out both";
  const visualAnim = (even ? "damZoomA" : "damZoomB") + " 0.9s ease-out both";
  const arrow = isAr ? "←" : "→";
  const arrowPrev = isAr ? "→" : "←";
  const arrowNext = isAr ? "←" : "→";
  const cs = c.slides[slide];
  const nextTitle = c.slides[(slide + 1) % 3].t1 + " " + c.slides[(slide + 1) % 3].t2;

  const L = isAr
    ? { revKicker: "آراء المرضى", revTitle: "ماذا قالوا عنا", igKicker: "إنستجرام", igTitle: "تابعونا على إنستجرام", igFollow: "متابعة", video: "فيديو", post: "منشور", viewIg: "عرض على إنستجرام" }
    : { revKicker: "Patient reviews", revTitle: "What they said about us", igKicker: "Instagram", igTitle: "Follow us on Instagram", igFollow: "Follow", video: "Video", post: "Post", viewIg: "View on Instagram" };

  return (
    <div style={{ fontFamily: SANS, direction: dir, color: "#0C3446", background: "#ffffff", minHeight: "100vh" }}>
      <Navbar active="home" cta="book" />

      {/* ============ HERO SLIDER ============ */}
      <section data-screen-label="Hero slider" style={{ position: "relative", overflow: "hidden", background: "#04202E", minHeight: "94vh", display: "flex", flexDirection: "column" }}>
        <div key={slide} style={{ position: "absolute", inset: 0, animation: visualAnim }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={"/" + c.heroImages[slide]} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "78% center", transform: isAr ? "scaleX(-1)" : "none" }} />
        </div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(4,32,46,0) 82%, rgba(4,32,46,0.55) 100%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "14%", insetInlineStart: "5%", width: 200, height: 200, border: "1px solid rgba(48,182,222,0.22)", borderRadius: "50%", animation: "damFloatSlow 11s ease-in-out infinite", pointerEvents: "none" }} />
        <svg viewBox="0 0 1200 120" style={{ position: "absolute", bottom: "16%", left: 0, width: "100%", opacity: 0.35, pointerEvents: "none" }} preserveAspectRatio="none">
          <path d="M0 60 H300 l18 0 12 -34 16 62 14 -46 10 18 h60 l14 -40 16 74 14 -34 h718" stroke="#30B6DE" strokeWidth="2.5" fill="none" strokeDasharray="1200" style={{ animation: "damEcg 5s ease-out infinite" }} />
        </svg>
        <div style={{ position: "absolute", top: 40, insetInlineEnd: "2%", fontFamily: SERIF, fontWeight: 700, fontSize: "clamp(140px, 18vw, 280px)", lineHeight: 1, color: "rgba(143,224,247,0.07)", pointerEvents: "none", userSelect: "none" }}>{"0" + (slide + 1)}</div>

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
              <HoverBox as={Link} href="/contact" style={{ background: "linear-gradient(135deg, #30B6DE, #1E92B8)", color: "#ffffff", borderRadius: 999, padding: "17px 38px", fontWeight: 800, fontSize: 16, boxShadow: "0 12px 30px rgba(48,182,222,0.45)" }} hoverStyle={{ boxShadow: "0 16px 38px rgba(48,182,222,0.6)", color: "#ffffff" }}>{t.heroCta1}</HoverBox>
              <HoverBox as={Link} href="/services" style={{ border: "1.5px solid rgba(255,255,255,0.4)", color: "#ffffff", borderRadius: 999, padding: "17px 38px", fontWeight: 700, fontSize: 16, backdropFilter: "blur(4px)" }} hoverStyle={{ borderColor: "#30B6DE", color: "#8FE0F7" }}>{t.heroCta2}</HoverBox>
            </div>
          </div>
        </div>

        <div style={{ position: "relative", borderTop: "1px solid rgba(255,255,255,0.14)", background: "rgba(4,32,46,0.55)", backdropFilter: "blur(12px)" }}>
          <div style={{ maxWidth: 1240, margin: "0 auto", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 28, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <HoverBox as="button" onClick={() => goSlide(slide - 1)} style={{ width: 50, height: 50, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.05)", color: "#ffffff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }} hoverStyle={{ borderColor: "#30B6DE", color: "#8FE0F7", background: "rgba(48,182,222,0.12)" }}>{arrowPrev}</HoverBox>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {c.slides.map((_, i) => (
                  <button key={i} onClick={() => goSlide(i)} aria-label={"Slide " + (i + 1)} style={{ height: 5, border: "none", borderRadius: 3, cursor: "pointer", padding: 0, transition: "all 0.4s ease", width: i === slide ? 44 : 18, background: i === slide ? "#30B6DE" : "rgba(255,255,255,0.25)" }} />
                ))}
              </div>
              <HoverBox as="button" onClick={() => goSlide(slide + 1)} style={{ width: 50, height: 50, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.05)", color: "#ffffff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }} hoverStyle={{ borderColor: "#30B6DE", color: "#8FE0F7", background: "rgba(48,182,222,0.12)" }}>{arrowNext}</HoverBox>
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

      {/* ============ SERVICES (slider) ============ */}
      <section data-screen-label="Services" style={{ padding: "90px 24px", background: "linear-gradient(180deg, #F4FBFD 0%, #ffffff 100%)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <SectionHead kicker={t.svcKicker} title={t.svcTitle} href="/services" cta={t.viewAll} arrow={arrow} />
          <Slider>
            {services.map((svc) => (
              <HoverBox key={svc.slug} as={Link} href={`/services/${svc.slug}`} style={{ flex: "0 0 300px", scrollSnapAlign: "start", position: "relative", height: 440, borderRadius: 26, overflow: "hidden", border: "1px solid rgba(12,52,70,0.08)", boxShadow: "0 10px 30px rgba(12,52,70,0.08)", background: "linear-gradient(160deg, #0A3950, #0E5372)", transition: "all 0.35s ease", color: "#ffffff", display: "block" }} hoverStyle={{ transform: "translateY(-8px)", boxShadow: "0 28px 60px rgba(48,182,222,0.28)", color: "#ffffff" }}>
                <ImageSlot src={svc.imageUrl} placeholder={t.photoPh} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(4,32,46,0.25) 0%, rgba(4,32,46,0) 38%, rgba(4,32,46,0.55) 62%, rgba(4,32,46,0.94) 100%)", pointerEvents: "none" }} />
                <span style={{ position: "absolute", top: 18, insetInlineStart: 18, background: "rgba(48,182,222,0.92)", color: "#ffffff", borderRadius: 999, padding: "6px 16px", fontSize: 12, fontWeight: 800, pointerEvents: "none" }}>{pick(svc.tag, lang)}</span>
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "28px 26px", pointerEvents: "none" }}>
                  <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 23, lineHeight: 1.45, color: "#ffffff", display: "block" }}>{pick(svc.title, lang)}</span>
                </div>
              </HoverBox>
            ))}
          </Slider>
        </div>
      </section>

      {/* ============ VISION & MISSION ============ */}
      <section data-screen-label="Vision and mission" style={{ padding: "100px 24px", background: "linear-gradient(140deg, #04202E 0%, #0A3950 60%, #0C4661 100%)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -140, insetInlineEnd: -100, width: 440, height: 440, borderRadius: "50%", background: "radial-gradient(circle, rgba(48,182,222,0.22), transparent 65%)" }} />
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
            <HoverBox as={Link} href="/about" style={{ display: "inline-flex", marginTop: 30, background: "#0C3446", color: "#ffffff", borderRadius: 999, padding: "14px 30px", fontWeight: 700, fontSize: 15 }} hoverStyle={{ background: "#1E92B8", color: "#ffffff" }}>{t.whyCta}</HoverBox>
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

      {/* ============ CELEBRITIES (slider) ============ */}
      <section data-screen-label="Celebrity cases" style={{ padding: "90px 24px", background: "linear-gradient(180deg, #F4FBFD 0%, #ffffff 100%)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <SectionHead kicker={t.celebKicker} title={t.celebTitle} href="/cases#celebs" cta={t.viewAll} arrow={arrow} />
          <Slider>
            {celebrities.map((cel) => (
              <HoverBox key={cel.id} as={Link} href="/cases#celebs" style={{ flex: "0 0 240px", scrollSnapAlign: "start", background: "#ffffff", border: "1px solid rgba(12,52,70,0.08)", borderRadius: 22, padding: 26, textAlign: "center", color: "#0C3446", boxShadow: "0 4px 14px rgba(12,52,70,0.05)" }} hoverStyle={{ transform: "translateY(-6px)", boxShadow: "0 20px 44px rgba(48,182,222,0.18)", color: "#0C3446" }}>
                <span style={{ display: "block", width: 110, height: 110, margin: "0 auto", borderRadius: "50%", padding: 4, background: "linear-gradient(135deg, #30B6DE, #8FE0F7)" }}>
                  <ImageSlot src={cel.imageUrl} shape="circle" placeholder={t.photoPh} style={{ width: 102, height: 102 }} />
                </span>
                <span style={{ display: "block", fontFamily: SERIF, fontWeight: 700, fontSize: 18, marginTop: 18 }}>{pick(cel.name, lang)}</span>
                <span style={{ display: "block", fontSize: 13, color: "#5B7A88", marginTop: 6, lineHeight: 1.7 }}>{pick(cel.caption, lang)}</span>
              </HoverBox>
            ))}
          </Slider>
        </div>
      </section>

      {/* ============ REVIEWS (slider) ============ */}
      {reviews.length > 0 && (
        <section data-screen-label="Reviews" style={{ padding: "90px 24px" }}>
          <div style={{ maxWidth: 1240, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <div style={{ color: "#30B6DE", fontWeight: 800, fontSize: 14, letterSpacing: "2px", textTransform: "uppercase" }}>{L.revKicker}</div>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px, 3.4vw, 44px)", fontWeight: 700, margin: "12px 0 0", color: "#0C3446" }}>{L.revTitle}</h2>
            </div>
            <Slider>
              {reviews.map((r) => (
                <div key={r.id} style={{ flex: "0 0 360px", scrollSnapAlign: "start", background: "#ffffff", border: "1px solid rgba(12,52,70,0.08)", borderRadius: 22, padding: "32px 30px", boxShadow: "0 4px 14px rgba(12,52,70,0.05)", display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ color: "#F5B301", fontSize: 18, letterSpacing: 2 }}>{"★".repeat(r.rating || 5)}<span style={{ color: "#E3ECF0" }}>{"★".repeat(5 - (r.rating || 5))}</span></div>
                  <p style={{ fontSize: 15, lineHeight: 2, color: "#46687A", margin: 0, flex: 1 }}>{pick(r.text, lang)}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(135deg, #30B6DE, #0E5372)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontFamily: SERIF }}>{(r.name || "?").charAt(0)}</span>
                    <span style={{ fontWeight: 800, fontSize: 14.5, color: "#0C3446" }}>{r.name}</span>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </section>
      )}

      {/* ============ INSTAGRAM (slider) ============ */}
      {instagram.length > 0 && (
        <section data-screen-label="Instagram" style={{ padding: "90px 24px", background: "linear-gradient(180deg, #ffffff 0%, #F4FBFD 100%)" }}>
          <div style={{ maxWidth: 1240, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, flexWrap: "wrap", marginBottom: 30 }}>
              <div>
                <div style={{ color: "#30B6DE", fontWeight: 800, fontSize: 14, letterSpacing: "2px", textTransform: "uppercase" }}>{L.igKicker}</div>
                <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px, 3.4vw, 44px)", fontWeight: 700, margin: "12px 0 0", color: "#0C3446" }}>{L.igTitle}</h2>
              </div>
              <HoverBox as="a" href={CONTACT_INFO.instagram} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg, #E1306C, #C13584)", color: "#fff", borderRadius: 999, padding: "11px 22px", fontWeight: 800, fontSize: 14 }} hoverStyle={{ opacity: 0.9, color: "#fff" }}>
                <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="4" /><circle cx="8" cy="8" r="3.2" /><circle cx="12.2" cy="3.8" r="0.9" fill="currentColor" stroke="none" /></svg>
                {L.igFollow}
              </HoverBox>
            </div>
            <Slider gap={16}>
              {instagram.map((p) => (
                <a key={p.id} href={p.permalink || CONTACT_INFO.instagram} target="_blank" rel="noopener noreferrer" className="ig-card" style={{ flex: "0 0 260px", scrollSnapAlign: "start", position: "relative", height: 260, borderRadius: 18, overflow: "hidden", border: "1px solid rgba(12,52,70,0.08)", display: "block", background: "#0A3950" }}>
                  <ImageSlot src={p.imageUrl} placeholder={t.photoPh} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
                  {/* type badge (post / video) */}
                  <span style={{ position: "absolute", top: 12, insetInlineEnd: 12, background: "rgba(4,32,46,0.7)", color: "#fff", borderRadius: 8, padding: "4px 10px", fontSize: 11, fontWeight: 800, zIndex: 2 }}>{p.isVideo ? `▶ ${L.video}` : L.post}</span>
                  {/* hover overlay → View on Instagram */}
                  <span className="ig-overlay" style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(225,48,108,0.9), rgba(131,58,180,0.9))", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, color: "#fff", textAlign: "center", padding: 18 }}>
                    <svg width="34" height="34" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3"><rect x="1.5" y="1.5" width="13" height="13" rx="4" /><circle cx="8" cy="8" r="3.2" /><circle cx="12.2" cy="3.8" r="0.9" fill="currentColor" stroke="none" /></svg>
                    <span style={{ fontWeight: 800, fontSize: 14 }}>{L.viewIg}</span>
                    {pick(p.caption, lang) && <span style={{ fontSize: 12, lineHeight: 1.5, opacity: 0.92 }}>{pick(p.caption, lang).slice(0, 70)}</span>}
                  </span>
                </a>
              ))}
            </Slider>
          </div>
        </section>
      )}

      {/* ============ BOOKING CTA ============ */}
      <section data-screen-label="Booking CTA" style={{ padding: "40px 24px 100px" }}>
        <div className="dam-2col" style={{ maxWidth: 1240, margin: "0 auto", background: "linear-gradient(135deg, #0A3950 0%, #1E92B8 70%, #30B6DE 100%)", borderRadius: 30, padding: "clamp(28px, 5vw, 64px) clamp(22px, 4.5vw, 56px)", position: "relative", overflow: "hidden", display: "grid", gridTemplateColumns: "1.3fr 0.7fr", gap: 40, alignItems: "center" }}>
          <div style={{ position: "absolute", top: -80, insetInlineEnd: -60, width: 300, height: 300, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.2)" }} />
          <div style={{ position: "relative" }}>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px, 3vw, 40px)", fontWeight: 700, color: "#ffffff", margin: 0, lineHeight: 1.35 }}>{t.ctaTitle}</h2>
            <p style={{ fontSize: 16, lineHeight: 1.95, color: "rgba(255,255,255,0.85)", margin: "16px 0 0", maxWidth: 560 }}>{t.ctaBody}</p>
          </div>
          <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 14 }}>
            <HoverBox as={Link} href="/contact" style={{ background: "#ffffff", color: "#0A3950", borderRadius: 999, padding: "16px 32px", fontWeight: 800, fontSize: 16, textAlign: "center", boxShadow: "0 12px 30px rgba(4,32,46,0.3)" }} hoverStyle={{ transform: "translateY(-2px)", color: "#0A3950" }}>{tc.book}</HoverBox>
            <HoverBox as="a" href={`tel:${CONTACT_INFO.phone1}`} style={{ border: "1.5px solid rgba(255,255,255,0.5)", color: "#ffffff", borderRadius: 999, padding: "15px 32px", fontWeight: 700, fontSize: 16, textAlign: "center", direction: "ltr" }} hoverStyle={{ borderColor: "#ffffff", background: "rgba(255,255,255,0.1)", color: "#ffffff" }}>{CONTACT_INFO.phone1}</HoverBox>
          </div>
        </div>
      </section>

      {/* ============ BLOG POSTS (slider) ============ */}
      {posts.length > 0 && (
        <section data-screen-label="News" style={{ padding: "0 24px 100px" }}>
          <div style={{ maxWidth: 1240, margin: "0 auto" }}>
            <SectionHead kicker={t.newsKicker} title={t.newsTitle} href="/blogs" cta={t.viewAll} arrow={arrow} />
            <Slider>
              {posts.map((n) => (
                <HoverBox key={n.slug} as={Link} href={`/blogs/${n.slug}`} style={{ flex: "0 0 340px", scrollSnapAlign: "start", background: "#ffffff", border: "1px solid rgba(12,52,70,0.08)", borderRadius: 22, overflow: "hidden", color: "#0C3446", boxShadow: "0 4px 14px rgba(12,52,70,0.04)", display: "flex", flexDirection: "column" }} hoverStyle={{ transform: "translateY(-6px)", boxShadow: "0 20px 44px rgba(48,182,222,0.16)", color: "#0C3446" }}>
                  <span style={{ display: "block", height: 190 }}>
                    <ImageSlot src={n.imageUrl} placeholder={t.photoPh} style={{ width: "100%", height: 190 }} />
                  </span>
                  <span style={{ display: "flex", flexDirection: "column", gap: 10, padding: 24 }}>
                    <span style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <span style={{ background: "rgba(48,182,222,0.12)", border: "1px solid rgba(48,182,222,0.35)", color: "#1E92B8", borderRadius: 999, padding: "3px 12px", fontSize: 11.5, fontWeight: 800 }}>{n.categoryName ? pick(n.categoryName, lang) : pick(n.tag, lang)}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#8AA5B1" }}>{n.date}</span>
                    </span>
                    <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 19, lineHeight: 1.5 }}>{pick(n.title, lang)}</span>
                  </span>
                </HoverBox>
              ))}
            </Slider>
          </div>
        </section>
      )}

      <Footer />
      <WhatsappFloat />
    </div>
  );
}

function SectionHead({ kicker, title, href, cta, arrow }: { kicker: string; title: string; href: string; cta: string; arrow: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, flexWrap: "wrap", marginBottom: 40 }}>
      <div>
        <div style={{ color: "#30B6DE", fontWeight: 800, fontSize: 14, letterSpacing: "2px", textTransform: "uppercase" }}>{kicker}</div>
        <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px, 3.4vw, 44px)", fontWeight: 700, margin: "12px 0 0", color: "#0C3446" }}>{title}</h2>
      </div>
      <HoverBox as={Link} href={href} style={{ fontWeight: 700, fontSize: 15, display: "flex", alignItems: "center", gap: 8 }}>{cta} <span style={{ fontSize: 18 }}>{arrow}</span></HoverBox>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsappFloat from "@/components/WhatsappFloat";
import PageHero from "@/components/PageHero";
import HoverBox from "@/components/HoverBox";
import ImageSlot from "@/components/ImageSlot";
import { useLang } from "@/lib/lang";
import { mediaContent, GALLERY_SLOTS } from "@/lib/content/media";
import { common, CONTACT_INFO } from "@/lib/content/common";
import { SERIF, SANS } from "@/lib/theme";

export default function MediaPage() {
  const { lang, dir } = useLang();
  const { t, videos } = mediaContent(lang);
  const tc = common(lang);
  const [tab, setTab] = useState<"gallery" | "videos">("gallery");

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#videos") setTab("videos");
    const onHash = () => {
      if (window.location.hash === "#videos") setTab("videos");
      if (window.location.hash === "#gallery") setTab("gallery");
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const tabBtn = (key: "gallery" | "videos", label: string) => {
    const activeTab = tab === key;
    return (
      <button
        onClick={() => setTab(key)}
        style={{
          borderRadius: 999,
          padding: "12px 28px",
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 15,
          cursor: "pointer",
          border: "1.5px solid " + (activeTab ? "#30B6DE" : "rgba(255,255,255,0.35)"),
          background: activeTab ? "#30B6DE" : "transparent",
          color: activeTab ? "#ffffff" : "#8FE0F7",
        }}
      >
        {label}
      </button>
    );
  };

  return (
    <div style={{ fontFamily: SANS, direction: dir, color: "#0C3446", background: "#ffffff", minHeight: "100vh" }}>
      <Navbar active="media" cta="book" />
      <PageHero crumbLabel={tc.navMedia} title={t.pageTitle} sub={t.pageSub} spin={false} padding="90px 24px 70px">
        <div style={{ display: "flex", gap: 12, marginTop: 34, flexWrap: "wrap" }}>
          {tabBtn("gallery", t.tabGallery)}
          {tabBtn("videos", t.tabVideos)}
        </div>
      </PageHero>

      {tab === "gallery" && (
        <section data-screen-label="Gallery" style={{ padding: "80px 24px" }}>
          <div className="dam-mosaic" style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gridAutoRows: "220px", gap: 18 }}>
            {GALLERY_SLOTS.map((g) => (
              <div key={g.id} style={{ gridColumn: g.gc, gridRow: g.gr }}>
                <ImageSlot placeholder={t.photoPh} style={{ width: "100%", height: "100%", borderRadius: 20 }} />
              </div>
            ))}
          </div>
        </section>
      )}

      {tab === "videos" && (
        <section data-screen-label="Videos" style={{ padding: "80px 24px" }}>
          <div className="dam-mosaic" style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gridAutoRows: "220px", gap: 18 }}>
            {videos.map((v) => (
              <HoverBox key={v.slotId} style={{ position: "relative", borderRadius: 20, overflow: "hidden", border: "1px solid rgba(12,52,70,0.1)", boxShadow: "0 8px 24px rgba(12,52,70,0.08)", gridColumn: v.gc, gridRow: v.gr, background: "linear-gradient(160deg, #0A3950, #0E5372)" }} hoverStyle={{ boxShadow: "0 20px 46px rgba(48,182,222,0.28)" }}>
                <ImageSlot placeholder={t.photoPh} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
                <span style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(4,32,46,0.1) 0%, rgba(4,32,46,0) 40%, rgba(4,32,46,0.85) 100%)", pointerEvents: "none" }} />
                <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                  <span style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(48,182,222,0.92)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 26px rgba(4,32,46,0.45)" }}>
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="#ffffff"><path d="M7 4.5v13l11-6.5-11-6.5z" /></svg>
                  </span>
                </span>
                <HoverBox as="a" href={CONTACT_INFO.youtube} target="_blank" rel="noopener noreferrer" style={{ position: "absolute", top: 14, insetInlineEnd: 14, background: "rgba(4,32,46,0.7)", backdropFilter: "blur(6px)", border: "1px solid rgba(48,182,222,0.4)", color: "#8FE0F7", borderRadius: 999, padding: "6px 14px", fontSize: 12, fontWeight: 800 }} hoverStyle={{ background: "rgba(48,182,222,0.9)", color: "#ffffff" }}>
                  {t.watchOnYt}
                </HoverBox>
                <span style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "18px 20px", pointerEvents: "none" }}>
                  <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 17, lineHeight: 1.5, color: "#ffffff" }}>{v.title}</span>
                </span>
              </HoverBox>
            ))}
          </div>
        </section>
      )}

      <Footer variant="simple" />
      <WhatsappFloat />
    </div>
  );
}

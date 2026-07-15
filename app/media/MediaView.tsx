"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsappFloat from "@/components/WhatsappFloat";
import PageHero from "@/components/PageHero";
import HoverBox from "@/components/HoverBox";
import ImageSlot from "@/components/ImageSlot";
import Lightbox, { type LightboxItem } from "@/components/Lightbox";
import { useLang } from "@/lib/lang";
import { mediaContent } from "@/lib/content/media";
import { common, CONTACT_INFO } from "@/lib/content/common";
import { pick, type MediaItem } from "@/lib/data/types";
import { SERIF, SANS } from "@/lib/theme";

export default function MediaView({ media }: { media: MediaItem[] }) {
  const { lang, dir } = useLang();
  const { t } = mediaContent(lang);
  const tc = common(lang);
  const [tab, setTab] = useState<"gallery" | "videos">("gallery");
  const [lb, setLb] = useState<{ items: LightboxItem[]; index: number } | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#videos") setTab("videos");
    const onHash = () => {
      if (window.location.hash === "#videos") setTab("videos");
      if (window.location.hash === "#gallery") setTab("gallery");
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const gallery = media.filter((m) => m.type === "gallery");
  const videos = media.filter((m) => m.type === "video");
  const galleryItems: LightboxItem[] = gallery.map((m) => ({ src: m.imageUrl, title: pick(m.title, lang) || undefined }));
  const videoItems: LightboxItem[] = videos.map((m) => ({ videoUrl: m.videoUrl, title: pick(m.title, lang) }));

  const tabBtn = (key: "gallery" | "videos", label: string) => {
    const activeTab = tab === key;
    return (
      <button onClick={() => setTab(key)} style={{ borderRadius: 999, padding: "12px 28px", fontFamily: SANS, fontWeight: 800, fontSize: 15, cursor: "pointer", border: "1.5px solid " + (activeTab ? "#30B6DE" : "rgba(255,255,255,0.35)"), background: activeTab ? "#30B6DE" : "transparent", color: activeTab ? "#ffffff" : "#8FE0F7" }}>
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
            {gallery.map((g, i) => (
              <HoverBox key={g.id} as="button" onClick={() => setLb({ items: galleryItems, index: i })} style={{ gridColumn: g.gc, gridRow: g.gr, padding: 0, border: "none", background: "none", cursor: "pointer", borderRadius: 20, overflow: "hidden" }} hoverStyle={{ transform: "translateY(-4px)" }}>
                <ImageSlot src={g.imageUrl} placeholder={t.photoPh} style={{ width: "100%", height: "100%", borderRadius: 20 }} />
              </HoverBox>
            ))}
          </div>
        </section>
      )}

      {tab === "videos" && (
        <section data-screen-label="Videos" style={{ padding: "80px 24px" }}>
          <div className="dam-mosaic" style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gridAutoRows: "220px", gap: 18 }}>
            {videos.map((v, i) => (
              <HoverBox key={v.id} as="button" onClick={() => setLb({ items: videoItems, index: i })} style={{ position: "relative", borderRadius: 20, overflow: "hidden", border: "1px solid rgba(12,52,70,0.1)", boxShadow: "0 8px 24px rgba(12,52,70,0.08)", gridColumn: v.gc, gridRow: v.gr, background: "linear-gradient(160deg, #0A3950, #0E5372)", padding: 0, cursor: "pointer" }} hoverStyle={{ boxShadow: "0 20px 46px rgba(48,182,222,0.28)" }}>
                <ImageSlot src={v.imageUrl} placeholder={t.photoPh} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
                <span style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(4,32,46,0.1) 0%, rgba(4,32,46,0) 40%, rgba(4,32,46,0.85) 100%)", pointerEvents: "none" }} />
                <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                  <span style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(48,182,222,0.92)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 26px rgba(4,32,46,0.45)" }}>
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="#ffffff"><path d="M7 4.5v13l11-6.5-11-6.5z" /></svg>
                  </span>
                </span>
                <span style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "18px 20px", pointerEvents: "none", textAlign: "start" }}>
                  <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 17, lineHeight: 1.5, color: "#ffffff" }}>{pick(v.title, lang)}</span>
                </span>
              </HoverBox>
            ))}
          </div>
        </section>
      )}

      {lb && (
        <Lightbox items={lb.items} index={lb.index} onClose={() => setLb(null)} onIndex={(i) => setLb({ ...lb, index: i })} ytFallback={CONTACT_INFO.youtube} watchLabel={t.watchOnYt} />
      )}

      <Footer variant="simple" />
      <WhatsappFloat />
    </div>
  );
}

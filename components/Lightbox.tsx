"use client";

import { useEffect, useCallback } from "react";

export type LightboxItem = {
  src?: string;
  videoUrl?: string;
  title?: string;
};

/** Full-screen lightbox for gallery images and videos, with keyboard nav. */
export default function Lightbox({
  items,
  index,
  onClose,
  onIndex,
  ytFallback,
  watchLabel,
}: {
  items: LightboxItem[];
  index: number;
  onClose: () => void;
  onIndex: (i: number) => void;
  ytFallback?: string;
  watchLabel?: string;
}) {
  const prev = useCallback(() => onIndex((index - 1 + items.length) % items.length), [index, items.length, onIndex]);
  const next = useCallback(() => onIndex((index + 1) % items.length), [index, items.length, onIndex]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, prev, next]);

  const item = items[index];
  if (!item) return null;

  const toEmbed = (url: string) => {
    // Convert a YouTube watch/short URL to an embeddable one
    const m = url.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/);
    return m ? `https://www.youtube.com/embed/${m[1]}` : url;
  };

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(4,32,46,0.92)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
    >
      {/* Close */}
      <button onClick={onClose} aria-label="Close" style={{ position: "absolute", top: 20, insetInlineEnd: 20, width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.3)", color: "#ffffff", fontSize: 22, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
        ✕
      </button>

      {/* Prev / Next */}
      {items.length > 1 && (
        <>
          <button onClick={(e) => { e.stopPropagation(); prev(); }} aria-label="Previous" style={{ position: "absolute", insetInlineStart: 20, top: "50%", transform: "translateY(-50%)", width: 52, height: 52, borderRadius: "50%", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.3)", color: "#ffffff", fontSize: 22, cursor: "pointer" }}>‹</button>
          <button onClick={(e) => { e.stopPropagation(); next(); }} aria-label="Next" style={{ position: "absolute", insetInlineEnd: 20, top: "50%", transform: "translateY(-50%)", width: 52, height: 52, borderRadius: "50%", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.3)", color: "#ffffff", fontSize: 22, cursor: "pointer" }}>›</button>
        </>
      )}

      {/* Content */}
      <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: 1000, width: "100%", maxHeight: "85vh", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        {item.videoUrl ? (
          <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", borderRadius: 16, overflow: "hidden", background: "#000" }}>
            <iframe src={toEmbed(item.videoUrl)} title={item.title || "video"} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }} />
          </div>
        ) : item.src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.src} alt={item.title || ""} style={{ maxWidth: "100%", maxHeight: "78vh", objectFit: "contain", borderRadius: 12 }} />
        ) : (
          <div style={{ width: "100%", maxWidth: 720, aspectRatio: "16/10", borderRadius: 16, background: "linear-gradient(160deg, #0A3950, #0E5372)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, color: "rgba(255,255,255,0.8)" }}>
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><rect x="3" y="4" width="18" height="16" rx="3" /><circle cx="8.5" cy="9.5" r="1.8" /><path d="M21 16l-5-5-9 9" /></svg>
            {item.title && <span style={{ fontSize: 16, fontWeight: 700 }}>{item.title}</span>}
            {ytFallback && (
              <a href={ytFallback} target="_blank" rel="noopener noreferrer" style={{ marginTop: 6, background: "#30B6DE", color: "#ffffff", borderRadius: 999, padding: "9px 20px", fontSize: 13.5, fontWeight: 800 }}>
                {watchLabel || "Watch on YouTube"}
              </a>
            )}
          </div>
        )}
        {item.title && (item.src || item.videoUrl) && (
          <div style={{ color: "#ffffff", fontSize: 16, fontWeight: 700, textAlign: "center" }}>{item.title}</div>
        )}
      </div>
    </div>
  );
}

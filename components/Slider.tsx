"use client";

import React, { useRef } from "react";
import { useLang } from "@/lib/lang";

/**
 * Horizontal slider with prev/next arrows.
 * Shows exactly 4 cards on desktop and slides ONE card at a time.
 * Card sizing is handled by the .dam-slide CSS (responsive: 4 / 3 / 2 / 1).
 *
 * `bleed` makes the track run edge-to-edge (cancels the section's 24px side
 * padding) with the arrows overlaid, so the cards reach the screen edges.
 */
export default function Slider({ children, gap = 22, bleed = false }: { children: React.ReactNode; gap?: number; bleed?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { isAr } = useLang();

  const scrollByCard = (dir: -1 | 1) => {
    const el = ref.current;
    if (!el) return;
    const slide = el.querySelector<HTMLElement>(".dam-slide");
    const step = slide ? slide.getBoundingClientRect().width + gap : el.clientWidth * 0.8;
    el.scrollBy({ left: (isAr ? -1 : 1) * step * dir, behavior: "smooth" });
  };

  const arrowStyle: React.CSSProperties = {
    width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
    border: "1.5px solid rgba(48,182,222,0.5)", background: "#ffffff", color: "#1E92B8",
    cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 4px 12px rgba(48,182,222,0.2)",
  };

  const arrowBtn = (dir: -1 | 1, glyph: string, side?: "start" | "end") => (
    <button
      onClick={() => scrollByCard(dir)}
      aria-label={dir === -1 ? "Previous" : "Next"}
      className={bleed ? "dam-bleed-arrow" : undefined}
      style={bleed
        ? { ...arrowStyle, position: "absolute", top: "50%", transform: "translateY(-50%)", zIndex: 6, background: "rgba(255,255,255,0.95)", backdropFilter: "blur(4px)", ...(side === "start" ? { insetInlineStart: 10 } : { insetInlineEnd: 10 }) }
        : arrowStyle}
    >
      {glyph}
    </button>
  );

  const track = (
    <div
      ref={ref}
      className="dam-slider dam-scroll-row"
      style={{ ["--slider-gap" as string]: gap + "px", display: "flex", gap, overflowX: "auto", scrollSnapType: "x mandatory", flex: 1, padding: bleed ? "8px 8px" : "8px 2px", minWidth: 0 }}
    >
      {React.Children.map(children, (child, i) => (
        <div className="dam-slide" key={i}>{child}</div>
      ))}
    </div>
  );

  if (bleed) {
    // Full-bleed: cancel the section's 24px side padding; arrows overlaid.
    return (
      <div style={{ position: "relative", marginInlineStart: -24, marginInlineEnd: -24 }}>
        {arrowBtn(-1, isAr ? "→" : "←", "start")}
        {track}
        {arrowBtn(1, isAr ? "←" : "→", "end")}
      </div>
    );
  }

  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 8 }}>
      {arrowBtn(-1, isAr ? "→" : "←")}
      {track}
      {arrowBtn(1, isAr ? "←" : "→")}
    </div>
  );
}

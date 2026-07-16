"use client";

import React, { useRef } from "react";
import { useLang } from "@/lib/lang";

/**
 * Horizontal slider with prev/next arrows.
 * Shows exactly 3 cards on desktop (no peek) and slides ONE card at a time.
 * Card sizing is handled by the .dam-slide CSS (responsive: 3 / 2 / 1).
 */
export default function Slider({ children, gap = 22 }: { children: React.ReactNode; gap?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { isAr } = useLang();

  const scrollByCard = (dir: -1 | 1) => {
    const el = ref.current;
    if (!el) return;
    const slide = el.querySelector<HTMLElement>(".dam-slide");
    const step = slide ? slide.getBoundingClientRect().width + gap : el.clientWidth * 0.8;
    el.scrollBy({ left: (isAr ? -1 : 1) * step * dir, behavior: "smooth" });
  };

  const arrowBtn = (dir: -1 | 1, glyph: string) => (
    <button
      onClick={() => scrollByCard(dir)}
      aria-label={dir === -1 ? "Previous" : "Next"}
      className="dam-slide-arrow"
      style={{
        width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
        border: "1.5px solid rgba(48,182,222,0.5)", background: "#ffffff", color: "#1E92B8",
        cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 4px 12px rgba(48,182,222,0.2)",
      }}
    >
      {glyph}
    </button>
  );

  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 8 }}>
      {arrowBtn(-1, isAr ? "→" : "←")}
      <div
        ref={ref}
        className="dam-slider dam-scroll-row"
        style={{ ["--slider-gap" as string]: gap + "px", display: "flex", gap, overflowX: "auto", scrollSnapType: "x mandatory", flex: 1, padding: "8px 2px", minWidth: 0 }}
      >
        {React.Children.map(children, (child, i) => (
          <div className="dam-slide" key={i}>{child}</div>
        ))}
      </div>
      {arrowBtn(1, isAr ? "←" : "→")}
    </div>
  );
}

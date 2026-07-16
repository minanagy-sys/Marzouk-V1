"use client";

import { useRef } from "react";
import { useLang } from "@/lib/lang";

/** Horizontal slider with prev/next arrows. Children are the cards. */
export default function Slider({ children, gap = 22 }: { children: React.ReactNode; gap?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { isAr } = useLang();

  const scrollBy = (dir: -1 | 1) => {
    const el = ref.current;
    if (!el) return;
    const amount = Math.max(el.clientWidth * 0.8, 280) * dir;
    el.scrollBy({ left: isAr ? -amount : amount, behavior: "smooth" });
  };

  const arrowBtn = (dir: -1 | 1, glyph: string) => (
    <button
      onClick={() => scrollBy(dir)}
      aria-label={dir === -1 ? "Previous" : "Next"}
      style={{
        width: 46, height: 46, borderRadius: "50%", flexShrink: 0,
        border: "1.5px solid rgba(48,182,222,0.5)", background: "#ffffff", color: "#1E92B8",
        cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 6px 16px rgba(48,182,222,0.2)",
      }}
    >
      {glyph}
    </button>
  );

  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 12 }}>
      {arrowBtn(-1, isAr ? "→" : "←")}
      <div
        ref={ref}
        className="dam-scroll-row"
        style={{ display: "flex", gap, overflowX: "auto", scrollSnapType: "x mandatory", flex: 1, padding: "8px 2px", scrollBehavior: "smooth" }}
      >
        {children}
      </div>
      {arrowBtn(1, isAr ? "←" : "→")}
    </div>
  );
}

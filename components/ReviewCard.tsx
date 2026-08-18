"use client";

import { useState } from "react";
import { SERIF } from "@/lib/theme";

// A single review card: stars + text, with a "Read more" toggle when the
// text is long so cards stay uniform until the reader expands one.
const LIMIT = 220; // characters before truncating

export default function ReviewCard({
  text,
  rating,
  moreLabel,
  lessLabel,
}: {
  text: string;
  rating: number;
  moreLabel: string;
  lessLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const isLong = text.length > LIMIT;
  const shown = !isLong || open ? text : text.slice(0, LIMIT).trimEnd() + "…";
  const stars = Math.min(5, Math.max(0, rating || 5));

  return (
    <div style={{ flex: "0 0 360px", scrollSnapAlign: "start", background: "#ffffff", border: "1px solid rgba(12,52,70,0.08)", borderRadius: 22, padding: "32px 30px", boxShadow: "0 4px 14px rgba(12,52,70,0.05)", display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ color: "#F5B301", fontSize: 18, letterSpacing: 2 }}>{"★".repeat(stars)}<span style={{ color: "#E3ECF0" }}>{"★".repeat(5 - stars)}</span></div>
      <p style={{ fontSize: 15, lineHeight: 2, color: "#46687A", margin: 0, flex: 1 }}>{shown}</p>
      {isLong && (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          style={{ alignSelf: "flex-start", background: "none", border: "none", padding: 0, cursor: "pointer", color: "#1E92B8", fontWeight: 800, fontSize: 14, fontFamily: SERIF }}
        >
          {open ? lessLabel : moreLabel}
        </button>
      )}
    </div>
  );
}

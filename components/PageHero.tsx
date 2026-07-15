"use client";

import Link from "next/link";
import { useLang } from "@/lib/lang";
import { common } from "@/lib/content/common";
import { SERIF } from "@/lib/theme";

/** Dark gradient page hero used by all inner pages (breadcrumb + title + sub). */
export default function PageHero({
  crumbLabel,
  title,
  sub,
  spin = true,
  padding = "90px 24px",
  children,
}: {
  crumbLabel: string;
  title: string;
  sub: string;
  spin?: boolean;
  padding?: string;
  children?: React.ReactNode;
}) {
  const { lang } = useLang();
  const t = common(lang);

  return (
    <section
      data-screen-label="Page hero"
      style={{
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(140deg, #04202E 0%, #0A3950 55%, #0E5372 100%)",
        padding,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -160,
          insetInlineEnd: -100,
          width: 480,
          height: 480,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(48,182,222,0.3), transparent 65%)",
        }}
      />
      {spin && (
        <div
          style={{
            position: "absolute",
            bottom: -80,
            insetInlineStart: "8%",
            width: 160,
            height: 160,
            border: "1px dashed rgba(48,182,222,0.3)",
            borderRadius: "50%",
            animation: "damSpin 36s linear infinite",
          }}
        />
      )}
      <div style={{ maxWidth: 1240, margin: "0 auto", position: "relative", animation: "damFadeUp 0.8s ease-out both" }}>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", fontWeight: 500 }}>
          <Link href="/" style={{ color: "#8FE0F7" }}>
            {t.navHome}
          </Link>{" "}
          · {crumbLabel}
        </div>
        <h1 style={{ fontFamily: SERIF, fontWeight: 700, fontSize: "clamp(36px, 4vw, 56px)", color: "#ffffff", margin: "16px 0 0" }}>
          {title}
        </h1>
        <p style={{ fontSize: 17, lineHeight: 1.9, color: "rgba(255,255,255,0.72)", margin: "16px 0 0", maxWidth: 640, textWrap: "pretty" }}>
          {sub}
        </p>
        {children}
      </div>
    </section>
  );
}

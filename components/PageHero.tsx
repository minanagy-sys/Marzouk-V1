"use client";

import Link from "next/link";
import { useLang } from "@/lib/lang";
import { useSetting } from "@/lib/settings";
import { common } from "@/lib/content/common";
import { SERIF } from "@/lib/theme";

/** Dark gradient page hero used by all inner pages (breadcrumb + title + sub). */
export default function PageHero({
  crumbLabel,
  title,
  sub,
  spin = true,
  padding = "90px 24px",
  page,
  children,
}: {
  crumbLabel: string;
  title: string;
  sub: string;
  spin?: boolean;
  padding?: string;
  page?: string;
  children?: React.ReactNode;
}) {
  const { lang, lp } = useLang();
  const t = common(lang);
  const st = useSetting();
  const heroImg = page ? st(`${page}.heroImage`, lang, "") : "";

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
      {heroImg && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={heroImg} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transform: lang === "ar" ? "scaleX(-1)" : "none" }} />
          {/* same fade as the gradient hero, over the image */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(140deg, rgba(4,32,46,0.92) 0%, rgba(10,57,80,0.86) 55%, rgba(14,83,114,0.8) 100%)" }} />
        </>
      )}
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
          <Link href={lp("/")} style={{ color: "#8FE0F7" }}>
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

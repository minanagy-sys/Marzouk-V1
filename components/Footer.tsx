"use client";

import Link from "next/link";
import HoverBox from "./HoverBox";
import { useLang } from "@/lib/lang";
import { common, CONTACT_INFO } from "@/lib/content/common";
import { SERIF } from "@/lib/theme";

const footerLink = (href: string, label: string) => (
  <HoverBox
    as={Link}
    href={href}
    style={{ color: "rgba(255,255,255,0.75)" }}
    hoverStyle={{ color: "#30B6DE" }}
  >
    {label}
  </HoverBox>
);

function Logo({ size = 42, font = 18 }: { size?: number; font?: number }) {
  const { lang } = useLang();
  const t = common(lang);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <span
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #30B6DE, #0E5372)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#ffffff",
          fontFamily: SERIF,
          fontWeight: 700,
          fontSize: font,
        }}
      >
        Dr
      </span>
      <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: font + 1, color: "#ffffff" }}>
        {t.brand}
      </span>
    </div>
  );
}

export default function Footer({ variant = "simple" }: { variant?: "full" | "simple" }) {
  const { lang } = useLang();
  const t = common(lang);

  if (variant === "full") {
    return (
      <footer data-screen-label="Footer" style={{ background: "#04202E", color: "rgba(255,255,255,0.75)", padding: "70px 24px 0" }}>
        <div
          className="dam-3col"
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1.4fr 0.8fr 1.2fr",
            gap: 50,
            paddingBottom: 50,
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #30B6DE, #0E5372)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  fontFamily: SERIF,
                  fontWeight: 700,
                  fontSize: 20,
                }}
              >
                Dr
              </span>
              <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 20, color: "#ffffff" }}>{t.brand}</span>
            </div>
            <p style={{ fontSize: 14.5, lineHeight: 2, margin: "20px 0 0", maxWidth: 380 }}>{t.footerAbout}</p>
            <div style={{ display: "flex", gap: 12, marginTop: 22 }}>
              <HoverBox
                as="a"
                href={CONTACT_INFO.facebook}
                target="_blank"
                rel="noopener noreferrer"
                style={{ width: 40, height: 40, borderRadius: "50%", border: "1px solid rgba(48,182,222,0.4)", display: "flex", alignItems: "center", justifyContent: "center", color: "#30B6DE", fontWeight: 800, fontSize: 15 }}
                hoverStyle={{ background: "rgba(48,182,222,0.15)", color: "#8FE0F7" }}
              >
                f
              </HoverBox>
              <HoverBox
                as="a"
                href={CONTACT_INFO.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                style={{ width: 40, height: 40, borderRadius: "50%", border: "1px solid rgba(48,182,222,0.4)", display: "flex", alignItems: "center", justifyContent: "center", color: "#30B6DE" }}
                hoverStyle={{ background: "rgba(48,182,222,0.15)", color: "#8FE0F7" }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M6 4.5v7l6-3.5-6-3.5z" /></svg>
              </HoverBox>
              <HoverBox
                as="a"
                href={CONTACT_INFO.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                style={{ width: 40, height: 40, borderRadius: "50%", border: "1px solid rgba(48,182,222,0.4)", display: "flex", alignItems: "center", justifyContent: "center", color: "#30B6DE" }}
                hoverStyle={{ background: "rgba(48,182,222,0.15)", color: "#8FE0F7" }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="4" /><circle cx="8" cy="8" r="3.2" /><circle cx="12.2" cy="3.8" r="0.9" fill="currentColor" stroke="none" /></svg>
              </HoverBox>
            </div>
          </div>

          <div>
            <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 17, color: "#ffffff", marginBottom: 20 }}>{t.footerLinks}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 14.5 }}>
              {footerLink("/", t.navHome)}
              {footerLink("/about", t.navAbout)}
              {footerLink("/services", t.navServices)}
              {footerLink("/cases", t.navCases)}
              {footerLink("/blogs", t.navBlogs)}
              {footerLink("/contact", t.navContact)}
            </div>
          </div>

          <div>
            <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 17, color: "#ffffff", marginBottom: 20 }}>{t.footerContact}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, fontSize: 14, lineHeight: 1.9 }}>
              <div>{t.clinic1}</div>
              <div>{t.clinic2}</div>
              <div style={{ direction: "ltr", textAlign: "end", color: "#30B6DE", fontWeight: 700, fontSize: 15 }}>
                {CONTACT_INFO.phone1} · {CONTACT_INFO.phone2}
              </div>
              <HoverBox as="a" href={`mailto:${CONTACT_INFO.email}`} style={{ color: "rgba(255,255,255,0.75)" }} hoverStyle={{ color: "#30B6DE" }}>
                {CONTACT_INFO.email}
              </HoverBox>
            </div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", padding: "22px 0", textAlign: "center", fontSize: 13, color: "rgba(255,255,255,0.45)" }}>
          {t.copyright}
        </div>
      </footer>
    );
  }

  // Simple footer used on inner pages
  return (
    <footer data-screen-label="Footer" style={{ background: "#04202E", color: "rgba(255,255,255,0.75)", padding: "60px 24px 0" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 30, flexWrap: "wrap", paddingBottom: 40 }}>
        <Logo />
        <div style={{ display: "flex", gap: 22, fontSize: 14, flexWrap: "wrap" }}>
          {footerLink("/", t.navHome)}
          {footerLink("/services", t.navServices)}
          {footerLink("/cases", t.navCases)}
          {footerLink("/contact", t.navContact)}
        </div>
        <div style={{ direction: "ltr", color: "#30B6DE", fontWeight: 700, fontSize: 15 }}>{CONTACT_INFO.phone1}</div>
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", padding: "20px 0", textAlign: "center", fontSize: 13, color: "rgba(255,255,255,0.45)" }}>
        {t.copyright}
      </div>
    </footer>
  );
}

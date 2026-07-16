"use client";

import Link from "next/link";
import { useState } from "react";
import HoverBox from "./HoverBox";
import { useLang } from "@/lib/lang";
import { common, CONTACT_INFO } from "@/lib/content/common";
import { SERIF, SANS } from "@/lib/theme";

export type NavKey =
  | "home"
  | "about"
  | "services"
  | "cases"
  | "blogs"
  | "media"
  | "contact";

const CHEVRON = (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
    <path d="M1 3l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export default function Navbar({
  active,
  dropdowns = true,
  cta = "book",
}: {
  active: NavKey;
  dropdowns?: boolean;
  cta?: "book" | "phone";
}) {
  const { lang, toggleLang } = useLang();
  const t = common(lang);
  const [casesOpen, setCasesOpen] = useState(false);
  const [mediaOpen, setMediaOpen] = useState(false);

  const linkStyle = (key: NavKey) =>
    active === key
      ? { color: "#30B6DE", fontWeight: 700 as const }
      : { color: "#0C3446" };

  const plainLink = (key: NavKey, href: string, label: string) => (
    <HoverBox as={Link} href={href} style={linkStyle(key)} hoverStyle={active === key ? undefined : { color: "#30B6DE" }}>
      {label}
    </HoverBox>
  );

  const menuItem = (href: string, label: string) => (
    <HoverBox
      as={Link}
      href={href}
      style={{ padding: "10px 14px", borderRadius: 9, color: "#0C3446" }}
      hoverStyle={{ background: "#EAF7FB", color: "#30B6DE" }}
    >
      {label}
    </HoverBox>
  );

  return (
    <header
      data-screen-label="Navigation"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(12,52,70,0.08)",
      }}
    >
      <div
        className="dam-navrow"
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "0 24px",
          height: 78,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12, color: "#0C3446" }}>
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
              boxShadow: "0 6px 16px rgba(48,182,222,0.35)",
            }}
          >
            Dr
          </span>
          <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
            <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 19, color: "#0C3446" }}>{t.brand}</span>
            <span style={{ fontSize: 11.5, color: "#5B7A88", letterSpacing: "0.4px" }}>{t.brandSub}</span>
          </span>
        </Link>

        <nav
          className="dam-navlinks"
          style={{ display: "flex", alignItems: "center", gap: 26, fontSize: 15, fontWeight: 500 }}
        >
          {plainLink("home", "/", t.navHome)}
          {plainLink("about", "/about", t.navAbout)}
          {plainLink("services", "/services", t.navServices)}

          {dropdowns ? (
            <span style={{ position: "relative" }}>
              <HoverBox
                as="button"
                onClick={() => {
                  setCasesOpen((v) => !v);
                  setMediaOpen(false);
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: 15,
                  fontWeight: active === "cases" ? 700 : 500,
                  color: active === "cases" ? "#30B6DE" : "#0C3446",
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: 0,
                }}
                hoverStyle={{ color: "#30B6DE" }}
              >
                {t.navCases} {CHEVRON}
              </HoverBox>
              {casesOpen && (
                <span
                  style={{
                    position: "absolute",
                    top: 34,
                    insetInlineStart: -12,
                    background: "#ffffff",
                    border: "1px solid rgba(12,52,70,0.08)",
                    borderRadius: 14,
                    boxShadow: "0 18px 40px rgba(12,52,70,0.14)",
                    padding: 8,
                    display: "flex",
                    flexDirection: "column",
                    minWidth: 180,
                    zIndex: 10,
                  }}
                >
                  {menuItem("/cases#success", t.navSuccess)}
                  {menuItem("/cases#celebs", t.navCelebs)}
                </span>
              )}
            </span>
          ) : (
            plainLink("cases", "/cases", t.navCases)
          )}

          {plainLink("blogs", "/blogs", t.navBlogs)}

          {dropdowns ? (
            <span style={{ position: "relative" }}>
              <HoverBox
                as="button"
                onClick={() => {
                  setMediaOpen((v) => !v);
                  setCasesOpen(false);
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: 15,
                  fontWeight: active === "media" ? 700 : 500,
                  color: active === "media" ? "#30B6DE" : "#0C3446",
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: 0,
                }}
                hoverStyle={{ color: "#30B6DE" }}
              >
                {t.navMedia} {CHEVRON}
              </HoverBox>
              {mediaOpen && (
                <span
                  style={{
                    position: "absolute",
                    top: 34,
                    insetInlineStart: -12,
                    background: "#ffffff",
                    border: "1px solid rgba(12,52,70,0.08)",
                    borderRadius: 14,
                    boxShadow: "0 18px 40px rgba(12,52,70,0.14)",
                    padding: 8,
                    display: "flex",
                    flexDirection: "column",
                    minWidth: 180,
                    zIndex: 10,
                  }}
                >
                  {menuItem("/media#gallery", t.navGallery)}
                  {menuItem("/media#videos", t.navVideos)}
                </span>
              )}
            </span>
          ) : (
            plainLink("media", "/media", t.navMedia)
          )}

          {plainLink("contact", "/contact", t.navContact)}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <HoverBox
            as="button"
            onClick={toggleLang}
            style={{
              background: "#ffffff",
              border: "1.5px solid rgba(48,182,222,0.5)",
              color: "#1E92B8",
              borderRadius: 999,
              padding: "8px 16px",
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 13.5,
              cursor: "pointer",
            }}
            hoverStyle={{ background: "#EAF7FB" }}
          >
            {t.langBtn}
          </HoverBox>

          {cta === "phone" ? (
            <HoverBox
              as="a"
              href={`tel:${CONTACT_INFO.phone1}`}
              style={{
                background: "linear-gradient(135deg, #30B6DE, #1E92B8)",
                color: "#ffffff",
                borderRadius: 999,
                padding: "11px 24px",
                fontWeight: 700,
                fontSize: 14.5,
                boxShadow: "0 8px 20px rgba(48,182,222,0.4)",
                direction: "ltr",
              }}
              hoverStyle={{ color: "#ffffff" }}
            >
              {CONTACT_INFO.phone1}
            </HoverBox>
          ) : (
            <HoverBox
              as={Link}
              href="/contact"
              style={{
                background: "linear-gradient(135deg, #30B6DE, #1E92B8)",
                color: "#ffffff",
                borderRadius: 999,
                padding: "11px 24px",
                fontWeight: 700,
                fontSize: 14.5,
                boxShadow: "0 8px 20px rgba(48,182,222,0.4)",
              }}
              hoverStyle={{ boxShadow: "0 10px 26px rgba(48,182,222,0.55)", color: "#ffffff" }}
            >
              {t.book}
            </HoverBox>
          )}
        </div>
      </div>
    </header>
  );
}

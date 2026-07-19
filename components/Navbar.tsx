"use client";

import Link from "next/link";
import { useState } from "react";
import HoverBox from "./HoverBox";
import { useLang } from "@/lib/lang";
import { useSetting } from "@/lib/settings";
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
  const { lang, toggleLang, lp } = useLang();
  const t = common(lang);
  const st = useSetting();
  const [casesOpen, setCasesOpen] = useState(false);
  const [mediaOpen, setMediaOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const linkStyle = (key: NavKey) =>
    active === key
      ? { color: "#30B6DE", fontWeight: 700 as const }
      : { color: "#0C3446" };

  const plainLink = (key: NavKey, href: string, label: string) => (
    <HoverBox as={Link} href={lp(href)} style={linkStyle(key)} hoverStyle={active === key ? undefined : { color: "#30B6DE" }}>
      {label}
    </HoverBox>
  );

  const menuItem = (href: string, label: string) => (
    <HoverBox
      as={Link}
      href={lp(href)}
      style={{ padding: "10px 14px", borderRadius: 9, color: "#0C3446" }}
      hoverStyle={{ background: "#EAF7FB", color: "#30B6DE" }}
    >
      {label}
    </HoverBox>
  );

  const mobileLink = (href: string, label: string) => (
    <Link href={lp(href)} onClick={() => setMenuOpen(false)} style={{ padding: "13px 6px", borderBottom: "1px solid rgba(12,52,70,0.06)", color: "#0C3446", fontWeight: 700, fontSize: 15.5, textDecoration: "none" }}>{label}</Link>
  );
  const mobileSub = (href: string, label: string) => (
    <Link href={lp(href)} onClick={() => setMenuOpen(false)} style={{ padding: "9px 6px", color: "#5B7A88", fontSize: 14, textDecoration: "none" }}>— {label}</Link>
  );
  // Collapsible parent row: label links to the page, chevron toggles the sub-items.
  const mobileParent = (href: string, label: string, open: boolean, toggle: () => void, subs: React.ReactNode) => (
    <div style={{ borderBottom: "1px solid rgba(12,52,70,0.06)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href={lp(href)} onClick={() => setMenuOpen(false)} style={{ flex: 1, padding: "13px 6px", color: "#0C3446", fontWeight: 700, fontSize: 15.5, textDecoration: "none" }}>{label}</Link>
        <button onClick={toggle} aria-label="Toggle submenu" aria-expanded={open} style={{ background: "none", border: "none", padding: 12, cursor: "pointer", color: "#5B7A88", display: "flex", alignItems: "center", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>{CHEVRON}</button>
      </div>
      {open && <div style={{ display: "flex", flexDirection: "column", paddingInlineStart: 14, paddingBottom: 8 }}>{subs}</div>}
    </div>
  );

  return (
    <>
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
        <Link href={lp("/")} style={{ display: "flex", alignItems: "center", gap: 12, color: "#0C3446" }}>
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
            <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 19, color: "#0C3446" }}>{st("brand", lang, t.brand)}</span>
            <span style={{ fontSize: 11.5, color: "#5B7A88", letterSpacing: "0.4px" }}>{st("brand.sub", lang, t.brandSub)}</span>
          </span>
        </Link>

        <nav
          className="dam-navlinks"
          style={{ display: "flex", alignItems: "center", gap: 26, fontSize: 15, fontWeight: 500 }}
        >
          {plainLink("home", "/", st("nav.home", lang, t.navHome))}
          {plainLink("about", "/about", st("nav.about", lang, t.navAbout))}
          {plainLink("services", "/services", st("nav.services", lang, t.navServices))}

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
                {st("nav.cases", lang, t.navCases)} {CHEVRON}
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
                  {menuItem("/cases#success", st("nav.success", lang, t.navSuccess))}
                  {menuItem("/cases#celebs", st("nav.celebs", lang, t.navCelebs))}
                </span>
              )}
            </span>
          ) : (
            plainLink("cases", "/cases", st("nav.cases", lang, t.navCases))
          )}

          {plainLink("blogs", "/blogs", st("nav.blogs", lang, t.navBlogs))}

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
                {st("nav.media", lang, t.navMedia)} {CHEVRON}
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
                  {menuItem("/media#gallery", st("nav.gallery", lang, t.navGallery))}
                  {menuItem("/media#videos", st("nav.videos", lang, t.navVideos))}
                </span>
              )}
            </span>
          ) : (
            plainLink("media", "/media", st("nav.media", lang, t.navMedia))
          )}

          {plainLink("contact", "/contact", st("nav.contact", lang, t.navContact))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div className="dam-desktop-actions" style={{ display: "flex", alignItems: "center", gap: 12 }}>
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
            {st("nav.lang", lang, t.langBtn)}
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
              href={lp("/contact")}
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
              {st("nav.book", lang, t.book)}
            </HoverBox>
          )}
          </div>

          <button className="dam-hamburger" onClick={() => setMenuOpen(true)} aria-label="Menu" style={{ width: 46, height: 46, borderRadius: 12, border: "1.5px solid rgba(48,182,222,0.4)", background: "#fff", color: "#0C3446", cursor: "pointer", alignItems: "center", justifyContent: "center", fontSize: 20 }}>☰</button>
        </div>
      </div>
    </header>

      {/* Mobile flyout menu */}
      {menuOpen && (
        <div onClick={() => setMenuOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(4,32,46,0.5)", backdropFilter: "blur(2px)" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ position: "absolute", insetInlineEnd: 0, top: 0, height: "100%", width: "min(320px, 85vw)", background: "#fff", boxShadow: "-10px 0 40px rgba(4,32,46,0.3)", padding: "22px 20px", display: "flex", flexDirection: "column", gap: 4, overflowY: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 18, color: "#0C3446" }}>{st("brand", lang, t.brand)}</span>
              <button onClick={() => setMenuOpen(false)} aria-label="Close" style={{ width: 38, height: 38, borderRadius: 10, border: "1px solid rgba(12,52,70,0.15)", background: "#fff", fontSize: 18, cursor: "pointer" }}>✕</button>
            </div>
            {mobileLink("/", st("nav.home", lang, t.navHome))}
            {mobileLink("/about", st("nav.about", lang, t.navAbout))}
            {mobileLink("/services", st("nav.services", lang, t.navServices))}
            {mobileParent("/cases", st("nav.cases", lang, t.navCases), casesOpen, () => setCasesOpen((v) => !v), (
              <>
                {mobileSub("/cases#success", st("nav.success", lang, t.navSuccess))}
                {mobileSub("/cases#celebs", st("nav.celebs", lang, t.navCelebs))}
              </>
            ))}
            {mobileLink("/blogs", st("nav.blogs", lang, t.navBlogs))}
            {mobileParent("/media", st("nav.media", lang, t.navMedia), mediaOpen, () => setMediaOpen((v) => !v), (
              <>
                {mobileSub("/media#gallery", st("nav.gallery", lang, t.navGallery))}
                {mobileSub("/media#videos", st("nav.videos", lang, t.navVideos))}
              </>
            ))}
            {mobileLink("/contact", st("nav.contact", lang, t.navContact))}
            <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
              <button onClick={() => toggleLang()} style={{ flex: 1, background: "#fff", border: "1.5px solid rgba(48,182,222,0.5)", color: "#1E92B8", borderRadius: 10, padding: "11px", fontWeight: 700, cursor: "pointer" }}>{st("nav.lang", lang, t.langBtn)}</button>
              <Link href={lp("/contact")} onClick={() => setMenuOpen(false)} style={{ flex: 1, textAlign: "center", background: "linear-gradient(135deg, #30B6DE, #1E92B8)", color: "#fff", borderRadius: 10, padding: "11px", fontWeight: 800, textDecoration: "none" }}>{st("nav.book", lang, t.book)}</Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

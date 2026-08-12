"use client";

import Link from "next/link";
import HoverBox from "./HoverBox";
import { useLang } from "@/lib/lang";
import { useSetting } from "@/lib/settings";
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

export default function Footer(_props?: { variant?: "full" | "simple" }) {
  // The footer is now identical on every page (enhanced 3-column layout).
  const variant: "full" | "simple" = "full";
  void _props;
  const { lang, lp } = useLang();
  const t = common(lang);
  const st = useSetting();

  if (variant === "full") {
    return (
      <footer data-screen-label="Footer" style={{ background: "#04202E", color: "rgba(255,255,255,0.75)", padding: "0 0 0", borderTop: "3px solid transparent", borderImage: "linear-gradient(90deg, #30B6DE, #0E5372) 1" }}>
        <div style={{ height: 4, background: "linear-gradient(90deg, #30B6DE, #8FE0F7, #1E92B8)" }} />
        <div
          className="dam-3col"
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            padding: "70px 24px 0",
            display: "grid",
            gridTemplateColumns: "1.5fr 0.9fr 1.2fr",
            gap: 56,
            paddingBottom: 50,
            boxSizing: "border-box",
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
              <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 20, color: "#ffffff" }}>{st("brand", lang, t.brand)}</span>
            </div>
            <p style={{ fontSize: 14.5, lineHeight: 2, margin: "20px 0 0", maxWidth: 380 }}>{st("footer.about", lang, t.footerAbout)}</p>
            <div style={{ display: "flex", gap: 12, marginTop: 22, flexWrap: "wrap" }}>
              {([
                { key: "footer.facebook", def: CONTACT_INFO.facebook, label: "Facebook", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.9 3.78-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.9h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94z" /></svg> },
                { key: "footer.youtube", def: CONTACT_INFO.youtube, label: "YouTube", icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M6 4.5v7l6-3.5-6-3.5z" /></svg> },
                { key: "footer.instagram", def: CONTACT_INFO.instagram, label: "Instagram", icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="4" /><circle cx="8" cy="8" r="3.2" /><circle cx="12.2" cy="3.8" r="0.9" fill="currentColor" stroke="none" /></svg> },
                { key: "footer.tiktok", def: CONTACT_INFO.tiktok, label: "TikTok", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16.6 5.82a4.28 4.28 0 0 1-1.06-2.82h-3.2v12.44a2.53 2.53 0 0 1-2.53 2.53 2.53 2.53 0 1 1 .77-4.94V9.77a5.73 5.73 0 0 0-.77-.05A5.73 5.73 0 1 0 15.3 15.4V9.01a7.5 7.5 0 0 0 4.35 1.39V7.2a4.28 4.28 0 0 1-3.05-1.38z" /></svg> },
                { key: "footer.snapchat", def: CONTACT_INFO.snapchat, label: "Snapchat", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12.02 2.5c1.7 0 3.86 1.05 4.36 3.6.16.83.09 1.68.03 2.5l-.01.15c-.03.42-.06.72.02.87.1.18.44.3.78.35.36.05.72-.02 1.02-.16.1-.05.24-.07.37-.07.4 0 .74.28.74.66 0 .5-.63.77-1.2.98-.24.09-.6.2-.68.4-.05.13.02.32.09.47.02.05 1.4 3.02 4.24 3.49.26.04.44.27.42.53-.05.55-1.5.98-2.6 1.17-.11.02-.2.2-.26.5-.03.13-.06.27-.11.42-.06.2-.2.3-.44.3h-.05c-.2 0-.46-.05-.79-.11-.44-.09-.98-.19-1.63-.19-.38 0-.78.03-1.18.1-.78.14-1.44.6-2.14 1.09-.83.58-1.69 1.18-2.9 1.18h-.13c-1.2 0-2.06-.6-2.89-1.18-.7-.49-1.36-.95-2.14-1.09a6.9 6.9 0 0 0-1.18-.1c-.68 0-1.24.11-1.68.2-.31.06-.55.1-.74.1-.32 0-.42-.18-.47-.33a5.4 5.4 0 0 1-.11-.42c-.06-.3-.15-.48-.26-.5-1.1-.19-2.55-.62-2.6-1.17a.47.47 0 0 1 .42-.53c2.84-.47 4.22-3.44 4.24-3.49.07-.15.14-.34.09-.47-.08-.2-.44-.31-.68-.4-.57-.21-1.2-.48-1.2-.98 0-.38.34-.66.74-.66.13 0 .27.02.37.07.3.14.66.21 1.02.16.34-.05.68-.17.78-.35.08-.15.05-.45.02-.87l-.01-.15c-.06-.82-.13-1.67.03-2.5.5-2.55 2.66-3.6 4.36-3.6z" /></svg> },
              ] as const)
                .map((s) => ({ ...s, url: st(s.key, lang, s.def) }))
                .filter((s) => s.url)
                .map((s) => (
                  <HoverBox
                    key={s.key}
                    as="a"
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, #30B6DE, #1E92B8)", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff", boxShadow: "0 6px 18px rgba(48,182,222,0.5)", transition: "all 0.25s ease" }}
                    hoverStyle={{ background: "linear-gradient(135deg, #4ec7e8, #30B6DE)", color: "#ffffff", transform: "translateY(-3px)", boxShadow: "0 12px 26px rgba(48,182,222,0.65)" }}
                  >
                    {s.icon}
                  </HoverBox>
                ))}
            </div>
          </div>

          <div>
            <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 17, color: "#ffffff", marginBottom: 20 }}>{st("footer.linksTitle", lang, t.footerLinks)}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 14.5 }}>
              {footerLink(lp("/"), st("nav.home", lang, t.navHome))}
              {footerLink(lp("/about"), st("nav.about", lang, t.navAbout))}
              {footerLink(lp("/services"), st("nav.services", lang, t.navServices))}
              {footerLink(lp("/cases"), st("nav.cases", lang, t.navCases))}
              {footerLink(lp("/blogs"), st("nav.blogs", lang, t.navBlogs))}
              {footerLink(lp("/contact"), st("nav.contact", lang, t.navContact))}
            </div>
          </div>

          <div>
            <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 17, color: "#ffffff", marginBottom: 20 }}>{st("footer.contactTitle", lang, t.footerContact)}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, fontSize: 14, lineHeight: 1.9 }}>
              <HoverBox as="a" href={st("footer.map1", lang, "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent("Polaris Mall, Fifth Settlement, New Cairo"))} target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.75)", display: "flex", gap: 8, alignItems: "flex-start", lineHeight: 1.9 }} hoverStyle={{ color: "#30B6DE" }}>
                <span aria-hidden style={{ color: "#30B6DE", flexShrink: 0 }}>📍</span>
                <span>{st("footer.clinic1", lang, t.clinic1)}</span>
              </HoverBox>
              <div style={{ color: "#30B6DE", fontWeight: 700, fontSize: 15 }}>
                <bdi style={{ direction: "ltr", unicodeBidi: "isolate" }}>{st("footer.phone1", lang, CONTACT_INFO.phone1)} - {st("footer.phone2", lang, CONTACT_INFO.phone2)}</bdi>
              </div>
              <HoverBox as="a" href={`mailto:${st("footer.email", lang, CONTACT_INFO.email)}`} style={{ color: "rgba(255,255,255,0.75)" }} hoverStyle={{ color: "#30B6DE" }}>
                {st("footer.email", lang, CONTACT_INFO.email)}
              </HoverBox>
            </div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", padding: "22px 24px", textAlign: "center", fontSize: 13, color: "rgba(255,255,255,0.45)" }}>
          {st("footer.copyright", lang, t.copyright)}
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
          {footerLink(lp("/"), t.navHome)}
          {footerLink(lp("/services"), t.navServices)}
          {footerLink(lp("/cases"), t.navCases)}
          {footerLink(lp("/contact"), t.navContact)}
        </div>
        <div style={{ direction: "ltr", color: "#30B6DE", fontWeight: 700, fontSize: 15 }}>{st("footer.phone1", lang, CONTACT_INFO.phone1)} - {st("footer.phone2", lang, CONTACT_INFO.phone2)}</div>
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", padding: "20px 0", textAlign: "center", fontSize: 13, color: "rgba(255,255,255,0.45)" }}>
        {t.copyright}
      </div>
    </footer>
  );
}

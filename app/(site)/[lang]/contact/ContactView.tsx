"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsappFloat from "@/components/WhatsappFloat";
import PageHero from "@/components/PageHero";
import HoverBox from "@/components/HoverBox";
import { useLang, type Lang } from "@/lib/lang";
import { usePageText } from "@/lib/settings";
import { contactContent } from "@/lib/content/contact";
import { common, CONTACT_INFO } from "@/lib/content/common";
import { pick, type Clinic } from "@/lib/data/types";
import { SERIF, SANS } from "@/lib/theme";

function MapPin({ clinic, index, open, onToggle, directions, lang }: { clinic: Clinic; index: number; open: boolean; onToggle: () => void; directions: string; lang: Lang }) {
  const pos = index === 0 ? { top: "40%", insetInlineStart: "30%" } : { top: "62%", insetInlineStart: "68%" };
  return (
    <div style={{ position: "absolute", ...pos }}>
      {open && (
        <div className="dam-tip" style={{ position: "absolute", bottom: 74, left: "50%", transform: "translateX(-50%)", width: 290, background: "#ffffff", border: "1px solid rgba(48,182,222,0.4)", borderRadius: 20, padding: "20px 22px", boxShadow: "0 22px 50px rgba(12,52,70,0.25)", zIndex: 5 }}>
          <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 18, color: "#0C3446" }}>{pick(clinic.name, lang)}</div>
          <div style={{ fontSize: 13, color: "#5B7A88", lineHeight: 1.8, marginTop: 6 }}>{pick(clinic.address, lang)}</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginTop: 14 }}>
            <a href={`tel:${clinic.phone}`} style={{ fontWeight: 800, fontSize: 14.5, color: "#1E92B8", direction: "ltr" }}>{clinic.phone}</a>
            <HoverBox as="a" href={clinic.mapsUrl} target="_blank" rel="noopener noreferrer" style={{ background: "linear-gradient(135deg, #30B6DE, #1E92B8)", color: "#ffffff", borderRadius: 999, padding: "8px 16px", fontSize: 12.5, fontWeight: 800 }} hoverStyle={{ color: "#ffffff" }}>{directions}</HoverBox>
          </div>
          <div style={{ position: "absolute", bottom: -8, left: "50%", transform: "translateX(-50%) rotate(45deg)", width: 16, height: 16, background: "#ffffff", borderRight: "1px solid rgba(48,182,222,0.4)", borderBottom: "1px solid rgba(48,182,222,0.4)" }} />
        </div>
      )}
      <button onClick={onToggle} style={{ position: "relative", background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, transform: "translate(-50%, -100%)" }}>
        <span style={{ position: "absolute", top: -6, width: 58, height: 58, borderRadius: "50%", background: "rgba(48,182,222,0.25)", animation: `damPing 2.4s ease-out infinite ${index === 1 ? "1.2s" : ""}` }} />
        <svg width="46" height="58" viewBox="0 0 46 58" fill="none" style={{ position: "relative", filter: "drop-shadow(0 10px 18px rgba(12,52,70,0.35))" }}>
          <path d="M23 2 C11.4 2 2 11.4 2 23 C2 38 23 56 23 56 S44 38 44 23 C44 11.4 34.6 2 23 2Z" fill={`url(#damPinGrad${index})`} />
          <circle cx="23" cy="22" r="8" fill="#ffffff" />
          <defs><linearGradient id={`damPinGrad${index}`} x1="0" y1="0" x2="46" y2="58"><stop offset="0" stopColor="#30B6DE" /><stop offset="1" stopColor="#0E5372" /></linearGradient></defs>
        </svg>
        <span style={{ background: "rgba(255,255,255,0.94)", border: "1px solid rgba(48,182,222,0.4)", borderRadius: 999, padding: "6px 16px", fontFamily: SANS, fontSize: 12.5, fontWeight: 800, color: "#0C3446", whiteSpace: "nowrap", boxShadow: "0 8px 18px rgba(12,52,70,0.15)" }}>{pick(clinic.area, lang)}</span>
      </button>
    </div>
  );
}

export default function ContactView({ clinics, serviceOptions = [] }: { clinics: Clinic[]; serviceOptions?: { ar: string; en: string }[] }) {
  const { lang, dir, isAr } = useLang();
  const t = usePageText("contact", lang, contactContent(lang).t);
  const tc = common(lang);

  const [activePin, setActivePin] = useState(0);
  const [form, setForm] = useState({ name: "", phone: "", email: "", service: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const inputStyle = { border: "1.5px solid rgba(12,52,70,0.14)", borderRadius: 13, padding: "15px 18px", fontFamily: SANS, fontSize: 15, color: "#0C3446", outline: "none", background: "#ffffff" } as const;
  const otherLabel = isAr ? "أخرى / استفسار عام" : "Other / general enquiry";

  const [errText, setErrText] = useState("");

  // Arabic-Indic (٠-٩) and Persian (۰-۹) numerals → ASCII digits.
  const toAsciiDigits = (s: string) =>
    s.replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660)).replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0));

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.phone.trim()) { setErrText(t.reqName); setStatus("error"); return; }
    if (toAsciiDigits(form.phone).replace(/\D/g, "").length < 7) { setErrText(t.reqPhone); setStatus("error"); return; }
    setStatus("sending"); setErrText("");
    try {
      const res = await fetch("/api/booking", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, lang }) });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrText(json?.error === "invalid_phone" ? t.reqPhone : json?.error === "missing_fields" ? t.reqName : t.errorMsg);
        setStatus("error");
        return;
      }
      setStatus("sent");
    } catch { setErrText(t.errorMsg); setStatus("error"); }
  };

  return (
    <div style={{ fontFamily: SANS, direction: dir, color: "#0C3446", background: "#ffffff", minHeight: "100vh" }}>
      <Navbar active="contact" cta="phone" />
      <PageHero page="contact" crumbLabel={tc.navContact} title={t.pageTitle} sub={t.pageSub} spin={false} />

      {/* MAP */}
      <section data-screen-label="Clinics map" style={{ padding: "90px 24px 0" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ color: "#30B6DE", fontWeight: 800, fontSize: 14, letterSpacing: "2px", textTransform: "uppercase" }}>{t.mapKicker}</div>
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px, 3.2vw, 42px)", fontWeight: 700, margin: "12px 0 0", color: "#0C3446" }}>{t.mapTitle}</h2>
          <div className="dam-map" style={{ position: "relative", marginTop: 40, borderRadius: 30, overflow: "hidden", border: "1px solid rgba(48,182,222,0.3)", boxShadow: "0 24px 60px rgba(12,52,70,0.14)", height: 520, background: "linear-gradient(160deg, #DDF2FA 0%, #EAF7FB 45%, #F4FBFD 100%)" }}>
            <svg viewBox="0 0 1200 520" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
              <path d="M-20 420 C120 380 180 300 160 200 C145 120 190 40 260 -20" stroke="#BFE4F2" strokeWidth="46" fill="none" opacity="0.8" />
              <path d="M-20 420 C120 380 180 300 160 200 C145 120 190 40 260 -20" stroke="#A9DCEF" strokeWidth="30" fill="none" />
              <path d="M100 540 C300 420 520 460 760 380 C960 315 1100 330 1240 260" stroke="#ffffff" strokeWidth="22" fill="none" />
              <path d="M240 -20 C300 140 420 220 640 250 C860 280 1000 380 1080 540" stroke="#ffffff" strokeWidth="16" fill="none" />
              <path d="M420 -20 C460 120 560 300 520 540" stroke="#ffffff" strokeWidth="12" fill="none" />
              <path d="M-20 180 C220 200 460 140 720 120 C920 105 1080 60 1240 80" stroke="#ffffff" strokeWidth="12" fill="none" />
              <path d="M700 540 C740 420 820 320 980 260 C1080 222 1160 140 1200 40" stroke="#ffffff" strokeWidth="10" fill="none" />
              <path d="M100 540 C300 420 520 460 760 380 C960 315 1100 330 1240 260" stroke="#C9E9F4" strokeWidth="3" fill="none" strokeDasharray="10 12" />
              <rect x="330" y="180" width="120" height="80" rx="14" fill="rgba(48,182,222,0.08)" />
              <rect x="520" y="300" width="150" height="95" rx="14" fill="rgba(48,182,222,0.1)" />
              <rect x="840" y="150" width="130" height="90" rx="14" fill="rgba(48,182,222,0.09)" />
              <rect x="930" y="330" width="150" height="100" rx="14" fill="rgba(48,182,222,0.12)" />
              <rect x="180" y="330" width="100" height="70" rx="12" fill="rgba(48,182,222,0.07)" />
              <circle cx="640" cy="120" r="5" fill="rgba(48,182,222,0.35)" />
              <circle cx="500" cy="430" r="5" fill="rgba(48,182,222,0.3)" />
              <circle cx="1050" cy="200" r="5" fill="rgba(48,182,222,0.3)" />
            </svg>
            <div style={{ position: "absolute", top: 20, insetInlineStart: 20, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(8px)", border: "1px solid rgba(48,182,222,0.35)", borderRadius: 999, padding: "9px 20px", fontSize: 13, fontWeight: 800, color: "#1E92B8", boxShadow: "0 8px 20px rgba(12,52,70,0.12)" }}>{t.mapHint}</div>
            <div style={{ position: "absolute", bottom: 20, insetInlineEnd: 20, width: 52, height: 52, borderRadius: "50%", background: "rgba(255,255,255,0.92)", border: "1px solid rgba(48,182,222,0.35)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 20px rgba(12,52,70,0.12)" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#1E92B8" strokeWidth="1.4" /><path d="M12 4 L14 12 L12 20 L10 12 Z" fill="#30B6DE" /><text x="12" y="3.4" textAnchor="middle" fontSize="4.5" fill="#1E92B8" fontWeight="bold">N</text></svg>
            </div>
            {clinics.slice(0, 2).map((clinic, i) => (
              <MapPin key={clinic.id} clinic={clinic} index={i} open={activePin === i} onToggle={() => setActivePin((p) => (p === i ? -1 : i))} directions={t.directions} lang={lang} />
            ))}
          </div>
        </div>
      </section>

      {/* FORM + INFO */}
      <section data-screen-label="Contact form and info" style={{ padding: "90px 24px" }}>
        <div className="dam-2col" style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 50, alignItems: "start" }}>
          <div style={{ background: "#ffffff", border: "1px solid rgba(12,52,70,0.08)", borderRadius: 26, padding: 44, boxShadow: "0 14px 40px rgba(12,52,70,0.08)" }}>
            <h2 style={{ fontFamily: SERIF, fontSize: 28, fontWeight: 700, margin: 0, color: "#0C3446" }}>{t.formTitle}</h2>
            <p style={{ fontSize: 15, color: "#5B7A88", lineHeight: 1.9, margin: "10px 0 0" }}>{t.formSub}</p>
            {status === "sent" ? (
              <div style={{ marginTop: 28, background: "#EAF7FB", border: "1px solid rgba(48,182,222,0.5)", borderRadius: 16, padding: 22, textAlign: "center" }}>
                <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 20, color: "#1E92B8" }}>{t.sentTitle}</div>
                <div style={{ fontSize: 14.5, color: "#46687A", marginTop: 6 }}>{t.sentSub}</div>
              </div>
            ) : (
              <div className="dam-2col-sm" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginTop: 28 }}>
                <HoverBox as="input" value={form.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, name: e.target.value })} placeholder={t.fName} style={inputStyle} focusStyle={{ borderColor: "#30B6DE" }} />
                <HoverBox as="input" value={form.phone} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, phone: e.target.value })} placeholder={t.fPhone} style={inputStyle} focusStyle={{ borderColor: "#30B6DE" }} />
                <HoverBox as="input" type="email" value={form.email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, email: e.target.value })} placeholder={t.fEmail} style={{ ...inputStyle, gridColumn: "span 2" }} focusStyle={{ borderColor: "#30B6DE" }} />
                <select value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} style={{ ...inputStyle, gridColumn: "span 2", cursor: "pointer", direction: dir }} aria-label={t.fService}>
                  <option value="">{t.fServicePick}</option>
                  {serviceOptions.map((o, i) => { const label = pick(o, lang); return <option key={i} value={label}>{label}</option>; })}
                  <option value={otherLabel}>{otherLabel}</option>
                </select>
                <HoverBox as="textarea" value={form.message} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setForm({ ...form, message: e.target.value })} placeholder={t.fMsg} rows={4} style={{ ...inputStyle, gridColumn: "span 2", resize: "vertical" }} focusStyle={{ borderColor: "#30B6DE" }} />
                {status === "error" && (
                  <div style={{ gridColumn: "span 2", color: "#C0392B", fontSize: 14, fontWeight: 600 }}>
                    {errText || t.errorMsg}
                  </div>
                )}
                <HoverBox as="button" onClick={handleSubmit} disabled={status === "sending"} style={{ gridColumn: "span 2", background: "linear-gradient(135deg, #30B6DE, #1E92B8)", color: "#ffffff", border: "none", borderRadius: 999, padding: 16, fontFamily: SANS, fontWeight: 800, fontSize: 16, cursor: status === "sending" ? "wait" : "pointer", boxShadow: "0 10px 26px rgba(48,182,222,0.4)", opacity: status === "sending" ? 0.7 : 1 }} hoverStyle={{ boxShadow: "0 14px 34px rgba(48,182,222,0.55)" }}>
                  {status === "sending" ? t.sending : t.fSend}
                </HoverBox>
              </div>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            {clinics.map((c) => (
              <div key={c.id} style={{ background: "#F4FBFD", border: "1px solid rgba(48,182,222,0.25)", borderRadius: 22, padding: 30 }}>
                <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 20, color: "#0C3446" }}>{pick(c.name, lang)}</div>
                <div style={{ fontSize: 14.5, lineHeight: 1.9, color: "#5B7A88", marginTop: 10 }}>{pick(c.address, lang)}</div>
                <div style={{ fontSize: 13.5, color: "#1E92B8", fontWeight: 700, marginTop: 10 }}>{pick(c.hours, lang)}</div>
              </div>
            ))}
            <div style={{ background: "linear-gradient(135deg, #0A3950, #1E92B8)", borderRadius: 22, padding: 30, color: "#ffffff" }}>
              <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 20 }}>{t.callTitle}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 14 }}>
                <HoverBox as="a" href={`tel:${CONTACT_INFO.phone1}`} style={{ color: "#ffffff", fontWeight: 800, fontSize: 20, direction: "ltr", textAlign: "start" }} hoverStyle={{ color: "#8FE0F7" }}>{CONTACT_INFO.phone1}</HoverBox>
                <HoverBox as="a" href={`tel:${CONTACT_INFO.phone2}`} style={{ color: "#ffffff", fontWeight: 800, fontSize: 20, direction: "ltr", textAlign: "start" }} hoverStyle={{ color: "#8FE0F7" }}>{CONTACT_INFO.phone2}</HoverBox>
                <HoverBox as="a" href={`mailto:${CONTACT_INFO.email}`} style={{ color: "rgba(255,255,255,0.85)", fontSize: 14.5, marginTop: 4 }} hoverStyle={{ color: "#8FE0F7" }}>{CONTACT_INFO.email}</HoverBox>
              </div>
              <div style={{ fontSize: 13.5, color: "rgba(255,255,255,0.75)", lineHeight: 1.8, marginTop: 16 }}>{t.videoNote}</div>
            </div>
          </div>
        </div>
      </section>

      <Footer variant="simple" />
      <WhatsappFloat />
    </div>
  );
}

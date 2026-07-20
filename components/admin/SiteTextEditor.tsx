"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { adminList, adminUpdate, adminCreate, adminDelete, adminUpload } from "@/lib/admin/client";
import { compressImage } from "@/lib/admin/image";

type Row = { id?: string; key: string; section?: string; value_ar?: string; value_en?: string } & Record<string, unknown>;

/**
 * Arranged editor for the `site_content` table, two levels deep:
 *  1) An overview of "pages" — one card each for the Header, the Footer
 *     (shared across every page), and every page of the site.
 *  2) Click a card to open only that page, its text split into section cards
 *     following the same order the sections appear on the page.
 */

// Top-level buckets, in menu order.
const PAGES: { id: string; label: string; labelAr: string; icon: string; caption: string }[] = [
  { id: "header", label: "Header", labelAr: "الهيدر", icon: "🔝", caption: "Shown on every page" },
  { id: "footer", label: "Footer", labelAr: "الفوتر", icon: "🔻", caption: "Shown on every page" },
  { id: "home", label: "Home page", labelAr: "الصفحة الرئيسية", icon: "🏠", caption: "Home sections" },
  { id: "about", label: "About page", labelAr: "من نحن", icon: "👤", caption: "About sections" },
  { id: "services", label: "Services page", labelAr: "الخدمات", icon: "🩺", caption: "Services page text" },
  { id: "cases", label: "Cases page", labelAr: "الحالات", icon: "⭐", caption: "Cases page text" },
  { id: "blogs", label: "Blog page", labelAr: "المدونة", icon: "📝", caption: "Blog page text" },
  { id: "media", label: "Media page", labelAr: "الإعلام", icon: "🖼️", caption: "Media page text" },
  { id: "contact", label: "Contact page", labelAr: "اتصل بنا", icon: "📍", caption: "Contact page text" },
  { id: "other", label: "Other text", labelAr: "نصوص أخرى", icon: "✦", caption: "Uncategorised" },
];
const PAGE_BY_ID = Object.fromEntries(PAGES.map((p) => [p.id, p]));

// Ordered sub-sections within a page. The first prefix a field starts with wins.
const SUBGROUPS: { id: string; title: string; match: string[] }[] = [
  { id: "page", title: "Page header", match: ["page"] },
  { id: "hero", title: "Hero / buttons", match: ["hero", "next"] },
  { id: "msg", title: "Doctor's message", match: ["msg"] },
  { id: "svc", title: "Services section", match: ["svc", "service"] },
  { id: "vm", title: "Vision & mission", match: ["vm"] },
  { id: "why", title: "Why choose us", match: ["why"] },
  { id: "celeb", title: "Celebrities section", match: ["celeb"] },
  { id: "rev", title: "Reviews section", match: ["rev"] },
  { id: "ig", title: "Instagram section", match: ["ig"] },
  { id: "news", title: "Latest articles section", match: ["news"] },
  { id: "cta", title: "Booking CTA", match: ["cta"] },
  { id: "shared", title: "Shared labels", match: ["viewAll", "photoPh", "view", "photo"] },
];

function prettifyField(field: string) {
  return field
    .replace(/[._]/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Za-z])(\d)/g, "$1 $2")
    .replace(/\b\w/g, (m) => m.toUpperCase())
    .trim();
}

function pageIdOf(row: Row): string {
  const section = String(row.section ?? "");
  if (section === "Header" || section === "Header/Footer") return "header";
  if (section === "Footer") return "footer";
  const key = String(row.key ?? "");
  const dot = key.indexOf(".");
  const page = dot > 0 ? key.slice(0, dot) : key;
  return PAGE_BY_ID[page] ? page : "other";
}

type Section = { id: string; title: string; order: number; rows: Row[] };

function sectionOf(row: Row): { id: string; title: string; order: number } {
  const key = String(row.key ?? "");
  const dot = key.indexOf(".");
  const field = dot > 0 ? key.slice(dot + 1) : key;
  const idx = SUBGROUPS.findIndex((g) => g.match.some((m) => field.toLowerCase().startsWith(m.toLowerCase())));
  if (idx >= 0) return { id: SUBGROUPS[idx].id, title: SUBGROUPS[idx].title, order: idx };
  return { id: "general", title: "General text", order: 99 };
}

export default function SiteTextEditor() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dirty, setDirty] = useState<Record<string, Row>>({});
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [newRow, setNewRow] = useState<Row>({ key: "", section: "", value_ar: "", value_en: "" });

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try { setRows((await adminList("site_content")) as Row[]); } catch (e) { setError((e as Error).message); }
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  // rows grouped by page id
  const byPage = useMemo(() => {
    const m: Record<string, Row[]> = {};
    for (const r of rows) { const p = pageIdOf(r); (m[p] ??= []).push(r); }
    return m;
  }, [rows]);

  // sections for the selected page
  const sections = useMemo<Section[]>(() => {
    if (!selected) return [];
    // Header / Footer / Other are flat — one section, no prefix sub-grouping.
    const flat = selected === "header" || selected === "footer" || selected === "other";
    const map = new Map<string, Section>();
    for (const r of byPage[selected] ?? []) {
      const s = flat ? { id: "all", title: "Text", order: 0 } : sectionOf(r);
      const ex = map.get(s.id) ?? { ...s, rows: [] };
      ex.rows.push(r);
      map.set(s.id, ex);
    }
    const arr = Array.from(map.values());
    arr.forEach((s) => s.rows.sort((a, b) => String(a.key).localeCompare(String(b.key))));
    arr.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
    return arr;
  }, [selected, byPage]);

  const edit = (row: Row, field: "value_ar" | "value_en", v: string) => {
    setRows((rs) => rs.map((r) => (r.id === row.id ? { ...r, [field]: v } : r)));
    setDirty((d) => ({ ...d, [String(row.id)]: { ...(d[String(row.id)] ?? row), [field]: v, id: row.id } }));
  };
  // Image rows (keys ending in "image") store the same URL in both languages.
  const editImage = (row: Row, url: string) => {
    setRows((rs) => rs.map((r) => (r.id === row.id ? { ...r, value_ar: url, value_en: url } : r)));
    setDirty((d) => ({ ...d, [String(row.id)]: { ...(d[String(row.id)] ?? row), value_ar: url, value_en: url, id: row.id } }));
  };

  const saveAll = async () => {
    const items = Object.values(dirty);
    if (items.length === 0) return;
    setSaving(true); setError("");
    try {
      for (const it of items) await adminUpdate("site_content", { id: it.id, value_ar: it.value_ar ?? "", value_en: it.value_en ?? "" });
      setDirty({}); await load();
    } catch (e) { setError((e as Error).message); }
    setSaving(false);
  };

  const addBlock = async () => {
    if (!newRow.key.trim()) { setError("A key is required (e.g. home.msgTitle)."); return; }
    setSaving(true); setError("");
    try {
      await adminCreate("site_content", { key: newRow.key.trim(), section: newRow.section?.trim() || "General", value_ar: newRow.value_ar ?? "", value_en: newRow.value_en ?? "" });
      setNewRow({ key: "", section: "", value_ar: "", value_en: "" }); setAdding(false); await load();
    } catch (e) { setError((e as Error).message); }
    setSaving(false);
  };

  const removeRow = async (row: Row) => {
    if (!confirm(`Delete the text block "${row.key}"?`)) return;
    try { await adminDelete("site_content", String(row.id)); await load(); } catch (e) { setError((e as Error).message); }
  };

  const dirtyCount = Object.keys(dirty).length;
  const cur = selected ? PAGE_BY_ID[selected] : null;

  if (loading) return <div style={{ color: "#5B7A88" }}>Loading…</div>;

  return (
    <div>
      {error && <div style={{ background: "#FDECEA", color: "#C0392B", padding: 14, borderRadius: 12, marginBottom: 16, fontSize: 14 }}>{error}</div>}

      {/* ---------- OVERVIEW: page cards ---------- */}
      {!selected && (
        <>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
            <p style={{ margin: 0, color: "#5B7A88", fontSize: 14, maxWidth: 640 }}>
              Pick a page to edit its text. The Header and Footer are shared across the whole site; each page opens its own
              sections in the order they appear on the page.
            </p>
            <button onClick={() => setAdding((a) => !a)} style={btnGhost}>{adding ? "Close" : "+ Advanced: add text block"}</button>
          </div>

          {adding && (
            <div style={{ ...card, marginBottom: 20 }}>
              <div style={cardHead}>New text block</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <Labeled label="Key (e.g. home.msgTitle)"><input value={newRow.key} onChange={(e) => setNewRow({ ...newRow, key: e.target.value })} style={inp} /></Labeled>
                <Labeled label="Section (e.g. Home page)"><input value={newRow.section} onChange={(e) => setNewRow({ ...newRow, section: e.target.value })} style={inp} /></Labeled>
                <Labeled label="Text (Arabic)"><textarea value={newRow.value_ar} onChange={(e) => setNewRow({ ...newRow, value_ar: e.target.value })} rows={2} style={{ ...inp, resize: "vertical" }} dir="rtl" /></Labeled>
                <Labeled label="Text (English)"><textarea value={newRow.value_en} onChange={(e) => setNewRow({ ...newRow, value_en: e.target.value })} rows={2} style={{ ...inp, resize: "vertical" }} /></Labeled>
              </div>
              <button onClick={addBlock} disabled={saving} style={{ ...btnPrimary, marginTop: 14 }}>{saving ? "Adding…" : "Add block"}</button>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
            {PAGES.map((p) => {
              const count = byPage[p.id]?.length ?? 0;
              if (count === 0) return null;
              return (
                <button key={p.id} onClick={() => setSelected(p.id)} style={{ ...card, cursor: "pointer", textAlign: "start", display: "flex", alignItems: "center", gap: 14, border: "1px solid rgba(12,52,70,0.1)" }}>
                  <span style={{ fontSize: 26, width: 48, height: 48, borderRadius: 12, background: "#EAF7FB", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{p.icon}</span>
                  <span style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                    <span style={{ fontSize: 16, fontWeight: 800, color: "#0C3446" }}>{p.label}</span>
                    <span style={{ fontSize: 12.5, color: "#8AA5B1" }}>{p.caption} · {count} item{count === 1 ? "" : "s"}</span>
                  </span>
                  <span style={{ marginInlineStart: "auto", color: "#1E92B8", fontSize: 20 }}>›</span>
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* ---------- DETAIL: one page's sections ---------- */}
      {selected && cur && (
        <>
          <button onClick={() => setSelected(null)} style={{ ...btnGhost, marginBottom: 18 }}>← All pages</button>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
            <span style={{ fontSize: 30, width: 56, height: 56, borderRadius: 14, background: "#EAF7FB", display: "flex", alignItems: "center", justifyContent: "center" }}>{cur.icon}</span>
            <div>
              <h2 style={{ margin: 0, fontSize: 23, color: "#0C3446" }}>{cur.label} <span style={{ color: "#8AA5B1", fontSize: 16, fontWeight: 400 }}>{cur.labelAr}</span></h2>
              <div style={{ fontSize: 13, color: "#8AA5B1" }}>{cur.caption}</div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 18, paddingBottom: 90 }}>
            {sections.map((s) => (
              <div key={s.id} style={card}>
                <div style={{ fontSize: 15.5, fontWeight: 800, color: "#0C3446", marginBottom: 4 }}>{s.title}</div>
                <div style={{ fontSize: 12, color: "#B4C4CC", marginBottom: 16 }}>{s.rows.length} item{s.rows.length === 1 ? "" : "s"}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {s.rows.map((r) => {
                    const dot = String(r.key).indexOf(".");
                    const field = dot > 0 ? String(r.key).slice(dot + 1) : String(r.key);
                    return (
                      <div key={String(r.id)} style={{ borderTop: "1px solid rgba(12,52,70,0.07)", paddingTop: 14 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, gap: 10 }}>
                          <label style={{ fontSize: 13, fontWeight: 700, color: "#46687A" }}>{prettifyField(field)} <span style={{ fontWeight: 400, color: "#B4C4CC", fontSize: 11.5 }}>· {String(r.key)}</span></label>
                          <button onClick={() => removeRow(r)} style={{ background: "none", border: "none", color: "#C99", fontSize: 12, cursor: "pointer" }}>Delete</button>
                        </div>
                        {/image$/i.test(String(r.key)) ? (
                          <ImageRow value={String(r.value_ar ?? r.value_en ?? "")} onChange={(url) => editImage(r, url)} />
                        ) : (
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                              <span style={miniLbl}>Arabic</span>
                              <textarea value={String(r.value_ar ?? "")} onChange={(e) => edit(r, "value_ar", e.target.value)} rows={2} dir="rtl" style={{ ...inp, resize: "vertical" }} />
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                              <span style={miniLbl}>English</span>
                              <textarea value={String(r.value_en ?? "")} onChange={(e) => edit(r, "value_en", e.target.value)} rows={2} style={{ ...inp, resize: "vertical" }} />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            {sections.length === 0 && <div style={{ ...card, textAlign: "center", color: "#5B7A88" }}>No text for this page yet.</div>}
          </div>
        </>
      )}

      {dirtyCount > 0 && (
        <div style={{ position: "sticky", bottom: 0, background: "#EEF6FA", padding: "14px 0", display: "flex", gap: 12, alignItems: "center", borderTop: "1px solid rgba(12,52,70,0.1)" }}>
          <button onClick={saveAll} disabled={saving} style={btnPrimary}>{saving ? "Saving…" : `💾 Save ${dirtyCount} change${dirtyCount === 1 ? "" : "s"}`}</button>
          <button onClick={() => { setDirty({}); load(); }} disabled={saving} style={btnGhost}>Discard</button>
        </div>
      )}
    </div>
  );
}

function ImageRow({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");
  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; e.target.value = "";
    if (!file) return;
    setUploading(true); setErr("");
    try { onChange(await adminUpload(await compressImage(file))); } catch (x) { setErr((x as Error).message); }
    setUploading(false);
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        {value
          ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={value} alt="" style={{ width: 140, height: 78, objectFit: "cover", borderRadius: 10, border: "1px solid rgba(12,52,70,0.12)" }} />
          : <div style={{ width: 140, height: 78, borderRadius: 10, background: "#EAF2F6", display: "flex", alignItems: "center", justifyContent: "center", color: "#9BB3BF", fontSize: 22 }}>🖼️</div>}
        <label style={{ background: "#1E92B8", color: "#fff", borderRadius: 10, padding: "10px 16px", fontSize: 13, fontWeight: 700, cursor: uploading ? "wait" : "pointer", opacity: uploading ? 0.7 : 1 }}>
          {uploading ? "Uploading…" : "⬆ Upload image"}
          <input type="file" accept="image/*" onChange={onFile} disabled={uploading} style={{ display: "none" }} />
        </label>
        {value && <button type="button" onClick={() => onChange("")} style={btnGhost}>Remove</button>}
      </div>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder="…or paste an image URL" style={{ ...inp, fontSize: 12.5 }} />
      {err && <div style={{ color: "#C0392B", fontSize: 12 }}>{err}</div>}
    </div>
  );
}

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return <div style={{ display: "flex", flexDirection: "column", gap: 4 }}><span style={miniLbl}>{label}</span>{children}</div>;
}

const card: React.CSSProperties = { background: "#fff", border: "1px solid rgba(12,52,70,0.08)", borderRadius: 16, padding: 22, boxShadow: "0 2px 10px rgba(12,52,70,0.04)" };
const cardHead: React.CSSProperties = { fontSize: 13, fontWeight: 800, color: "#1E92B8", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 16 };
const miniLbl: React.CSSProperties = { fontSize: 11.5, fontWeight: 700, color: "#8AA5B1" };
const inp: React.CSSProperties = { border: "1.5px solid rgba(12,52,70,0.15)", borderRadius: 10, padding: "10px 12px", fontSize: 14, outline: "none", width: "100%", boxSizing: "border-box", background: "#fff", lineHeight: 1.6 };
const btnPrimary: React.CSSProperties = { background: "linear-gradient(135deg, #30B6DE, #1E92B8)", color: "#fff", border: "none", borderRadius: 11, padding: "12px 22px", fontSize: 14, fontWeight: 800, cursor: "pointer" };
const btnGhost: React.CSSProperties = { background: "#fff", color: "#46687A", border: "1px solid rgba(12,52,70,0.2)", borderRadius: 11, padding: "11px 18px", fontSize: 14, fontWeight: 700, cursor: "pointer" };

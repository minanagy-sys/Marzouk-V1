"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { adminList, adminUpdate, adminCreate, adminDelete } from "@/lib/admin/client";

type Row = { id?: string; key: string; section?: string; value_ar?: string; value_en?: string } & Record<string, unknown>;

/**
 * Arranged editor for the `site_content` table. Instead of one card per text
 * key, it groups every piece of text into friendly cards — a card for the
 * Header and one for the Footer (shared across all pages), then a card for
 * each content section of every page, following the on-page sequence.
 */

// Ordered sub-sections. The first prefix a field starts with wins.
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

const PAGE_ORDER: Record<string, { order: number; label: string }> = {
  home: { order: 10, label: "Home page" },
  about: { order: 20, label: "About page" },
  services: { order: 30, label: "Services page" },
  cases: { order: 40, label: "Cases page" },
  blogs: { order: 50, label: "Blog page" },
  media: { order: 60, label: "Media page" },
  contact: { order: 70, label: "Contact page" },
};

type Group = { id: string; title: string; caption: string; order: number; rows: Row[] };

function prettifyField(field: string) {
  return field
    .replace(/[._]/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Za-z])(\d)/g, "$1 $2")
    .replace(/\b\w/g, (m) => m.toUpperCase())
    .trim();
}

function groupOf(row: Row): Group {
  const section = String(row.section ?? "");
  const key = String(row.key ?? "");
  if (section === "Header" || section === "Header/Footer") {
    return { id: "header", title: "Header", caption: "Shown on every page", order: 0, rows: [] };
  }
  if (section === "Footer") {
    return { id: "footer", title: "Footer", caption: "Shown on every page", order: 1, rows: [] };
  }
  const dot = key.indexOf(".");
  const page = dot > 0 ? key.slice(0, dot) : key;
  const field = dot > 0 ? key.slice(dot + 1) : key;
  const pageInfo = PAGE_ORDER[page] ?? { order: 90, label: prettifyField(page) };
  const subIdx = SUBGROUPS.findIndex((g) => g.match.some((m) => field.toLowerCase().startsWith(m.toLowerCase())));
  if (subIdx >= 0) {
    const sub = SUBGROUPS[subIdx];
    return { id: `${page}:${sub.id}`, title: sub.title, caption: pageInfo.label, order: pageInfo.order + subIdx + 2, rows: [] };
  }
  return { id: `${page}:other`, title: "General text", caption: pageInfo.label, order: pageInfo.order + 99, rows: [] };
}

export default function SiteTextEditor() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dirty, setDirty] = useState<Record<string, Row>>({});
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [adding, setAdding] = useState(false);
  const [newRow, setNewRow] = useState<Row>({ key: "", section: "", value_ar: "", value_en: "" });

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try { setRows((await adminList("site_content")) as Row[]); } catch (e) { setError((e as Error).message); }
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const groups = useMemo(() => {
    const map = new Map<string, Group>();
    for (const r of rows) {
      const g = groupOf(r);
      const existing = map.get(g.id) ?? g;
      existing.rows.push(r);
      map.set(g.id, existing);
    }
    const arr = Array.from(map.values());
    arr.forEach((g) => g.rows.sort((a, b) => String(a.key).localeCompare(String(b.key))));
    arr.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
    return arr;
  }, [rows]);

  const edit = (row: Row, field: "value_ar" | "value_en", v: string) => {
    setRows((rs) => rs.map((r) => (r.id === row.id ? { ...r, [field]: v } : r)));
    setDirty((d) => ({ ...d, [String(row.id)]: { ...(d[String(row.id)] ?? row), [field]: v, id: row.id } }));
  };

  const saveAll = async () => {
    const items = Object.values(dirty);
    if (items.length === 0) return;
    setSaving(true); setError("");
    try {
      for (const it of items) await adminUpdate("site_content", { id: it.id, value_ar: it.value_ar ?? "", value_en: it.value_en ?? "" });
      setDirty({});
      await load();
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

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <p style={{ margin: 0, color: "#5B7A88", fontSize: 14, maxWidth: 640 }}>
          Every piece of text on the site, arranged by section. The Header and Footer are shared across all pages; each page&apos;s
          sections follow the same order they appear on the page.
        </p>
        <button onClick={() => setAdding((a) => !a)} style={btnGhost}>{adding ? "Close" : "+ Advanced: add text block"}</button>
      </div>

      {error && <div style={{ background: "#FDECEA", color: "#C0392B", padding: 14, borderRadius: 12, marginBottom: 16, fontSize: 14 }}>{error}</div>}

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

      {loading ? (
        <div style={{ color: "#5B7A88" }}>Loading…</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 18, paddingBottom: 90 }}>
          {groups.map((g) => {
            const isOpen = open[g.id] ?? true;
            return (
              <div key={g.id} style={card}>
                <button onClick={() => setOpen((o) => ({ ...o, [g.id]: !isOpen }))} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "start" }}>
                  <span>
                    <span style={{ fontSize: 16.5, fontWeight: 800, color: "#0C3446" }}>{g.title}</span>
                    <span style={{ fontSize: 12.5, color: "#8AA5B1", marginInlineStart: 10 }}>{g.caption} · {g.rows.length} item{g.rows.length === 1 ? "" : "s"}</span>
                  </span>
                  <span style={{ color: "#1E92B8", fontSize: 15 }}>{isOpen ? "▾" : "▸"}</span>
                </button>
                {isOpen && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 18 }}>
                    {g.rows.map((r) => {
                      const dot = String(r.key).indexOf(".");
                      const field = dot > 0 ? String(r.key).slice(dot + 1) : String(r.key);
                      return (
                        <div key={String(r.id)} style={{ borderTop: "1px solid rgba(12,52,70,0.07)", paddingTop: 14 }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, gap: 10 }}>
                            <label style={{ fontSize: 13, fontWeight: 700, color: "#46687A" }}>{prettifyField(field)} <span style={{ fontWeight: 400, color: "#B4C4CC", fontSize: 11.5 }}>· {String(r.key)}</span></label>
                            <button onClick={() => removeRow(r)} style={{ background: "none", border: "none", color: "#C99", fontSize: 12, cursor: "pointer" }}>Delete</button>
                          </div>
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
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
          {groups.length === 0 && (
            <div style={{ ...card, textAlign: "center", color: "#5B7A88" }}>
              No text blocks yet. Run the seed (Dashboard → Seed content) to populate every page&apos;s text, or add one above.
            </div>
          )}
        </div>
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

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return <div style={{ display: "flex", flexDirection: "column", gap: 4 }}><span style={miniLbl}>{label}</span>{children}</div>;
}

const card: React.CSSProperties = { background: "#fff", border: "1px solid rgba(12,52,70,0.08)", borderRadius: 16, padding: 22, boxShadow: "0 2px 10px rgba(12,52,70,0.04)" };
const cardHead: React.CSSProperties = { fontSize: 13, fontWeight: 800, color: "#1E92B8", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 16 };
const miniLbl: React.CSSProperties = { fontSize: 11.5, fontWeight: 700, color: "#8AA5B1" };
const inp: React.CSSProperties = { border: "1.5px solid rgba(12,52,70,0.15)", borderRadius: 10, padding: "10px 12px", fontSize: 14, outline: "none", width: "100%", boxSizing: "border-box", background: "#fff", lineHeight: 1.6 };
const btnPrimary: React.CSSProperties = { background: "linear-gradient(135deg, #30B6DE, #1E92B8)", color: "#fff", border: "none", borderRadius: 11, padding: "12px 22px", fontSize: 14, fontWeight: 800, cursor: "pointer" };
const btnGhost: React.CSSProperties = { background: "#fff", color: "#46687A", border: "1px solid rgba(12,52,70,0.2)", borderRadius: 11, padding: "11px 18px", fontSize: 14, fontWeight: 700, cursor: "pointer" };

"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { COLLECTIONS, type Field } from "@/lib/admin/config";
import { adminList, adminCreate, adminUpdate, adminDelete, adminUpload } from "@/lib/admin/client";
import { compressImage } from "@/lib/admin/image";
import { slugify } from "@/lib/admin/slug";
import RichTextField from "@/components/admin/RichTextField";
import SiteTextEditor from "@/components/admin/SiteTextEditor";
import BookingsTable from "@/components/admin/BookingsTable";
import { ytThumb } from "@/lib/youtube";

const arrToHtml = (v: unknown): string =>
  Array.isArray(v) ? (v as string[]).map((p) => `<p>${p}</p>`).join("") : typeof v === "string" ? v : "";

type Row = Record<string, unknown>;
type RefData = Record<string, Row[]>;

export default function AdminCollectionPage() {
  const params = useParams();
  const table = String(params?.table ?? "");
  const col = COLLECTIONS[table];

  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<Row | "new" | null>(null);
  const [form, setForm] = useState<Row>({});
  const [saving, setSaving] = useState(false);
  const [refData, setRefData] = useState<RefData>({});
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragGroup, setDragGroup] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("");

  const load = useCallback(async () => {
    if (!col) return;
    setLoading(true); setError("");
    try { setRows(await adminList(table)); } catch (e) { setError((e as Error).message); }
    setLoading(false);
  }, [table, col]);

  useEffect(() => { load(); }, [load]);

  // Load reference dropdown options
  useEffect(() => {
    if (!col) return;
    const refs = col.fields.filter((f) => f.type === "reference" && f.refTable);
    refs.forEach(async (f) => {
      try { const data = await adminList(f.refTable!); setRefData((d) => ({ ...d, [f.refTable!]: data })); } catch { /* ignore */ }
    });
  }, [col]);

  if (!col) return <div>Unknown collection. <Link href="/admin">← Back</Link></div>;

  const toForm = (row: Row): Row => {
    const f: Row = { ...row };
    col.fields.forEach((fld) => {
      if (fld.type === "paragraphs") f[fld.name] = Array.isArray(row[fld.name]) ? (row[fld.name] as string[]).join("\n\n") : String(row[fld.name] ?? "");
      if (fld.type === "richtext") f[fld.name] = arrToHtml(row[fld.name]);
      if (fld.type === "repeater") f[fld.name] = Array.isArray(row[fld.name]) ? row[fld.name] : [];
      if (fld.type === "reference") f[fld.name] = row[fld.name] ?? "";
    });
    return f;
  };

  const curTab = activeTab || col.groupOptions?.[0]?.value || "";
  const startNew = () => {
    const f: Row = {};
    col.fields.forEach((fld) => {
      f[fld.name] = fld.type === "boolean" ? true : fld.type === "number" ? 0 : fld.type === "repeater" ? [] : fld.type === "select" ? (fld.options?.[0] ?? "") : "";
    });
    // A new item in a grouped collection defaults to the active tab's group.
    if (col.groupBy && curTab) f[col.groupBy] = curTab;
    setForm(f); setEditing("new");
  };
  const startEdit = (row: Row) => { setForm(toForm(row)); setEditing(row); };

  const save = async () => {
    setSaving(true); setError("");
    try {
      const payload: Row = {};
      col.fields.forEach((fld) => {
        let v = form[fld.name];
        if (fld.type === "paragraphs") v = String(v || "").split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean);
        else if (fld.type === "number") v = v === "" || v === null ? null : Number(v);
        else if (fld.type === "reference") v = v || null;
        else if (fld.type === "repeater") v = Array.isArray(v) ? v : [];
        payload[fld.name] = v;
      });
      // Normalise the slug (spaces → dashes); derive from the title when empty.
      if (hasSlug) {
        payload.slug = slugify(String(payload.slug || form.title_en || form.title_ar || form.name_en || form.name_ar || form.name || form[col.titleColumn] || ""));
      }
      if (hasField("slug_ar")) payload.slug_ar = payload.slug_ar ? slugify(String(payload.slug_ar)) : null;
      if (hasField("slug_en")) payload.slug_en = payload.slug_en ? slugify(String(payload.slug_en)) : null;
      // New item: auto-assign the next order number (append) unless one was typed.
      if (editing === "new" && hasField("sort_order") && (!form.sort_order || Number(form.sort_order) === 0)) {
        const gb = col.groupBy;
        const scope = gb ? rows.filter((r) => String(r[gb] ?? "") === String(form[gb] ?? "")) : rows;
        const maxOrder = scope.reduce((m, r) => Math.max(m, Number(r.sort_order) || 0), -1);
        payload.sort_order = maxOrder + 1;
      }
      if (editing === "new") await adminCreate(table, payload);
      else await adminUpdate(table, { id: (editing as Row).id, ...payload });
      setEditing(null); await load();
    } catch (e) { setError((e as Error).message); }
    setSaving(false);
  };

  const remove = async (row: Row) => {
    if (!confirm("Delete this item permanently?")) return;
    try { await adminDelete(table, String(row.id)); await load(); } catch (e) { setError((e as Error).message); }
  };

  const hasField = (n: string) => col.fields.some((f) => f.name === n);
  const hasSlug = hasField("slug");
  const setField = (name: string, v: unknown) =>
    setForm((f) => {
      const next = { ...f, [name]: v };
      // Auto-fill slugs from title/name fields while each is still empty.
      if (hasSlug && !String(f.slug ?? "").trim() && ["title_en", "title_ar", "name_en", "name_ar", "name"].includes(name)) {
        next.slug = slugify(String(next.title_en || next.title_ar || next.name_en || next.name_ar || next.name || v || ""));
      }
      if (hasField("slug_en") && !String(f.slug_en ?? "").trim() && (name === "title_en" || name === "name_en")) {
        next.slug_en = slugify(String(v ?? ""));
      }
      if (hasField("slug_ar") && !String(f.slug_ar ?? "").trim() && (name === "title_ar" || name === "name_ar")) {
        next.slug_ar = slugify(String(v ?? ""));
      }
      return next;
    });

  const canReorder = !col.readOnly && col.defaultOrder === "sort_order" && editing === null;
  // Reorder a list (a whole collection, or one group when groupBy is set). Each
  // group is reindexed independently, so its order starts from 1 on its own.
  const applyReorder = async (list: Row[], from: number, to: number, groupKey: string | null) => {
    setDragIndex(null); setDragGroup(null);
    if (from === to) return;
    const copy = [...list];
    const [moved] = copy.splice(from, 1);
    copy.splice(to, 0, moved);
    const reindexed: Row[] = copy.map((r, i) => ({ ...r, sort_order: i }));
    const gb = col.groupBy;
    const newRows = groupKey === null || !gb
      ? reindexed
      : [...rows.filter((r) => String(r[gb] ?? "") !== groupKey), ...reindexed];
    setRows(newRows);
    try {
      await Promise.all(reindexed.map((r, i) => (list[i]?.id === r.id ? null : adminUpdate(table, { id: r.id, sort_order: i }))).filter(Boolean) as Promise<unknown>[]);
    } catch (e) { setError((e as Error).message); await load(); }
  };

  // Conditional field visibility (e.g. show a field only when another field has a value).
  const isVisible = (f: Field) => !f.showIf || form[f.showIf.field] === f.showIf.equals;

  // group fields for the form (only groups that have at least one visible field)
  const groups: string[] = [];
  col.fields.forEach((f) => { const g = f.group || "Details"; if (isVisible(f) && !groups.includes(g)) groups.push(g); });

  // One list card. `list`/`groupKey` scope drag-reorder to the current group.
  const renderCard = (row: Row, i: number, list: Row[], groupKey: string | null) => {
    const img = (row.image_url as string) || (row.video_url ? ytThumb(String(row.video_url)) : "");
    const published = "is_published" in row ? !!row.is_published : true;
    const title = String(row[col.titleColumn] ?? "—") || "—";
    const meta = col.listColumns.filter((cc) => cc !== col.titleColumn && cc !== "is_published" && cc !== col.groupBy && cc !== "sort_order");
    const dragging = dragIndex === i && dragGroup === groupKey;
    return (
      <div
        key={String(row.id) || i}
        draggable={canReorder}
        onDragStart={() => { setDragIndex(i); setDragGroup(groupKey); }}
        onDragOver={(e) => { if (canReorder && dragGroup === groupKey) e.preventDefault(); }}
        onDrop={() => { if (canReorder && dragGroup === groupKey && dragIndex !== null) applyReorder(list, dragIndex, i, groupKey); }}
        style={{ background: "#fff", border: "1px solid rgba(12,52,70,0.08)", borderRadius: 16, overflow: "hidden", boxShadow: dragging ? "0 12px 30px rgba(48,182,222,0.25)" : "0 2px 10px rgba(12,52,70,0.05)", display: "flex", flexDirection: "column", cursor: canReorder ? "grab" : "default" }}
      >
        <div style={{ position: "relative", height: 150, background: "linear-gradient(160deg, #0A3950, #0E5372)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {img
            ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <span style={{ fontSize: 38, opacity: 0.5 }}>{col.icon}</span>}
          {canReorder && <span style={{ position: "absolute", top: 10, insetInlineStart: 10, background: "rgba(4,32,46,0.72)", color: "#fff", borderRadius: 999, minWidth: 24, height: 24, padding: "0 8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800 }}>{i + 1}</span>}
          <span style={{ position: "absolute", top: 10, insetInlineEnd: 10, background: published ? "rgba(39,174,96,0.95)" : "rgba(120,140,150,0.95)", color: "#fff", borderRadius: 999, padding: "3px 12px", fontSize: 11, fontWeight: 800 }}>{published ? "Published" : "Hidden"}</span>
        </div>
        <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 15.5, color: "#0C3446", lineHeight: 1.4 }}>{title.length > 70 ? title.slice(0, 70) + "…" : title}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {meta.map((cc) => {
              const val = formatCell(row[cc], cc, refData);
              if (val === "—") return null;
              return <span key={cc} style={{ background: "#F4FBFD", border: "1px solid rgba(12,52,70,0.08)", borderRadius: 8, padding: "3px 9px", fontSize: 11.5, color: "#5B7A88" }}>{String(val)}</span>;
            })}
          </div>
          <div style={{ marginTop: "auto", paddingTop: 10, display: "flex", gap: 8, borderTop: "1px solid rgba(12,52,70,0.06)" }}>
            <button onClick={() => startEdit(row)} style={{ ...btnSmall, background: "#EAF7FB", borderRadius: 8, padding: "7px 14px" }}>✎ Edit</button>
            {!col.readOnly && <button onClick={() => remove(row)} style={{ ...btnSmall, color: "#C0392B", background: "#FDECEA", borderRadius: 8, padding: "7px 14px" }}>Delete</button>}
          </div>
        </div>
      </div>
    );
  };
  const gridStyle: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: 18 };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <Link href="/admin" style={{ color: "#1E92B8", textDecoration: "none", fontSize: 13 }}>← Dashboard</Link>
          <h1 style={{ fontSize: 27, margin: "6px 0 0", display: "flex", alignItems: "center", gap: 10 }}><span>{col.icon}</span>{col.label} <span style={{ color: "#8AA5B1", fontSize: 17, fontWeight: 400 }}>{col.labelAr}</span></h1>
        </div>
        {!col.readOnly && editing === null && table !== "site_content" && <button onClick={startNew} style={btnPrimary}>+ New {col.singular}</button>}
      </div>

      {error && <div style={{ background: "#FDECEA", color: "#C0392B", padding: 14, borderRadius: 12, marginBottom: 16, fontSize: 14 }}>{error}</div>}

      {table === "site_content" ? (
        <SiteTextEditor />
      ) : table === "bookings" ? (
        <BookingsTable />
      ) : editing !== null ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {groups.map((g) => (
            <div key={g} style={card}>
              <div style={cardHead}>{g}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                {col.fields.filter((f) => (f.group || "Details") === g && isVisible(f)).map((fld) => (
                  <FieldRenderer key={fld.name} field={fld} value={form[fld.name]} onChange={(v) => setField(fld.name, v)} refData={refData} readOnly={col.readOnly && fld.name !== "status"} />
                ))}
              </div>
            </div>
          ))}
          <div style={{ display: "flex", gap: 12, position: "sticky", bottom: 0, background: "#EEF6FA", padding: "14px 0" }}>
            <button onClick={save} disabled={saving} style={btnPrimary}>{saving ? "Saving…" : "💾 Save changes"}</button>
            <button onClick={() => setEditing(null)} style={btnGhost}>Cancel</button>
          </div>
        </div>
      ) : loading ? (
        <div style={{ color: "#5B7A88" }}>Loading…</div>
      ) : rows.length === 0 ? (
        <div style={{ ...card, textAlign: "center", color: "#5B7A88" }}>No items yet. Click “+ New {col.singular}”.</div>
      ) : col.groupBy ? (
        (() => {
          const items = rows.filter((r) => String(r[col.groupBy!] ?? "") === curTab);
          return (
            <div>
              <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
                {(col.groupOptions ?? []).map((g) => {
                  const n = rows.filter((r) => String(r[col.groupBy!] ?? "") === g.value).length;
                  const on = curTab === g.value;
                  return (
                    <button key={g.value} onClick={() => setActiveTab(g.value)} style={{ borderRadius: 999, padding: "9px 20px", fontSize: 14, fontWeight: 800, cursor: "pointer", border: "1.5px solid " + (on ? "#1E92B8" : "rgba(12,52,70,0.15)"), background: on ? "linear-gradient(135deg, #30B6DE, #1E92B8)" : "#fff", color: on ? "#fff" : "#46687A" }}>
                      {g.label} <span style={{ opacity: 0.75 }}>· {n}</span>
                    </button>
                  );
                })}
              </div>
              {items.length === 0
                ? <div style={{ ...card, textAlign: "center", color: "#5B7A88" }}>None in this tab yet. Click “+ New {col.singular}”.</div>
                : <div style={gridStyle}>{items.map((row, i) => renderCard(row, i, items, curTab))}</div>}
            </div>
          );
        })()
      ) : (
        <div style={gridStyle}>
          {rows.map((row, i) => renderCard(row, i, rows, null))}
        </div>
      )}
    </div>
  );
}

function prettify(s: string) { return s.replace(/_/g, " ").replace(/\bar\b/, "(AR)").replace(/\ben\b/, "(EN)"); }
function formatCell(v: unknown, col: string, refData: RefData) {
  if (typeof v === "boolean") return v ? "✓" : "—";
  if (v === null || v === undefined || v === "") return "—";
  if (col === "created_at") return String(v).slice(0, 10);
  const s = String(v);
  return s.length > 60 ? s.slice(0, 60) + "…" : s;
}

/* ---------------- Field renderers ---------------- */

function FieldRenderer({ field, value, onChange, refData, readOnly }: { field: Field; value: unknown; onChange: (v: unknown) => void; refData: RefData; readOnly?: boolean }) {
  const full = ["textarea", "paragraphs", "richtext", "repeater", "image"].includes(field.type);
  return (
    <div style={{ gridColumn: full ? "1 / -1" : "auto", display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={lbl}>{field.label}{field.help && <span style={{ fontWeight: 400, color: "#8AA5B1" }}> — {field.help}</span>}</label>
      <SimpleField field={field} value={value} onChange={onChange} refData={refData} readOnly={readOnly} />
    </div>
  );
}

function SimpleField({ field, value, onChange, refData, readOnly }: { field: Field; value: unknown; onChange: (v: unknown) => void; refData: RefData; readOnly?: boolean }) {
  if (field.type === "boolean") {
    return <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
      <input type="checkbox" checked={!!value} disabled={readOnly} onChange={(e) => onChange(e.target.checked)} style={{ width: 18, height: 18 }} />
      <span style={{ fontSize: 13.5, color: "#46687A" }}>Yes</span>
    </label>;
  }
  if (field.type === "select") {
    return <select value={String(value ?? "")} disabled={readOnly} onChange={(e) => onChange(e.target.value)} style={inp}>{(field.options || []).map((o) => <option key={o} value={o}>{o}</option>)}</select>;
  }
  if (field.type === "reference") {
    const opts = refData[field.refTable || ""] || [];
    return <select value={String(value ?? "")} disabled={readOnly} onChange={(e) => onChange(e.target.value)} style={inp}>
      <option value="">— none —</option>
      {opts.map((o) => <option key={String(o.id)} value={String(o.id)}>{String(o[field.refLabelColumn || "name_ar"] ?? o.id)}</option>)}
    </select>;
  }
  if (field.type === "textarea") {
    return <textarea value={String(value ?? "")} disabled={readOnly} onChange={(e) => onChange(e.target.value)} rows={3} style={{ ...inp, resize: "vertical" }} />;
  }
  if (field.type === "paragraphs") {
    return <textarea value={String(value ?? "")} disabled={readOnly} onChange={(e) => onChange(e.target.value)} rows={8} style={{ ...inp, resize: "vertical", lineHeight: 1.7 }} />;
  }
  if (field.type === "richtext") {
    return <RichTextField value={value} onChange={onChange} disabled={readOnly} />;
  }
  if (field.type === "icon") {
    return <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <input type="text" value={String(value ?? "")} disabled={readOnly} onChange={(e) => onChange(e.target.value)} placeholder="e.g. ⚕ ♡ ❀" style={{ ...inp, width: 120 }} />
      <span style={{ fontSize: 30 }}>{String(value ?? "")}</span>
    </div>;
  }
  if (field.type === "image") {
    return <ImageField value={value} onChange={onChange} disabled={readOnly} />;
  }
  if (field.type === "repeater") {
    return <RepeaterField field={field} value={Array.isArray(value) ? value : []} onChange={onChange} refData={refData} readOnly={readOnly} />;
  }
  return <input type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"} value={String(value ?? "")} disabled={readOnly} onChange={(e) => onChange(e.target.value)} style={inp} />;
}

function RepeaterField({ field, value, onChange, refData, readOnly }: { field: Field; value: Row[]; onChange: (v: Row[]) => void; refData: RefData; readOnly?: boolean }) {
  const sub = field.subfields || [];
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const add = () => onChange([...value, Object.fromEntries(sub.map((s) => [s.name, ""]))]);
  const update = (i: number, name: string, v: unknown) => onChange(value.map((it, idx) => (idx === i ? { ...it, [name]: v } : it)));
  const removeAt = (i: number) => onChange(value.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir; if (j < 0 || j >= value.length) return;
    const copy = [...value]; [copy[i], copy[j]] = [copy[j], copy[i]]; onChange(copy);
  };
  const dropTo = (to: number) => {
    if (dragIdx === null || dragIdx === to) { setDragIdx(null); return; }
    const copy = [...value]; const [m] = copy.splice(dragIdx, 1); copy.splice(to, 0, m);
    onChange(copy); setDragIdx(null);
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {value.map((item, i) => (
        <div
          key={i}
          draggable={!readOnly}
          onDragStart={() => setDragIdx(i)}
          onDragOver={(e) => { if (!readOnly) e.preventDefault(); }}
          onDrop={() => dropTo(i)}
          style={{ border: "1px solid rgba(48,182,222,0.3)", borderRadius: 12, padding: 16, background: dragIdx === i ? "#EAF7FB" : "#F8FCFE" }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <strong style={{ fontSize: 13, color: "#1E92B8" }}>⠿ {field.itemLabel || "Item"} {i + 1}</strong>
            {!readOnly && <div style={{ display: "flex", gap: 6 }}>
              <button type="button" onClick={() => move(i, -1)} style={btnMini}>↑</button>
              <button type="button" onClick={() => move(i, 1)} style={btnMini}>↓</button>
              <button type="button" onClick={() => removeAt(i)} style={{ ...btnMini, color: "#C0392B" }}>✕</button>
            </div>}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {sub.map((sf) => (
              <div key={sf.name} style={{ gridColumn: ["textarea", "richtext", "paragraphs", "image"].includes(sf.type) ? "1 / -1" : "auto", display: "flex", flexDirection: "column", gap: 4 }}>
                <label style={{ ...lbl, fontSize: 11.5 }}>{sf.label}</label>
                <SimpleField field={sf} value={item[sf.name]} onChange={(v) => update(i, sf.name, v)} refData={refData} readOnly={readOnly} />
              </div>
            ))}
          </div>
        </div>
      ))}
      {!readOnly && <button type="button" onClick={add} style={{ ...btnGhost, alignSelf: "flex-start" }}>+ Add {field.itemLabel || "item"}</button>}
    </div>
  );
}

function ImageField({ value, onChange, disabled }: { value: unknown; onChange: (v: unknown) => void; disabled?: boolean }) {
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");
  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true); setErr("");
    try { onChange(await adminUpload(await compressImage(file))); } catch (x) { setErr((x as Error).message); }
    setUploading(false); e.target.value = "";
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        {value ? <img src={String(value)} alt="" style={{ width: 90, height: 68, objectFit: "cover", borderRadius: 10, border: "1px solid rgba(12,52,70,0.12)" }} /> : <div style={{ width: 90, height: 68, borderRadius: 10, background: "#EAF2F6", display: "flex", alignItems: "center", justifyContent: "center", color: "#9BB3BF", fontSize: 22 }}>🖼️</div>}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {!disabled && <label style={{ background: "#1E92B8", color: "#fff", borderRadius: 10, padding: "10px 16px", fontSize: 13, fontWeight: 700, cursor: uploading ? "wait" : "pointer", opacity: uploading ? 0.7 : 1 }}>
            {uploading ? "Uploading…" : "⬆ Upload image"}
            <input type="file" accept="image/*" onChange={onFile} disabled={uploading} style={{ display: "none" }} />
          </label>}
          {value && !disabled ? <button type="button" onClick={() => onChange("")} style={btnGhost}>Remove</button> : null}
        </div>
      </div>
      <input type="text" value={String(value ?? "")} disabled={disabled} onChange={(e) => onChange(e.target.value)} placeholder="…or paste an image URL" style={{ ...inp, fontSize: 12.5 }} />
      {err && <div style={{ color: "#C0392B", fontSize: 12 }}>{err}</div>}
    </div>
  );
}

const card: React.CSSProperties = { background: "#fff", border: "1px solid rgba(12,52,70,0.08)", borderRadius: 16, padding: 24, boxShadow: "0 2px 10px rgba(12,52,70,0.04)" };
const cardHead: React.CSSProperties = { fontSize: 13, fontWeight: 800, color: "#1E92B8", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 18 };
const lbl: React.CSSProperties = { fontSize: 12.5, fontWeight: 700, color: "#46687A" };
const inp: React.CSSProperties = { border: "1.5px solid rgba(12,52,70,0.15)", borderRadius: 10, padding: "11px 13px", fontSize: 14, outline: "none", width: "100%", boxSizing: "border-box", background: "#fff" };
const btnPrimary: React.CSSProperties = { background: "linear-gradient(135deg, #30B6DE, #1E92B8)", color: "#fff", border: "none", borderRadius: 11, padding: "12px 22px", fontSize: 14, fontWeight: 800, cursor: "pointer" };
const btnGhost: React.CSSProperties = { background: "#fff", color: "#46687A", border: "1px solid rgba(12,52,70,0.2)", borderRadius: 11, padding: "11px 18px", fontSize: 14, fontWeight: 700, cursor: "pointer" };
const btnSmall: React.CSSProperties = { background: "none", border: "none", color: "#1E92B8", fontSize: 13, fontWeight: 700, cursor: "pointer", padding: "4px 8px" };
const btnMini: React.CSSProperties = { background: "#fff", border: "1px solid rgba(12,52,70,0.15)", borderRadius: 7, width: 28, height: 26, fontSize: 12, cursor: "pointer", color: "#46687A" };
const th: React.CSSProperties = { padding: "13px 16px", textAlign: "start", fontSize: 11.5, color: "#5B7A88", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.5px" };
const td: React.CSSProperties = { padding: "13px 16px", color: "#0C3446" };

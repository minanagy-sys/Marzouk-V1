"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { COLLECTIONS, type Field } from "@/lib/admin/config";
import { adminList, adminCreate, adminUpdate, adminDelete } from "@/lib/admin/client";

type Row = Record<string, unknown>;

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

  const load = useCallback(async () => {
    if (!col) return;
    setLoading(true); setError("");
    try { setRows(await adminList(table)); } catch (e) { setError((e as Error).message); }
    setLoading(false);
  }, [table, col]);

  useEffect(() => { load(); }, [load]);

  if (!col) return <div>Unknown collection. <Link href="/admin">← Back</Link></div>;

  const startNew = () => {
    const f: Row = {};
    col.fields.forEach((fld) => { f[fld.name] = fld.type === "boolean" ? true : fld.type === "number" ? 0 : ""; });
    setForm(f); setEditing("new");
  };
  const startEdit = (row: Row) => {
    const f: Row = { ...row };
    col.fields.forEach((fld) => {
      if (fld.type === "json") f[fld.name] = JSON.stringify(row[fld.name] ?? [], null, 2);
    });
    setForm(f); setEditing(row);
  };

  const save = async () => {
    setSaving(true); setError("");
    try {
      const payload: Row = {};
      col.fields.forEach((fld) => {
        let v = form[fld.name];
        if (fld.type === "json") { try { v = JSON.parse(String(v || "[]")); } catch { throw new Error(`Invalid JSON in ${fld.label}`); } }
        if (fld.type === "number") v = v === "" || v === null ? null : Number(v);
        payload[fld.name] = v;
      });
      if (editing === "new") await adminCreate(table, payload);
      else await adminUpdate(table, { id: (editing as Row).id, ...payload });
      setEditing(null); await load();
    } catch (e) { setError((e as Error).message); }
    setSaving(false);
  };

  const remove = async (row: Row) => {
    if (!confirm("Delete this item?")) return;
    try { await adminDelete(table, String(row.id)); await load(); } catch (e) { setError((e as Error).message); }
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <Link href="/admin" style={{ color: "#1E92B8", textDecoration: "none", fontSize: 13 }}>← Dashboard</Link>
          <h1 style={{ fontSize: 24, margin: "4px 0 0" }}>{col.label} <span style={{ color: "#8AA5B1", fontSize: 16 }}>{col.labelAr}</span></h1>
        </div>
        {!col.readOnly && editing === null && (
          <button onClick={startNew} style={btnPrimary}>+ New {col.singular}</button>
        )}
      </div>

      {error && <div style={{ background: "#FDECEA", color: "#C0392B", padding: 12, borderRadius: 10, marginBottom: 16, fontSize: 14 }}>{error}</div>}

      {editing !== null ? (
        <div style={{ background: "#fff", border: "1px solid rgba(12,52,70,0.1)", borderRadius: 14, padding: 24 }}>
          <h2 style={{ fontSize: 18, marginTop: 0 }}>{editing === "new" ? `New ${col.singular}` : `Edit ${col.singular}`}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {col.fields.map((fld) => (
              <FieldInput key={fld.name} field={fld} value={form[fld.name]} onChange={(v) => setForm((f) => ({ ...f, [fld.name]: v }))} readOnly={col.readOnly && fld.name !== "status"} />
            ))}
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
            <button onClick={save} disabled={saving} style={btnPrimary}>{saving ? "Saving…" : "Save"}</button>
            <button onClick={() => setEditing(null)} style={btnGhost}>Cancel</button>
          </div>
        </div>
      ) : loading ? (
        <div style={{ color: "#5B7A88" }}>Loading…</div>
      ) : rows.length === 0 ? (
        <div style={{ color: "#5B7A88" }}>No items yet.</div>
      ) : (
        <div style={{ background: "#fff", border: "1px solid rgba(12,52,70,0.1)", borderRadius: 14, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: "#F4FBFD", textAlign: "start" }}>
                {col.listColumns.map((c) => <th key={c} style={th}>{c}</th>)}
                <th style={th}></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={String(row.id) || i} style={{ borderTop: "1px solid rgba(12,52,70,0.07)" }}>
                  {col.listColumns.map((c) => <td key={c} style={td}>{formatCell(row[c])}</td>)}
                  <td style={{ ...td, textAlign: "end", whiteSpace: "nowrap" }}>
                    <button onClick={() => startEdit(row)} style={btnSmall}>Edit</button>
                    {!col.readOnly && <button onClick={() => remove(row)} style={{ ...btnSmall, color: "#C0392B" }}>Delete</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function formatCell(v: unknown) {
  if (typeof v === "boolean") return v ? "✓" : "—";
  if (v === null || v === undefined) return "—";
  const s = String(v);
  return s.length > 60 ? s.slice(0, 60) + "…" : s;
}

function FieldInput({ field, value, onChange, readOnly }: { field: Field; value: unknown; onChange: (v: unknown) => void; readOnly?: boolean }) {
  const full = field.type === "textarea" || field.type === "json";
  const wrap: React.CSSProperties = { gridColumn: full ? "1 / -1" : "auto", display: "flex", flexDirection: "column", gap: 6 };
  const label = <label style={{ fontSize: 12.5, fontWeight: 700, color: "#46687A" }}>{field.label}{field.help && <span style={{ fontWeight: 400, color: "#8AA5B1" }}> — {field.help}</span>}</label>;
  const disabled = readOnly;

  if (field.type === "boolean") {
    return <div style={{ ...wrap, flexDirection: "row", alignItems: "center", gap: 10 }}>
      <input type="checkbox" checked={!!value} disabled={disabled} onChange={(e) => onChange(e.target.checked)} />
      <span style={{ fontSize: 13.5, fontWeight: 700, color: "#46687A" }}>{field.label}</span>
    </div>;
  }
  if (field.type === "select") {
    return <div style={wrap}>{label}<select value={String(value ?? "")} disabled={disabled} onChange={(e) => onChange(e.target.value)} style={inp}>{(field.options || []).map((o) => <option key={o} value={o}>{o}</option>)}</select></div>;
  }
  if (field.type === "textarea" || field.type === "json") {
    return <div style={wrap}>{label}<textarea value={String(value ?? "")} disabled={disabled} onChange={(e) => onChange(e.target.value)} rows={field.type === "json" ? 6 : 3} style={{ ...inp, fontFamily: field.type === "json" ? "monospace" : "inherit", resize: "vertical" }} /></div>;
  }
  return <div style={wrap}>{label}<input type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"} value={String(value ?? "")} disabled={disabled} onChange={(e) => onChange(e.target.value)} style={inp} />
    {field.type === "image" && value ? <img src={String(value)} alt="" style={{ maxWidth: 120, borderRadius: 8, marginTop: 6 }} /> : null}
  </div>;
}

const inp: React.CSSProperties = { border: "1.5px solid rgba(12,52,70,0.15)", borderRadius: 9, padding: "10px 12px", fontSize: 14, outline: "none", width: "100%", boxSizing: "border-box" };
const btnPrimary: React.CSSProperties = { background: "#1E92B8", color: "#fff", border: "none", borderRadius: 9, padding: "10px 18px", fontSize: 14, fontWeight: 700, cursor: "pointer" };
const btnGhost: React.CSSProperties = { background: "#fff", color: "#46687A", border: "1px solid rgba(12,52,70,0.2)", borderRadius: 9, padding: "10px 18px", fontSize: 14, fontWeight: 700, cursor: "pointer" };
const btnSmall: React.CSSProperties = { background: "none", border: "none", color: "#1E92B8", fontSize: 13, fontWeight: 700, cursor: "pointer", padding: "4px 8px" };
const th: React.CSSProperties = { padding: "12px 14px", textAlign: "start", fontSize: 12, color: "#5B7A88", fontWeight: 700 };
const td: React.CSSProperties = { padding: "12px 14px", color: "#0C3446" };

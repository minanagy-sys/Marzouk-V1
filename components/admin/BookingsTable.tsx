"use client";

import { useCallback, useEffect, useState } from "react";
import { adminList, adminUpdate, adminDelete } from "@/lib/admin/client";

type Booking = { id?: string; name?: string; phone?: string; email?: string; service?: string; message?: string; status?: string; created_at?: string } & Record<string, unknown>;

// Booking pipeline statuses with friendly labels + colours.
const STATUSES: { value: string; label: string; color: string; bg: string }[] = [
  { value: "new", label: "Pending", color: "#8A6D0B", bg: "#FDF3D6" },
  { value: "contacted", label: "Contacted", color: "#1E6F8B", bg: "#E1F3FA" },
  { value: "confirmed", label: "Confirmed", color: "#0E5372", bg: "#DCEEF7" },
  { value: "done", label: "Completed", color: "#1E7B45", bg: "#DEF5E6" },
  { value: "cancelled", label: "Cancelled", color: "#B03A2E", bg: "#FBE4E1" },
];
const metaFor = (s: string) => STATUSES.find((x) => x.value === (s || "new")) ?? STATUSES[0];

export default function BookingsTable() {
  const [rows, setRows] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [openMsg, setOpenMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const data = (await adminList("bookings")) as Booking[];
      data.sort((a, b) => String(b.created_at ?? "").localeCompare(String(a.created_at ?? "")));
      setRows(data);
    } catch (e) { setError((e as Error).message); }
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const setStatus = async (row: Booking, status: string) => {
    setSavingId(String(row.id)); setError("");
    setRows((rs) => rs.map((r) => (r.id === row.id ? { ...r, status } : r)));
    try { await adminUpdate("bookings", { id: row.id, status }); }
    catch (e) { setError((e as Error).message); await load(); }
    setSavingId(null);
  };

  const remove = async (row: Booking) => {
    if (!confirm(`Delete the booking from "${row.name || "—"}"?`)) return;
    try { await adminDelete("bookings", String(row.id)); await load(); } catch (e) { setError((e as Error).message); }
  };

  const fmtDate = (s?: string) => {
    if (!s) return "—";
    const d = s.slice(0, 10);
    const time = s.slice(11, 16);
    return time ? `${d} · ${time}` : d;
  };

  return (
    <div>
      {/* status legend / summary */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {STATUSES.map((s) => {
            const n = rows.filter((r) => (r.status || "new") === s.value).length;
            return <span key={s.value} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: s.bg, color: s.color, borderRadius: 999, padding: "5px 12px", fontSize: 12.5, fontWeight: 800 }}>{s.label} <span style={{ opacity: 0.75 }}>{n}</span></span>;
          })}
        </div>
        <button onClick={load} style={btnGhost}>↻ Refresh</button>
      </div>

      {error && <div style={{ background: "#FDECEA", color: "#C0392B", padding: 14, borderRadius: 12, marginBottom: 16, fontSize: 14 }}>{error}</div>}

      {loading ? (
        <div style={{ color: "#5B7A88" }}>Loading…</div>
      ) : rows.length === 0 ? (
        <div style={{ background: "#fff", border: "1px solid rgba(12,52,70,0.08)", borderRadius: 16, padding: 40, textAlign: "center", color: "#5B7A88" }}>
          No bookings yet. Submissions from the contact form will appear here.
        </div>
      ) : (
        <div style={{ background: "#fff", border: "1px solid rgba(12,52,70,0.08)", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 12px rgba(12,52,70,0.05)" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
              <thead>
                <tr style={{ background: "linear-gradient(180deg,#0A3950,#0E5372)" }}>
                  <th style={th}>Date</th>
                  <th style={th}>Name</th>
                  <th style={th}>Phone</th>
                  <th style={th}>Email</th>
                  <th style={th}>Service</th>
                  <th style={th}>Message</th>
                  <th style={th}>Status</th>
                  <th style={{ ...th, textAlign: "end" }}></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => {
                  const m = metaFor(String(r.status ?? "new"));
                  const msg = String(r.message ?? "");
                  const expanded = openMsg === String(r.id);
                  return (
                    <tr key={String(r.id) || i} style={{ background: i % 2 ? "#F8FCFE" : "#fff", borderTop: "1px solid rgba(12,52,70,0.06)" }}>
                      <td style={{ ...td, whiteSpace: "nowrap", color: "#5B7A88", fontSize: 12.5 }}><span style={{ direction: "ltr", unicodeBidi: "isolate" }}>{fmtDate(r.created_at)}</span></td>
                      <td style={{ ...td, fontWeight: 800, color: "#0C3446" }}>{r.name || "—"}</td>
                      <td style={td}>{r.phone ? <a href={`tel:${r.phone}`} style={{ color: "#1E92B8", fontWeight: 700, direction: "ltr", unicodeBidi: "isolate", display: "inline-block" }}>{r.phone}</a> : "—"}</td>
                      <td style={td}>{r.email ? <a href={`mailto:${r.email}`} style={{ color: "#1E92B8", direction: "ltr", unicodeBidi: "isolate", display: "inline-block" }}>{r.email}</a> : <span style={{ color: "#B4C4CC" }}>—</span>}</td>
                      <td style={{ ...td, color: "#46687A" }}>{r.service || <span style={{ color: "#B4C4CC" }}>—</span>}</td>
                      <td style={{ ...td, maxWidth: 240 }}>
                        {msg ? (
                          <button onClick={() => setOpenMsg(expanded ? null : String(r.id))} title={msg} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "#46687A", textAlign: "start", fontSize: 13.5, fontFamily: "inherit", ...(expanded ? {} : { display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }) }}>{msg}</button>
                        ) : <span style={{ color: "#B4C4CC" }}>—</span>}
                      </td>
                      <td style={td}>
                        <select
                          value={r.status || "new"}
                          disabled={savingId === String(r.id)}
                          onChange={(e) => setStatus(r, e.target.value)}
                          style={{ appearance: "auto", border: `1.5px solid ${m.color}33`, background: m.bg, color: m.color, fontWeight: 800, fontSize: 13, borderRadius: 999, padding: "7px 12px", cursor: "pointer", outline: "none" }}
                        >
                          {STATUSES.map((s) => <option key={s.value} value={s.value} style={{ background: "#fff", color: "#0C3446" }}>{s.label}</option>)}
                        </select>
                      </td>
                      <td style={{ ...td, textAlign: "end", whiteSpace: "nowrap" }}>
                        <button onClick={() => remove(r)} style={{ background: "none", border: "none", color: "#C0392B", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Delete</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

const th: React.CSSProperties = { padding: "13px 16px", textAlign: "start", fontSize: 11.5, color: "rgba(255,255,255,0.85)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.5px", whiteSpace: "nowrap" };
const td: React.CSSProperties = { padding: "13px 16px", color: "#0C3446", fontSize: 14, verticalAlign: "middle" };
const btnGhost: React.CSSProperties = { background: "#fff", color: "#46687A", border: "1px solid rgba(12,52,70,0.2)", borderRadius: 11, padding: "9px 16px", fontSize: 13.5, fontWeight: 700, cursor: "pointer" };

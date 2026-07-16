"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { adminList } from "@/lib/admin/client";

type Booking = { id?: string; name?: string; phone?: string; service?: string; status?: string; created_at?: string } & Record<string, unknown>;

// Booking pipeline. `match` maps the raw status values to a friendly tile.
const TILES: { id: string; label: string; match: string[]; color: string; bg: string }[] = [
  { id: "pending", label: "Pending", match: ["new", "", "pending"], color: "#B8860B", bg: "linear-gradient(135deg,#FFF4D6,#FDE9B0)" },
  { id: "contacted", label: "Contacted", match: ["contacted"], color: "#1E92B8", bg: "linear-gradient(135deg,#E4F6FC,#CDEDF7)" },
  { id: "confirmed", label: "Confirmed", match: ["confirmed"], color: "#0E5372", bg: "linear-gradient(135deg,#DFF0F7,#BFE2F0)" },
  { id: "completed", label: "Completed", match: ["done", "completed"], color: "#1E7B45", bg: "linear-gradient(135deg,#DEF5E6,#BFEBCE)" },
  { id: "cancelled", label: "Cancelled", match: ["cancelled", "canceled"], color: "#B03A2E", bg: "linear-gradient(135deg,#FBE4E1,#F5CFC9)" },
];

const statusLabel = (s: string) => TILES.find((t) => t.match.includes((s || "").toLowerCase()))?.label ?? (s || "Pending");

export default function DashboardMetrics() {
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    adminList("bookings")
      .then((d) => setBookings(d as Booking[]))
      .catch((e) => setError((e as Error).message));
  }, []);

  const counts: Record<string, number> = {};
  for (const t of TILES) counts[t.id] = 0;
  (bookings ?? []).forEach((b) => {
    const tile = TILES.find((t) => t.match.includes((b.status || "").toLowerCase())) ?? TILES[0];
    counts[tile.id]++;
  });
  const total = bookings?.length ?? 0;
  const loading = bookings === null && !error;

  const recent = [...(bookings ?? [])]
    .sort((a, b) => String(b.created_at ?? "").localeCompare(String(a.created_at ?? "")))
    .slice(0, 5);

  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: "#8AA5B1", textTransform: "uppercase", letterSpacing: "1.5px" }}>Bookings overview</div>
        <Link href="/admin/bookings" style={{ fontSize: 13, color: "#1E92B8", textDecoration: "none", fontWeight: 700 }}>Open bookings →</Link>
      </div>

      {error ? (
        <div style={{ ...card, color: "#5B7A88", fontSize: 14 }}>
          Couldn&apos;t load bookings ({error}). They&apos;ll appear here once your database is connected and the booking form receives submissions.
        </div>
      ) : (
        <>
          {/* Total banner + status tiles */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 14 }}>
            <Link href="/admin/bookings" style={{ ...tileBase, background: "linear-gradient(135deg,#0A3950,#1E92B8)", color: "#fff", textDecoration: "none" }}>
              <span style={{ fontSize: 34, fontWeight: 800, lineHeight: 1 }}>{loading ? "…" : total}</span>
              <span style={{ fontSize: 13, fontWeight: 700, opacity: 0.9, marginTop: 8 }}>Total bookings</span>
            </Link>
            {TILES.map((t) => (
              <Link key={t.id} href="/admin/bookings" style={{ ...tileBase, background: t.bg, color: t.color, textDecoration: "none", border: "1px solid rgba(12,52,70,0.06)" }}>
                <span style={{ fontSize: 34, fontWeight: 800, lineHeight: 1 }}>{loading ? "…" : counts[t.id]}</span>
                <span style={{ fontSize: 13, fontWeight: 700, marginTop: 8 }}>{t.label}</span>
              </Link>
            ))}
          </div>

          {/* Recent bookings */}
          {!loading && total > 0 && (
            <div style={{ ...card, marginTop: 16, padding: 0, overflow: "hidden" }}>
              <div style={{ padding: "14px 18px", fontSize: 13, fontWeight: 800, color: "#0C3446", borderBottom: "1px solid rgba(12,52,70,0.07)" }}>Latest requests</div>
              {recent.map((b, i) => (
                <Link key={String(b.id) || i} href="/admin/bookings" style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 18px", borderBottom: i < recent.length - 1 ? "1px solid rgba(12,52,70,0.05)" : "none", textDecoration: "none", color: "#0C3446" }}>
                  <span style={{ fontWeight: 700, fontSize: 14, minWidth: 0, flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{b.name || "—"}</span>
                  <span style={{ fontSize: 13, color: "#5B7A88", flex: 1, minWidth: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{b.service || ""}</span>
                  <span style={{ fontSize: 12, color: "#8AA5B1", direction: "ltr" }}>{String(b.created_at ?? "").slice(0, 10)}</span>
                  <span style={{ fontSize: 11.5, fontWeight: 800, color: "#0E5372", background: "#EAF7FB", borderRadius: 999, padding: "3px 11px", whiteSpace: "nowrap" }}>{statusLabel(String(b.status ?? ""))}</span>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

const card: React.CSSProperties = { background: "#fff", border: "1px solid rgba(12,52,70,0.08)", borderRadius: 16, padding: 20, boxShadow: "0 2px 10px rgba(12,52,70,0.04)" };
const tileBase: React.CSSProperties = { borderRadius: 16, padding: "20px 18px", display: "flex", flexDirection: "column", alignItems: "flex-start", boxShadow: "0 2px 10px rgba(12,52,70,0.04)" };

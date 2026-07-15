import Link from "next/link";
import { COLLECTIONS, COLLECTION_KEYS } from "@/lib/admin/config";

export default function AdminDashboard() {
  return (
    <div>
      <h1 style={{ fontSize: 26, margin: "0 0 6px" }}>Dashboard</h1>
      <p style={{ color: "#5B7A88", margin: "0 0 28px" }}>Manage every part of the website. Changes are saved to Supabase and appear on the live site.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
        {COLLECTION_KEYS.map((key) => {
          const c = COLLECTIONS[key];
          return (
            <Link key={key} href={`/admin/${key}`} style={{ background: "#fff", border: "1px solid rgba(12,52,70,0.1)", borderRadius: 14, padding: "22px 20px", textDecoration: "none", color: "#0C3446", boxShadow: "0 4px 14px rgba(12,52,70,0.04)" }}>
              <div style={{ fontSize: 18, fontWeight: 800 }}>{c.label}</div>
              <div style={{ fontSize: 14, color: "#5B7A88", marginTop: 2 }}>{c.labelAr}</div>
              {c.readOnly && <div style={{ fontSize: 11, color: "#8AA5B1", marginTop: 8 }}>read-only</div>}
            </Link>
          );
        })}
      </div>
      <div style={{ marginTop: 30, background: "#EAF7FB", border: "1px solid rgba(48,182,222,0.4)", borderRadius: 12, padding: 18, fontSize: 13.5, color: "#46687A" }}>
        Tip: first time? Use the <strong>Seed</strong> button to import the current site content into your database.
        <div style={{ marginTop: 10 }}>
          <Link href="/admin/seed" style={{ display: "inline-block", background: "#1E92B8", color: "#fff", padding: "8px 18px", borderRadius: 8, textDecoration: "none", fontWeight: 700 }}>Seed database →</Link>
        </div>
      </div>
    </div>
  );
}

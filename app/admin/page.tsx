import Link from "next/link";
import { COLLECTIONS, COLLECTION_KEYS, GROUPS } from "@/lib/admin/config";

export default function AdminDashboard() {
  return (
    <div>
      <h1 style={{ fontSize: 30, margin: "0 0 4px" }}>Welcome back 👋</h1>
      <p style={{ color: "#5B7A88", margin: "0 0 28px" }}>Manage every part of the website. Changes save to your database and appear on the live site right away.</p>

      {GROUPS.map((g) => {
        const items = COLLECTION_KEYS.filter((k) => COLLECTIONS[k].group === g);
        if (!items.length) return null;
        return (
          <div key={g} style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#8AA5B1", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 12 }}>{g}</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(215px, 1fr))", gap: 16 }}>
              {items.map((k) => {
                const c = COLLECTIONS[k];
                return (
                  <Link key={k} href={`/admin/${k}`} style={{ background: "#fff", border: "1px solid rgba(12,52,70,0.08)", borderRadius: 16, padding: "22px 20px", textDecoration: "none", color: "#0C3446", boxShadow: "0 2px 10px rgba(12,52,70,0.04)", display: "flex", alignItems: "center", gap: 14 }}>
                    <span style={{ fontSize: 26, width: 46, height: 46, borderRadius: 12, background: "#EAF7FB", display: "flex", alignItems: "center", justifyContent: "center" }}>{c.icon}</span>
                    <span style={{ display: "flex", flexDirection: "column" }}>
                      <span style={{ fontSize: 16, fontWeight: 800 }}>{c.label}</span>
                      <span style={{ fontSize: 13, color: "#5B7A88" }}>{c.labelAr}{c.readOnly ? " · read-only" : ""}</span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}

      <div style={{ marginTop: 12, background: "linear-gradient(135deg, #0A3950, #1E92B8)", borderRadius: 16, padding: 24, color: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 17 }}>First time setup</div>
          <div style={{ fontSize: 13.5, color: "rgba(255,255,255,0.85)", marginTop: 4 }}>Import the built-in site content into your database (safe to run once).</div>
        </div>
        <Link href="/admin/seed" style={{ background: "#fff", color: "#0A3950", padding: "10px 22px", borderRadius: 10, textDecoration: "none", fontWeight: 800 }}>Seed database →</Link>
      </div>
    </div>
  );
}

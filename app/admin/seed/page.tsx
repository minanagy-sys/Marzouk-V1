"use client";

import Link from "next/link";
import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

export default function SeedPage() {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Record<string, string> | null>(null);
  const [error, setError] = useState("");

  const seed = async () => {
    setBusy(true); setError(""); setResult(null);
    try {
      const { data } = await supabaseBrowser().auth.getSession();
      const res = await fetch("/api/admin/seed", { method: "POST", headers: { Authorization: `Bearer ${data.session?.access_token ?? ""}` } });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "failed");
      setResult(json.results);
    } catch (e) { setError((e as Error).message); }
    setBusy(false);
  };

  return (
    <div>
      <Link href="/admin" style={{ color: "#1E92B8", textDecoration: "none", fontSize: 13 }}>← Dashboard</Link>
      <h1 style={{ fontSize: 24, margin: "4px 0 10px" }}>Seed database</h1>
      <p style={{ color: "#5B7A88", maxWidth: 640, lineHeight: 1.8 }}>
        Imports the current built-in site content (services, cases, blogs, celebrities, testimonials, clinics, media)
        into your Supabase database. Safe to run once. Slug-based tables are upserted; list tables are only filled if empty.
      </p>
      <button onClick={seed} disabled={busy} style={{ background: "#1E92B8", color: "#fff", border: "none", borderRadius: 9, padding: "12px 22px", fontSize: 15, fontWeight: 700, cursor: "pointer", opacity: busy ? 0.7 : 1 }}>
        {busy ? "Seeding…" : "Run seed"}
      </button>
      {error && <div style={{ background: "#FDECEA", color: "#C0392B", padding: 12, borderRadius: 10, marginTop: 16 }}>{error}</div>}
      {result && (
        <div style={{ background: "#fff", border: "1px solid rgba(12,52,70,0.1)", borderRadius: 12, padding: 20, marginTop: 20 }}>
          <h3 style={{ marginTop: 0 }}>Results</h3>
          <ul style={{ lineHeight: 1.9, color: "#46687A" }}>
            {Object.entries(result).map(([k, v]) => <li key={k}><strong>{k}</strong>: {v}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Session } from "@supabase/supabase-js";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

const CY = "#1E92B8";

export default function AdminGate({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const configured = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

  useEffect(() => {
    if (!configured) { setLoading(false); return; }
    const sb = supabaseBrowser();
    sb.auth.getSession().then(({ data }) => { setSession(data.session); setLoading(false); });
    const { data: sub } = sb.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, [configured]);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setErr("");
    const { error } = await supabaseBrowser().auth.signInWithPassword({ email, password });
    if (error) setErr(error.message);
    setBusy(false);
  };

  const signOut = async () => { await supabaseBrowser().auth.signOut(); };

  const shell = (inner: React.ReactNode) => (
    <div style={{ fontFamily: "system-ui, sans-serif", minHeight: "100vh", background: "#F4FBFD", color: "#0C3446" }}>
      {inner}
    </div>
  );

  if (loading) return shell(<div style={{ padding: 60, textAlign: "center", color: "#5B7A88" }}>Loading…</div>);

  if (!configured) {
    return shell(
      <div style={{ maxWidth: 560, margin: "80px auto", background: "#fff", border: "1px solid rgba(12,52,70,0.1)", borderRadius: 16, padding: 40 }}>
        <h1 style={{ fontSize: 22 }}>Admin not configured</h1>
        <p style={{ color: "#5B7A88", lineHeight: 1.8 }}>
          Set <code>NEXT_PUBLIC_SUPABASE_URL</code>, <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> and{" "}
          <code>SUPABASE_SERVICE_ROLE_KEY</code> in your environment (e.g. Vercel), then create an admin
          user in Supabase → Authentication → Users.
        </p>
      </div>
    );
  }

  if (!session) {
    return shell(
      <div style={{ maxWidth: 420, margin: "90px auto", background: "#fff", border: "1px solid rgba(12,52,70,0.1)", borderRadius: 16, padding: 40, boxShadow: "0 14px 40px rgba(12,52,70,0.08)" }}>
        <h1 style={{ fontSize: 24, margin: "0 0 6px" }}>لوحة التحكم · Admin</h1>
        <p style={{ color: "#5B7A88", margin: "0 0 24px", fontSize: 14 }}>Sign in to manage the website content.</p>
        <form onSubmit={signIn} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={inp} />
          <input type="password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={inp} />
          {err && <div style={{ color: "#C0392B", fontSize: 13 }}>{err}</div>}
          <button type="submit" disabled={busy} style={{ background: CY, color: "#fff", border: "none", borderRadius: 10, padding: "13px", fontSize: 15, fontWeight: 700, cursor: "pointer", opacity: busy ? 0.7 : 1 }}>
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    );
  }

  return shell(
    <>
      <header style={{ background: "#04202E", color: "#fff", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
        <Link href="/admin" style={{ color: "#fff", fontWeight: 800, fontSize: 17, textDecoration: "none" }}>د. أحمد مرزوق · Admin</Link>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link href="/" target="_blank" style={{ color: "#8FE0F7", fontSize: 13.5, textDecoration: "none" }}>View site ↗</Link>
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>{session.user.email}</span>
          <button onClick={signOut} style={{ background: "rgba(255,255,255,0.12)", color: "#fff", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 8, padding: "6px 14px", fontSize: 13, cursor: "pointer" }}>Sign out</button>
        </div>
      </header>
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px 80px" }}>{children}</main>
    </>
  );
}

const inp: React.CSSProperties = { border: "1.5px solid rgba(12,52,70,0.15)", borderRadius: 10, padding: "12px 14px", fontSize: 15, outline: "none" };

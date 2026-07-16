"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { COLLECTIONS, NAV_TREE } from "@/lib/admin/config";

const CY = "#30B6DE";

export default function AdminGate({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [openParents, setOpenParents] = useState<Record<string, boolean>>({});
  const pathname = usePathname();

  const configured = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

  useEffect(() => {
    if (!configured) { setLoading(false); return; }
    const sb = supabaseBrowser();
    sb.auth.getSession().then(({ data }) => { setSession(data.session); setLoading(false); });
    const { data: sub } = sb.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, [configured]);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setErr("");
    const { error } = await supabaseBrowser().auth.signInWithPassword({ email, password });
    if (error) setErr(error.message);
    setBusy(false);
  };
  const signOut = async () => { await supabaseBrowser().auth.signOut(); };

  const page = (inner: React.ReactNode) => (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", minHeight: "100vh", background: "#EEF6FA", color: "#0C3446" }}>{inner}</div>
  );

  if (loading) return page(<div style={{ padding: 80, textAlign: "center", color: "#5B7A88" }}>Loading…</div>);

  if (!configured) {
    return page(
      <div style={{ maxWidth: 560, margin: "80px auto", background: "#fff", border: "1px solid rgba(12,52,70,0.1)", borderRadius: 18, padding: 40 }}>
        <h1 style={{ fontSize: 22 }}>Admin not configured</h1>
        <p style={{ color: "#5B7A88", lineHeight: 1.8 }}>Set <code>NEXT_PUBLIC_SUPABASE_URL</code>, <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> and <code>SUPABASE_SERVICE_ROLE_KEY</code> in your environment, then create an admin user in Supabase → Authentication → Users.</p>
      </div>
    );
  }

  if (!session) {
    return page(
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(140deg, #04202E 0%, #0A3950 55%, #0E5372 100%)" }}>
        <div style={{ width: 420, maxWidth: "92vw", background: "#fff", borderRadius: 22, padding: 42, boxShadow: "0 30px 80px rgba(4,32,46,0.45)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
            <span style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg, #30B6DE, #0E5372)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 20 }}>Dr</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: 18 }}>لوحة التحكم</div>
              <div style={{ fontSize: 13, color: "#5B7A88" }}>Dr. Ahmed Marzouk · Admin</div>
            </div>
          </div>
          <form onSubmit={signIn} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={inp} />
            <input type="password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={inp} />
            {err && <div style={{ color: "#C0392B", fontSize: 13 }}>{err}</div>}
            <button type="submit" disabled={busy} style={{ background: "linear-gradient(135deg, #30B6DE, #1E92B8)", color: "#fff", border: "none", borderRadius: 12, padding: "14px", fontSize: 15, fontWeight: 800, cursor: "pointer", opacity: busy ? 0.7 : 1 }}>
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const activeKey = pathname?.split("/")[2] || "";

  const navItem = (href: string, icon: string, label: string, sub: string, active: boolean) => (
    <Link key={href} href={href} style={{
      display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 12, textDecoration: "none",
      background: active ? "rgba(48,182,222,0.18)" : "transparent",
      color: active ? "#8FE0F7" : "rgba(255,255,255,0.82)",
      border: active ? "1px solid rgba(48,182,222,0.4)" : "1px solid transparent",
    }}>
      <span style={{ fontSize: 18, width: 22, textAlign: "center" }}>{icon}</span>
      <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.25 }}>
        <span style={{ fontSize: 14, fontWeight: 700 }}>{label}</span>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>{sub}</span>
      </span>
    </Link>
  );

  return page(
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* SIDEBAR */}
      <aside style={{ width: 268, flexShrink: 0, background: "linear-gradient(180deg, #04202E 0%, #0A3950 100%)", padding: "22px 16px", position: "sticky", top: 0, height: "100vh", overflowY: "auto", display: "flex", flexDirection: "column", gap: 6 }}>
        <Link href="/admin" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", padding: "4px 10px 18px" }}>
          <span style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, #30B6DE, #0E5372)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 18 }}>Dr</span>
          <span style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 15 }}>د. أحمد مرزوق</span>
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>Control Panel</span>
          </span>
        </Link>

        {navItem("/admin", "🏠", "Dashboard", "Overview", activeKey === "")}

        {NAV_TREE.map((p) => {
          const containsActive = p.children.includes(activeKey);
          const open = openParents[p.label] ?? containsActive;
          return (
            <div key={p.label} style={{ marginTop: 6 }}>
              <button
                onClick={() => setOpenParents((s) => ({ ...s, [p.label]: !open }))}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 12, background: containsActive ? "rgba(48,182,222,0.12)" : "transparent", border: "1px solid transparent", color: "rgba(255,255,255,0.85)", cursor: "pointer", fontFamily: "inherit" }}
              >
                <span style={{ fontSize: 18, width: 22, textAlign: "center" }}>{p.icon}</span>
                <span style={{ flex: 1, textAlign: "start", fontSize: 14, fontWeight: 700 }}>{p.label}<span style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>  {p.labelAr}</span></span>
                <span style={{ transform: open ? "rotate(90deg)" : "none", transition: "transform 0.2s", color: "rgba(255,255,255,0.5)", fontSize: 16 }}>›</span>
              </button>
              {open && (
                <div style={{ display: "flex", flexDirection: "column", gap: 3, paddingInlineStart: 16, marginTop: 3 }}>
                  {p.children.map((k) => navItem(`/admin/${k}`, COLLECTIONS[k].icon, COLLECTIONS[k].label, COLLECTIONS[k].labelAr, activeKey === k))}
                </div>
              )}
            </div>
          );
        })}

        <div style={{ marginTop: "auto", paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", flexDirection: "column", gap: 10 }}>
          <Link href="/" target="_blank" style={{ color: "#8FE0F7", fontSize: 13, textDecoration: "none", padding: "0 12px" }}>↗ View website</Link>
          <div style={{ padding: "0 12px", color: "rgba(255,255,255,0.45)", fontSize: 11, wordBreak: "break-all" }}>{session.user.email}</div>
          <button onClick={signOut} style={{ margin: "0 12px", background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 10, padding: "9px", fontSize: 13, cursor: "pointer" }}>Sign out</button>
        </div>
      </aside>

      {/* CONTENT */}
      <main style={{ flex: 1, minWidth: 0, padding: "34px 40px 80px", maxWidth: 1200 }}>{children}</main>
    </div>
  );
}

const inp: React.CSSProperties = { border: "1.5px solid rgba(12,52,70,0.15)", borderRadius: 12, padding: "13px 15px", fontSize: 15, outline: "none" };

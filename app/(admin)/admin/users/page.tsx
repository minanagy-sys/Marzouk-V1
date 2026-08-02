"use client";

import { useCallback, useEffect, useState } from "react";

type User = {
  id: string;
  email: string;
  name: string | null;
  role: "admin" | "editor";
  is_active: number | boolean;
  created_at: string;
};

const CY = "#30B6DE";
const api = (init?: RequestInit) => ({ credentials: "include" as const, ...init });

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [error, setError] = useState("");

  // add form
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"admin" | "editor">("editor");
  const [password, setPassword] = useState("");
  const [adding, setAdding] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/users", api());
    if (res.status === 403) { setForbidden(true); setLoading(false); return; }
    const json = await res.json().catch(() => ({}));
    if (!res.ok) { setError(json.error || "failed"); setLoading(false); return; }
    setUsers(json.data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const addUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    setError("");
    const res = await fetch("/api/admin/users", api({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name, role, password }),
    }));
    const json = await res.json().catch(() => ({}));
    setAdding(false);
    if (!res.ok) { setError(json.error || "failed"); return; }
    setEmail(""); setName(""); setRole("editor"); setPassword("");
    load();
  };

  const patch = async (id: string, body: Record<string, unknown>) => {
    setError("");
    const res = await fetch("/api/admin/users", api({
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...body }),
    }));
    const json = await res.json().catch(() => ({}));
    if (!res.ok) { setError(json.error || "failed"); return; }
    load();
  };

  const resetPassword = (u: User) => {
    const pw = window.prompt(`New password for ${u.email} (min 6 characters):`);
    if (pw) patch(u.id, { password: pw });
  };

  const remove = async (u: User) => {
    if (!window.confirm(`Delete ${u.email}? This cannot be undone.`)) return;
    setError("");
    const res = await fetch(`/api/admin/users?id=${encodeURIComponent(u.id)}`, api({ method: "DELETE" }));
    const json = await res.json().catch(() => ({}));
    if (!res.ok) { setError(json.error || "failed"); return; }
    load();
  };

  if (forbidden) {
    return (
      <div style={{ ...card, maxWidth: 560 }}>
        <h1 style={{ fontSize: 22, margin: 0 }}>Admins only</h1>
        <p style={{ color: "#5B7A88", lineHeight: 1.8 }}>Only users with the <b>admin</b> role can manage accounts.</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      <div>
        <h1 style={{ fontSize: 26, margin: 0 }}>Users</h1>
        <p style={{ color: "#5B7A88", margin: "6px 0 0" }}>Add teammates and set their role. <b>Admin</b> can manage users; <b>editor</b> can edit content.</p>
      </div>

      {error && <div style={{ background: "#FDEDEC", color: "#C0392B", border: "1px solid #F5B7B1", borderRadius: 10, padding: "10px 14px", fontSize: 14 }}>{error}</div>}

      {/* Add user */}
      <form onSubmit={addUser} style={{ ...card, display: "grid", gridTemplateColumns: "1.3fr 1fr 0.8fr 1fr auto", gap: 12, alignItems: "end" }}>
        <Field label="Email"><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={inp} /></Field>
        <Field label="Name"><input value={name} onChange={(e) => setName(e.target.value)} style={inp} /></Field>
        <Field label="Role">
          <select value={role} onChange={(e) => setRole(e.target.value as "admin" | "editor")} style={inp}>
            <option value="editor">editor</option>
            <option value="admin">admin</option>
          </select>
        </Field>
        <Field label="Password"><input type="text" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="min 6 chars" style={inp} /></Field>
        <button type="submit" disabled={adding} style={btn}>{adding ? "Adding…" : "+ Add user"}</button>
      </form>

      {/* List */}
      <div style={{ ...card, padding: 0, overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "#5B7A88" }}>Loading…</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: "#F4FBFD", color: "#46687A", textAlign: "start" }}>
                {["User", "Role", "Status", "Added", ""].map((h) => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "start", fontWeight: 700 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const active = u.is_active === 1 || u.is_active === true;
                return (
                  <tr key={u.id} style={{ borderTop: "1px solid rgba(12,52,70,0.08)" }}>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ fontWeight: 700 }}>{u.name || "—"}</div>
                      <div style={{ color: "#5B7A88", fontSize: 12.5 }}>{u.email}</div>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <select value={u.role} onChange={(e) => patch(u.id, { role: e.target.value })} style={{ ...inp, padding: "7px 10px" }}>
                        <option value="editor">editor</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ display: "inline-block", padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: 700, background: active ? "rgba(39,174,96,0.14)" : "rgba(192,57,43,0.12)", color: active ? "#1E8449" : "#C0392B" }}>
                        {active ? "active" : "inactive"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", color: "#5B7A88", fontSize: 12.5 }}>{String(u.created_at || "").slice(0, 10)}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", flexWrap: "wrap" }}>
                        <button onClick={() => resetPassword(u)} style={ghost}>Reset password</button>
                        <button onClick={() => patch(u.id, { is_active: !active })} style={ghost}>{active ? "Deactivate" : "Activate"}</button>
                        <button onClick={() => remove(u)} style={{ ...ghost, color: "#C0392B", borderColor: "#F5B7B1" }}>Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!users.length && (
                <tr><td colSpan={5} style={{ padding: 30, textAlign: "center", color: "#5B7A88" }}>No users yet.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <span style={{ fontSize: 12, fontWeight: 700, color: "#46687A" }}>{label}</span>
      {children}
    </label>
  );
}

const card: React.CSSProperties = { background: "#fff", border: "1px solid rgba(12,52,70,0.1)", borderRadius: 16, padding: 22 };
const inp: React.CSSProperties = { border: "1.5px solid rgba(12,52,70,0.15)", borderRadius: 10, padding: "10px 12px", fontSize: 14, outline: "none", width: "100%", background: "#fff" };
const btn: React.CSSProperties = { background: `linear-gradient(135deg, ${CY}, #1E92B8)`, color: "#fff", border: "none", borderRadius: 10, padding: "11px 18px", fontSize: 14, fontWeight: 800, cursor: "pointer", whiteSpace: "nowrap" };
const ghost: React.CSSProperties = { background: "#fff", border: "1px solid rgba(12,52,70,0.18)", color: "#46687A", borderRadius: 8, padding: "7px 12px", fontSize: 12.5, fontWeight: 700, cursor: "pointer" };

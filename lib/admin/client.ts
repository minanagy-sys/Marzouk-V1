"use client";

import { supabaseBrowser } from "@/lib/supabaseBrowser";

async function token(): Promise<string> {
  const { data } = await supabaseBrowser().auth.getSession();
  return data.session?.access_token ?? "";
}

export async function adminList(table: string) {
  const res = await fetch(`/api/admin/${table}`, { headers: { Authorization: `Bearer ${await token()}` } });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "failed");
  return json.data as Record<string, unknown>[];
}

export async function adminCreate(table: string, body: Record<string, unknown>) {
  const res = await fetch(`/api/admin/${table}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${await token()}` },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "failed");
  return json.data;
}

export async function adminUpdate(table: string, body: Record<string, unknown>) {
  const res = await fetch(`/api/admin/${table}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${await token()}` },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "failed");
  return json.data;
}

export async function adminUpload(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch(`/api/admin/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${await token()}` },
    body: fd,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "upload_failed");
  return json.url as string;
}

export async function adminDelete(table: string, id: string) {
  const res = await fetch(`/api/admin/${table}?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${await token()}` },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "failed");
  return json;
}

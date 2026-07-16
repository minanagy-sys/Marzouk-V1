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
  // The server may return a non-JSON body (e.g. a "Request Entity Too Large"
  // plain-text 413 from the host) — read as text and parse defensively.
  const text = await res.text();
  let json: Record<string, unknown> = {};
  try { json = text ? JSON.parse(text) : {}; } catch { /* non-JSON error body */ }
  if (!res.ok) {
    if (res.status === 413) throw new Error("Image is too large. Please choose an image under ~4 MB (it will be optimized automatically).");
    throw new Error((json.error as string) || `upload_failed (${res.status})`);
  }
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

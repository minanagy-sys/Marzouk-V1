"use client";

import { useEffect, useRef, useState } from "react";
import { adminUpload } from "@/lib/admin/client";
import { compressImage } from "@/lib/admin/image";

type Cmd = { icon: string; title: string; run: () => void };

/**
 * Lightweight rich-text editor (headings, bold/italic, lists, links, images).
 * Produces semantic HTML (h2/h3/p/ul/img…) stored as a string and rendered on
 * the public pages — good for SEO structure. Dependency-free; works RTL & LTR.
 */
export default function RichTextField({ value, onChange, disabled }: { value: unknown; onChange: (v: string) => void; disabled?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== (value ?? "")) {
      ref.current.innerHTML = String(value ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const exec = (command: string, arg?: string) => {
    ref.current?.focus();
    document.execCommand(command, false, arg);
    if (ref.current) onChange(ref.current.innerHTML);
  };

  const insertHtml = (html: string) => {
    ref.current?.focus();
    document.execCommand("insertHTML", false, html);
    if (ref.current) onChange(ref.current.innerHTML);
  };

  const onPickImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; e.target.value = "";
    if (!file) return;
    setUploading(true); setErr("");
    try {
      const url = await adminUpload(await compressImage(file));
      const alt = (prompt("Image description (alt text — good for SEO):", "") || "").replace(/"/g, "&quot;");
      insertHtml(`<img src="${url}" alt="${alt}" />`);
    } catch (x) { setErr((x as Error).message); }
    setUploading(false);
  };

  const cmds: Cmd[] = [
    { icon: "H2", title: "Heading", run: () => exec("formatBlock", "H2") },
    { icon: "H3", title: "Subheading", run: () => exec("formatBlock", "H3") },
    { icon: "¶", title: "Paragraph", run: () => exec("formatBlock", "P") },
    { icon: "B", title: "Bold", run: () => exec("bold") },
    { icon: "I", title: "Italic", run: () => exec("italic") },
    { icon: "• List", title: "Bullet list", run: () => exec("insertUnorderedList") },
    { icon: "1. List", title: "Numbered list", run: () => exec("insertOrderedList") },
    { icon: "🔗", title: "Link", run: () => { const u = prompt("Link URL:"); if (u) exec("createLink", u); } },
    { icon: uploading ? "⏳" : "🖼 Image", title: "Insert image", run: () => { if (!uploading) fileRef.current?.click(); } },
    { icon: "⌫", title: "Clear formatting", run: () => exec("removeFormat") },
  ];

  return (
    <div style={{ border: "1.5px solid rgba(12,52,70,0.15)", borderRadius: 10, overflow: "hidden", background: "#fff" }}>
      {!disabled && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, padding: 8, borderBottom: "1px solid rgba(12,52,70,0.1)", background: "#F4FBFD" }}>
          {cmds.map((c) => (
            <button key={c.title} type="button" title={c.title} onMouseDown={(e) => { e.preventDefault(); c.run(); }} style={{ minWidth: 30, height: 30, padding: "0 8px", border: "1px solid rgba(12,52,70,0.15)", borderRadius: 7, background: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 700, color: "#46687A" }}>
              {c.icon}
            </button>
          ))}
          <input ref={fileRef} type="file" accept="image/*" onChange={onPickImage} style={{ display: "none" }} />
        </div>
      )}
      {err && <div style={{ color: "#C0392B", fontSize: 12, padding: "6px 12px", background: "#FDECEA" }}>{err}</div>}
      <div
        ref={ref}
        contentEditable={!disabled}
        dir="auto"
        onInput={() => ref.current && onChange(ref.current.innerHTML)}
        className="article-body"
        style={{ minHeight: 180, padding: "14px 16px", fontSize: 15, lineHeight: 1.9, outline: "none", color: "#0C3446" }}
        suppressContentEditableWarning
      />
    </div>
  );
}

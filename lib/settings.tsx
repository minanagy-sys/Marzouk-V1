"use client";

import { createContext, useContext } from "react";
import type { Lang } from "@/lib/lang";

export type SettingsDict = Record<string, { ar: string; en: string }>;
const Ctx = createContext<SettingsDict>({});

/**
 * Holds the editable text blocks (`site_content`) so the header, footer and any
 * page text can be overridden from the admin "Site text" section.
 *
 * The data is loaded ON THE SERVER (see the site layout) and passed in as
 * `initial` — the browser never queries the database.
 */
export function SettingsProvider({ initial = {}, children }: { initial?: SettingsDict; children: React.ReactNode }) {
  return <Ctx.Provider value={initial}>{children}</Ctx.Provider>;
}

/** Returns st(key, lang, fallback) — the edited value, or the fallback text. */
export function useSetting() {
  const dict = useContext(Ctx);
  return (key: string, lang: Lang, fallback: string): string => {
    const v = dict[key];
    if (!v) return fallback;
    return (lang === "ar" ? v.ar : v.en) || fallback;
  };
}

/**
 * Overlays admin edits onto a page's text object. Each field `k` in `fallback`
 * can be overridden from the "Site text" admin section with key `${prefix}.${k}`.
 * Returns the same shape as `fallback`, so pages need no other changes.
 */
export function usePageText<T extends Record<string, string>>(prefix: string, lang: Lang, fallback: T): T {
  const dict = useContext(Ctx);
  const out = { ...fallback } as Record<string, string>;
  for (const k of Object.keys(fallback)) {
    const v = dict[`${prefix}.${k}`];
    if (v) {
      const val = lang === "ar" ? v.ar : v.en;
      if (val) out[k] = val;
    }
  }
  return out as T;
}

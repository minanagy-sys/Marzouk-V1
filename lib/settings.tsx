"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Lang } from "@/lib/lang";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

type Dict = Record<string, { ar: string; en: string }>;
const Ctx = createContext<Dict>({});

/**
 * Loads all editable text blocks from Supabase `site_content` once, so the
 * header, footer and any page text can be edited from the admin "Site text" section.
 */
export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [dict, setDict] = useState<Dict>({});
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;
    supabaseBrowser()
      .from("site_content")
      .select("key,value_ar,value_en")
      .then(({ data }) => {
        if (!data) return;
        const d: Dict = {};
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        data.forEach((r: any) => { d[r.key] = { ar: r.value_ar || "", en: r.value_en || "" }; });
        setDict(d);
      });
  }, []);
  return <Ctx.Provider value={dict}>{children}</Ctx.Provider>;
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

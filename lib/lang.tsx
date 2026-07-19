"use client";

import { createContext, useContext, useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export type Lang = "ar" | "en";

interface LangCtx {
  lang: Lang;
  isAr: boolean;
  dir: "rtl" | "ltr";
  /** Prefix an internal path with the current locale, e.g. lp("/services") → "/ar/services". */
  lp: (path: string) => string;
  /** Detail pages with localized slugs set this so the toggle jumps to the right URL. */
  setAltUrl: (url: string | null) => void;
  toggleLang: () => void;
  setLang: (l: Lang) => void;
}

const Ctx = createContext<LangCtx | null>(null);

export function LangProvider({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  const isAr = lang === "ar";
  const dir: "rtl" | "ltr" = isAr ? "rtl" : "ltr";
  const pathname = usePathname();
  const router = useRouter();
  const [altUrl, setAltUrl] = useState<string | null>(null);

  // A new page owns its own alt URL.
  useEffect(() => { setAltUrl(null); }, [pathname]);

  // Remember the choice (used to pick a language on the bare "/" entry).
  useEffect(() => {
    try {
      localStorage.setItem("dam-lang", lang);
      document.cookie = `dam-lang=${lang}; path=/; max-age=31536000`;
    } catch {}
  }, [lang]);

  const lp = useCallback((path: string) => {
    if (!path || /^(https?:|mailto:|tel:|#)/.test(path)) return path;
    const clean = path.startsWith("/") ? path : "/" + path;
    return `/${lang}${clean === "/" ? "" : clean}`;
  }, [lang]);

  const go = useCallback((target: Lang) => {
    if (target === lang) return;
    if (altUrl) { router.push(altUrl); return; }
    const rest = (pathname || "/").replace(/^\/(ar|en)(?=\/|$)/, "") || "/";
    router.push(`/${target}${rest === "/" ? "" : rest}`);
  }, [lang, altUrl, pathname, router]);

  const toggleLang = useCallback(() => go(isAr ? "en" : "ar"), [go, isAr]);
  const setLang = useCallback((l: Lang) => go(l), [go]);

  return (
    <Ctx.Provider value={{ lang, isAr, dir, lp, setAltUrl, toggleLang, setLang }}>
      {children}
    </Ctx.Provider>
  );
}

export function useLang(): LangCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}

"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

export type Lang = "ar" | "en";

interface LangCtx {
  lang: Lang;
  isAr: boolean;
  dir: "rtl" | "ltr";
  setLang: (l: Lang) => void;
  toggleLang: () => void;
}

const Ctx = createContext<LangCtx | null>(null);

export function LangProvider({ children }: { children: React.ReactNode }) {
  // Mirror the original default: Arabic first, remembered via localStorage.
  const [lang, setLangState] = useState<Lang>("ar");

  // Read the saved preference on mount (client only, like the original).
  useEffect(() => {
    try {
      const saved = localStorage.getItem("dam-lang") as Lang | null;
      if (saved === "ar" || saved === "en") setLangState(saved);
    } catch {}
  }, []);

  // Keep <html> lang/dir in sync so the whole document flips RTL/LTR.
  useEffect(() => {
    const el = document.documentElement;
    el.lang = lang;
    el.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    try {
      localStorage.setItem("dam-lang", l);
    } catch {}
    setLangState(l);
  }, []);

  const toggleLang = useCallback(() => {
    setLangState((prev) => {
      const next = prev === "ar" ? "en" : "ar";
      try {
        localStorage.setItem("dam-lang", next);
      } catch {}
      return next;
    });
  }, []);

  const isAr = lang === "ar";
  const dir = isAr ? "rtl" : "ltr";

  return (
    <Ctx.Provider value={{ lang, isAr, dir, setLang, toggleLang }}>
      {children}
    </Ctx.Provider>
  );
}

export function useLang(): LangCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}

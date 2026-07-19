import { SITE } from "@/lib/site";

/**
 * Build canonical + hreflang alternates for a page that exists in both
 * languages. Pass the locale-relative paths (starting with "/") for each.
 */
export function altLangs(lang: "ar" | "en", arPath: string, enPath: string) {
  const ar = `${SITE.url}/ar${arPath}`;
  const en = `${SITE.url}/en${enPath}`;
  return {
    canonical: lang === "en" ? en : ar,
    languages: { ar, en, "x-default": ar },
  };
}

import { NextResponse, type NextRequest } from "next/server";
import redirects from "./redirect-map.json";

const LOCALES = ["ar", "en"] as const;

// Pre-migration URL recovery map (3 tiers). See redirect-map.json.
const EXACT: Record<string, string> = redirects.exact;
const STATIC: Record<string, string> = redirects.static;
const SECTION: Record<string, string> = redirects.sectionFallback;

/**
 * Resolve a legacy pre-migration path to its permanent (301) target, or null.
 * Legacy paths are mixed-case and percent-encoded Arabic (/SurgeryTipDetail/…
 * and /surgerytipdetail/… both ranked), so every path is decoded, lowercased
 * and de-trailing-slashed before lookup.
 *
 *   1. exact   — a specific restored article
 *   2. static  — an old standalone page
 *   3. section — any other legacy URL falls back to its section hub (hub only;
 *                an unknown slug can't map to a real page, so we never append it)
 *
 * The homepage ("/") is intentionally left to the locale router below so the
 * cookie-based /ar–/en preference is preserved.
 */
function legacyTarget(pathname: string): string | null {
  let p: string;
  try { p = decodeURIComponent(pathname); } catch { p = pathname; }
  p = p.toLowerCase().replace(/\/+$/, "") || "/";
  if (p === "/") return null;

  let target = EXACT[p] ?? STATIC[p];
  if (!target) {
    const hub = SECTION[p.split("/")[1]];
    if (hub) target = hub;
  }
  return target ?? null;
}

/**
 * Two responsibilities, in order:
 *   1. Recover legacy pre-migration URLs with 301s (SEO recovery).
 *   2. Locale routing for everything else ("/" and unprefixed links → /ar|/en).
 * /ar and /en routes are never touched.
 */
export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Never touch already-localized routes.
  const hasLocale = LOCALES.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (hasLocale) return NextResponse.next();

  // 1. Legacy pre-migration URL recovery — permanent (301) redirects.
  // Build the target from scratch (not nextUrl.clone) so an incoming trailing
  // slash never bleeds into the destination, e.g. "/whoweare/" -> "/ar/about".
  const legacy = legacyTarget(pathname);
  if (legacy) {
    const dest = new URL(legacy, req.url);
    dest.search = search;
    return NextResponse.redirect(dest, 301);
  }

  // 2. Locale routing (unchanged): "/" → preferred locale, unprefixed → /<lang>/<path>.
  const pref = req.cookies.get("dam-lang")?.value;
  const lang = pref === "en" ? "en" : "ar";
  const url = req.nextUrl.clone();
  url.pathname = pathname === "/" ? `/${lang}` : `/${lang}${pathname}`;
  return NextResponse.redirect(url, 307);
}

export const config = {
  // Skip already-localized routes, API, admin, assets and any file with an
  // extension. Legacy recovery paths (percent-encoded Arabic, /whoweare, …)
  // have no extension, so they reach the middleware.
  matcher: ["/((?!ar(?:/|$)|en(?:/|$)|api|admin|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|assets|.*\\..*).*)"],
};

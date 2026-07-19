import { NextResponse, type NextRequest } from "next/server";

const LOCALES = ["ar", "en"] as const;

/**
 * Locale routing: every public page lives under /ar/... or /en/....
 * - "/"              → /<preferred> (cookie) or /ar
 * - unprefixed paths → /<preferred>/<path> (keeps old links working)
 * /admin, /api, assets and metadata files are excluded via `config.matcher`.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hasLocale = LOCALES.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (hasLocale) return NextResponse.next();

  const pref = req.cookies.get("dam-lang")?.value;
  const lang = pref === "en" ? "en" : "ar";
  const url = req.nextUrl.clone();
  url.pathname = pathname === "/" ? `/${lang}` : `/${lang}${pathname}`;
  return NextResponse.redirect(url, 307);
}

export const config = {
  // Skip paths that already have a locale (/ar, /en) so the middleware never
  // touches (and re-encodes) non-ASCII slug URLs — it only handles "/" and
  // legacy unprefixed links.
  matcher: ["/((?!ar(?:/|$)|en(?:/|$)|api|admin|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|assets|.*\\..*).*)"],
};

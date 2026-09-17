import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Security headers applied to every response.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The original design files live here; keep Next from trying to compile them.
  eslint: { ignoreDuringBuilds: true },
  poweredByHeader: false,
  // Let the middleware own trailing-slash handling so legacy URLs like
  // "/whoweare/" 301 straight to their target instead of first 308-ing to
  // "/whoweare" (which would create a redirect chain).
  skipTrailingSlashRedirect: true,
  // Pin the workspace root so a stray lockfile in the home folder doesn't confuse
  // Next's file tracing (silences the "multiple lockfiles" build warning).
  outputFileTracingRoot: __dirname,
  // Serve the brand logo at the well-known /favicon.ico path so a bare
  // /favicon.ico request returns an image (not the app's HTML 404 page).
  async rewrites() {
    return [{ source: "/favicon.ico", destination: "/brand/favicon.ico" }];
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // Page documents must NOT be stored by shared caches (LiteSpeed/CDN). Those
      // caches ignore the `Vary: RSC` header and would otherwise serve the RSC
      // flight payload (raw text) in place of the HTML on some refreshes. Static
      // assets under /_next/static and /uploads keep their own long cache.
      {
        source: "/:lang(ar|en)/:path*",
        headers: [{ key: "Cache-Control", value: "private, no-cache, no-store, max-age=0, must-revalidate" }],
      },
      {
        source: "/:lang(ar|en)",
        headers: [{ key: "Cache-Control", value: "private, no-cache, no-store, max-age=0, must-revalidate" }],
      },
    ];
  },
};

export default nextConfig;

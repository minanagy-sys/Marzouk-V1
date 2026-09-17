import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import { resolveBrand } from "@/lib/storage";

export const runtime = "nodejs";

// Brand assets are our own trusted files (logo, favicons, OG image, manifest
// icons), so SVG is allowed here (unlike user uploads). Served from a
// persistent folder outside the build output — set BRAND_DIR to a path next to
// uploads (default: "<UPLOAD_DIR>/brand") so they survive every redeploy.
const CONTENT_TYPE: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
  svg: "image/svg+xml",
  ico: "image/x-icon",
  webmanifest: "application/manifest+json",
  json: "application/json",
  txt: "text/plain; charset=utf-8",
};

export async function GET(_req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: segments } = await params;
  const file = resolveBrand(segments || []);
  if (!file) return new NextResponse("Not found", { status: 404 });
  try {
    const data = await fs.readFile(file);
    const ext = (file.split(".").pop() || "").toLowerCase();
    const type = CONTENT_TYPE[ext] || "application/octet-stream";
    return new NextResponse(new Uint8Array(data), {
      headers: {
        "Content-Type": type,
        "X-Content-Type-Options": "nosniff",
        // Shorter than uploads (immutable) so brand tweaks propagate within a day.
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}

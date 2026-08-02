import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import { resolveUpload, CONTENT_TYPE_BY_EXT } from "@/lib/storage";

export const runtime = "nodejs";

/** Serves uploaded images from disk with long-lived caching. */
export async function GET(_req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: segments } = await params;
  const file = resolveUpload(segments || []);
  if (!file) return new NextResponse("Not found", { status: 404 });
  try {
    const data = await fs.readFile(file);
    const ext = (file.split(".").pop() || "").toLowerCase();
    const type = CONTENT_TYPE_BY_EXT[ext] || "application/octet-stream";
    return new NextResponse(new Uint8Array(data), {
      headers: {
        "Content-Type": type,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}

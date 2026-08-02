import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

/**
 * Local disk storage for uploaded images (replaces Supabase Storage).
 * Files are written under UPLOAD_DIR and served by app/uploads/[...path]/route.ts.
 *
 * Env:
 *   UPLOAD_DIR          absolute or cwd-relative folder (default: ./uploads)
 *   UPLOAD_PUBLIC_BASE  URL prefix the files are served from (default: /uploads)
 *
 * On Hostinger keep UPLOAD_DIR on a persistent path outside the build output so
 * images survive redeploys (e.g. /home/USER/uploads).
 */
export function uploadDir(): string {
  const dir = process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");
  return path.isAbsolute(dir) ? dir : path.join(process.cwd(), dir);
}

function publicBase(): string {
  return (process.env.UPLOAD_PUBLIC_BASE || "/uploads").replace(/\/$/, "");
}

const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
  "image/svg+xml": "svg",
};

export const CONTENT_TYPE_BY_EXT: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  avif: "image/avif",
  svg: "image/svg+xml",
};

/** Save an uploaded File to disk and return its public URL. */
export async function saveUpload(file: File): Promise<string> {
  const dir = uploadDir();
  await fs.mkdir(dir, { recursive: true });
  const nameExt = (file.name.split(".").pop() || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const ext = EXT_BY_TYPE[file.type] || nameExt || "jpg";
  const filename = `${Date.now()}-${randomUUID().slice(0, 8)}.${ext}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(dir, filename), bytes);
  return `${publicBase()}/${filename}`;
}

/** Safely resolve a requested upload path to an absolute file path (no traversal). */
export function resolveUpload(segments: string[]): string | null {
  const dir = uploadDir();
  const target = path.normalize(path.join(dir, ...segments));
  if (target !== dir && !target.startsWith(dir + path.sep)) return null;
  return target;
}

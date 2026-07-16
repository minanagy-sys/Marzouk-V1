// Client-side image downscale + compression before upload, so large photos
// fit under the hosting request-body limit (~4.5 MB on Vercel) and load fast.

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const im = new Image();
    im.onload = () => resolve(im);
    im.onerror = reject;
    im.src = src;
  });

const readDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result as string);
    fr.onerror = reject;
    fr.readAsDataURL(file);
  });

const toBlob = (canvas: HTMLCanvasElement, type: string, q: number) =>
  new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, q));

/**
 * Returns a resized/compressed copy of the image (max 1600px on the longest
 * side). Vector/animated formats (svg, gif) and already-small files are left
 * untouched. Falls back to the original if anything goes wrong.
 */
export async function compressImage(file: File, maxDim = 1600, quality = 0.82): Promise<File> {
  if (typeof document === "undefined") return file;
  if (!file.type.startsWith("image/")) return file;
  if (file.type === "image/svg+xml" || file.type === "image/gif") return file;

  try {
    const img = await loadImage(await readDataUrl(file));
    let { width, height } = img;
    if (!width || !height) return file;
    if (width > maxDim || height > maxDim) {
      const scale = Math.min(maxDim / width, maxDim / height);
      width = Math.round(width * scale);
      height = Math.round(height * scale);
    }
    const canvas = document.createElement("canvas");
    canvas.width = width; canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(img, 0, 0, width, height);

    // Prefer WebP (keeps transparency, smaller); fall back to JPEG.
    let outType = "image/webp";
    let blob = await toBlob(canvas, outType, quality);
    if (!blob) { outType = "image/jpeg"; blob = await toBlob(canvas, outType, quality); }
    if (!blob || blob.size >= file.size) return file; // no gain — keep original

    const ext = outType === "image/webp" ? "webp" : "jpg";
    const base = file.name.replace(/\.[^.]+$/, "") || "image";
    return new File([blob], `${base}.${ext}`, { type: outType });
  } catch {
    return file;
  }
}

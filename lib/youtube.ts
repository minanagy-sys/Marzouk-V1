/** Extract a YouTube video id from common URL formats. */
export function ytId(url?: string): string | null {
  if (!url) return null;
  const m = url.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/);
  return m ? m[1] : null;
}

/** Thumbnail image URL for a YouTube video URL (empty string if not YT). */
export function ytThumb(url?: string): string {
  const id = ytId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "";
}

// Turn a title into a clean URL slug: lowercases Latin text, turns spaces and
// punctuation into single dashes, and keeps Arabic letters (valid, SEO-friendly
// in URLs). e.g. "Fear prevented me for 11 years" → "fear-prevented-me-for-11-years".
export function slugify(input: string): string {
  return String(input || "")
    .trim()
    .toLowerCase()
    .replace(/['"'"`]/g, "")                    // drop quotes/apostrophes
    .replace(/[^a-z0-9؀-ۿ]+/g, "-")   // anything not latin/number/arabic → dash
    .replace(/-{2,}/g, "-")                      // collapse repeats
    .replace(/^-+|-+$/g, "");                    // trim leading/trailing dashes
}

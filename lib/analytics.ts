// Lightweight GA4 event helper. Safe on the server and when gtag hasn't loaded
// (e.g. no GA4 Measurement ID set, or an ad-blocker removed the tag): it simply
// no-ops. Analytics must never break the UI, so every call is guarded.
type GtagParams = Record<string, string | number | boolean | undefined>;

export function trackEvent(name: string, params: GtagParams = {}): void {
  if (typeof window === "undefined") return;
  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  try {
    w.gtag?.("event", name, params);
  } catch {
    /* swallow — a tracking failure must never affect the page */
  }
}

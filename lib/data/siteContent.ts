import { getServiceClient } from "@/lib/supabase";
import type { SettingsDict } from "@/lib/settings";

/**
 * Loads all `site_content` rows server-side into the {key: {ar, en}} shape the
 * SettingsProvider expects. Returns {} when the DB isn't configured (the app
 * then uses each element's built-in fallback text).
 */
export async function getSiteContent(): Promise<SettingsDict> {
  const db = getServiceClient();
  if (!db) return {};
  const { data, error } = await db.from("site_content").select("key,value_ar,value_en");
  if (error || !data) return {};
  const out: SettingsDict = {};
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  (data as any[]).forEach((r) => {
    out[r.key] = { ar: r.value_ar || "", en: r.value_en || "" };
  });
  return out;
}

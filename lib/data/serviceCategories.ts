import type { ServiceCategory } from "./types";
import { getServiceClient, getAnonClient } from "@/lib/supabase";

/**
 * Parent services / categories used to group and filter the services page.
 * Falls back to an empty list when Supabase isn't configured (the services
 * page simply hides the filter chips in that case).
 */
export async function getServiceCategories(): Promise<ServiceCategory[]> {
  const supabase = getServiceClient() ?? getAnonClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("service_categories")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });
  if (error || !data) return [];
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  return data.map((c: any) => ({ id: c.id, slug: c.slug, name: { ar: c.name_ar ?? "", en: c.name_en ?? "" } }));
}

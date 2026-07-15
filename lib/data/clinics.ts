import type { Clinic } from "./types";
import { getServiceClient, getAnonClient } from "@/lib/supabase";
import { contactContent } from "@/lib/content/contact";

export function clinicsSeed(): Clinic[] {
  const ar = contactContent("ar");
  const en = contactContent("en");
  return ar.pins.map((p, i) => ({
    id: String(i),
    phone: p.phone,
    mapsUrl: p.url,
    name: { ar: p.name, en: en.pins[i]?.name ?? "" },
    address: { ar: p.address, en: en.pins[i]?.address ?? "" },
    hours: { ar: ar.clinics[i]?.hours ?? "", en: en.clinics[i]?.hours ?? "" },
    area: { ar: p.area, en: en.pins[i]?.area ?? "" },
  }));
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function rowTo(r: any): Clinic {
  return {
    id: r.id, phone: r.phone ?? "", mapsUrl: r.maps_url ?? "",
    name: { ar: r.name_ar ?? "", en: r.name_en ?? "" },
    address: { ar: r.address_ar ?? "", en: r.address_en ?? "" },
    hours: { ar: r.hours_ar ?? "", en: r.hours_en ?? "" },
    area: { ar: r.area_ar ?? "", en: r.area_en ?? "" },
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export async function getClinics(): Promise<Clinic[]> {
  const supabase = getServiceClient() ?? getAnonClient();
  if (!supabase) return clinicsSeed();
  const { data, error } = await supabase.from("clinics").select("*").eq("is_published", true).order("sort_order", { ascending: true });
  if (error || !data || data.length === 0) return clinicsSeed();
  return data.map(rowTo);
}

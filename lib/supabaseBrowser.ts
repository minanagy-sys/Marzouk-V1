"use client";

import { createClient, SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

/** Browser Supabase client (anon key) with persisted auth session — for admin login. */
export function supabaseBrowser(): SupabaseClient {
  if (client) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  client = createClient(url, anon, {
    auth: { persistSession: true, autoRefreshToken: true },
  });
  return client;
}

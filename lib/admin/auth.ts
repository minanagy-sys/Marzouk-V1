import { createClient } from "@supabase/supabase-js";

/**
 * Verifies the request carries a valid Supabase auth session (Bearer token).
 * Any authenticated Supabase user is treated as an admin — create admins in
 * Supabase Dashboard → Authentication → Users.
 */
export async function verifyAdmin(request: Request): Promise<boolean> {
  const header = request.headers.get("authorization") || "";
  const token = header.replace(/^Bearer\s+/i, "").trim();
  if (!token) return false;
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return false;
  const client = createClient(url, anon, { auth: { persistSession: false } });
  const { data, error } = await client.auth.getUser(token);
  return !!data?.user && !error;
}

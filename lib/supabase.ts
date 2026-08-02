/**
 * Data access layer (Hostinger / MySQL build).
 *
 * These keep the original `getServiceClient` / `getAnonClient` names so the
 * entire `lib/data/*` layer and the API routes need no import changes. Both now
 * return a MySQL-backed, Supabase-compatible query client (see lib/dbClient.ts).
 *
 * Required env (in .env / Hostinger — never committed):
 *   MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE
 *
 * When the DB isn't configured the clients return null, so every getter falls
 * back to seed content and the site still renders (same as before).
 */
import { getDbClient, type DbClient } from "./dbClient";

/** Server-side client (full read/write). Used by pages and the admin API. */
export function getServiceClient(): DbClient | null {
  return getDbClient();
}

/**
 * Public read client. With MySQL there is no separate anon key — reads are made
 * server-side and callers already filter to published rows, so this is the same
 * client. Kept for API compatibility with the old Supabase code paths.
 */
export function getAnonClient(): DbClient | null {
  return getDbClient();
}

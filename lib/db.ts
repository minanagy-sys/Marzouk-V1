import mysql from "mysql2/promise";

/**
 * Shared MySQL connection pool (Hostinger). Configured from env:
 *   MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE
 * Returns null when env isn't set, so the app falls back to seed content
 * (mirrors the old Supabase behaviour — the site never hard-fails).
 */
let pool: mysql.Pool | null | undefined;

export function getPool(): mysql.Pool | null {
  if (pool !== undefined) return pool;
  const host = process.env.MYSQL_HOST;
  const database = process.env.MYSQL_DATABASE;
  const user = process.env.MYSQL_USER;
  if (!host || !database || !user) {
    pool = null;
    return pool;
  }
  pool = mysql.createPool({
    host,
    port: Number(process.env.MYSQL_PORT || 3306),
    user,
    password: process.env.MYSQL_PASSWORD || "",
    database,
    waitForConnections: true,
    connectionLimit: Number(process.env.MYSQL_POOL_SIZE || 8),
    queueLimit: 0,
    charset: "utf8mb4_general_ci",
    // Normalise MySQL types to what the app expects:
    //  - TINYINT(1)  -> JS boolean (is_published, show_on_home, …)
    //  - JSON        -> parsed JS value (sections, benefits, faq, blog body)
    //  - DATE/TIME   -> ISO-ish string (kept as text; the app never date-maths)
    typeCast(field, next) {
      if (field.type === "TINY" && field.length === 1) {
        const s = field.string();
        return s === null ? null : s !== "0";
      }
      if (field.type === "JSON") {
        const s = field.string();
        if (s === null || s === "") return null;
        try {
          return JSON.parse(s);
        } catch {
          return s;
        }
      }
      if (field.type === "DATE" || field.type === "DATETIME" || field.type === "TIMESTAMP") {
        return field.string();
      }
      return next();
    },
  });
  return pool;
}

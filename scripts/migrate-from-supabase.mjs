// One-time migration: Supabase (Postgres + Storage) -> Hostinger (MySQL + disk).
//
// It copies every table row-for-row and downloads any Supabase Storage image
// (in image columns AND embedded in rich-text/JSON) to UPLOAD_DIR, rewriting the
// URLs to the local /uploads path.
//
// Required env:
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY      (read side)
//   MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE  (write side)
//   UPLOAD_DIR (default ./uploads), UPLOAD_PUBLIC_BASE (default /uploads)
//
// Run AFTER creating the MySQL schema:
//   env $(grep -v '^#' .env.migrate | xargs) node scripts/migrate-from-supabase.mjs
import mysql from "mysql2/promise";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

const SB = process.env.SUPABASE_URL?.replace(/\/$/, "");
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SB || !KEY) throw new Error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");

const UP_DIR = path.isAbsolute(process.env.UPLOAD_DIR || "")
  ? process.env.UPLOAD_DIR
  : path.join(process.cwd(), process.env.UPLOAD_DIR || "uploads");
const UP_BASE = (process.env.UPLOAD_PUBLIC_BASE || "/uploads").replace(/\/$/, "");
const STORAGE = `${SB}/storage/v1/object/public/`;

// Tables to copy, in FK-safe order (parents before children).
const TABLES = [
  "site_content",
  "service_categories",
  "blog_categories",
  "services",
  "cases",
  "blog_posts",
  "media_items",
  "celebrities",
  "testimonials",
  "clinics",
  "bookings",
  "hero_slides",
  "hero_stats",
  "value_items",
  "feature_items",
  "instagram_posts",
];

const conn = await mysql.createConnection({
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT || 3306),
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.MYSQL_DATABASE,
  multipleStatements: false,
});

await fs.mkdir(UP_DIR, { recursive: true });
const imageMap = new Map(); // supabase url -> local url

async function localizeImages(value) {
  if (value == null) return value;
  if (typeof value === "string") {
    if (!value.includes("/storage/v1/object/public/")) return value;
    let out = value;
    const urls = out.match(/https?:\/\/[^\s"')]+\/storage\/v1\/object\/public\/[^\s"')]+/g) || [];
    for (const url of urls) {
      let local = imageMap.get(url);
      if (!local) {
        local = await download(url);
        imageMap.set(url, local);
      }
      out = out.split(url).join(local);
    }
    return out;
  }
  if (Array.isArray(value)) return Promise.all(value.map(localizeImages));
  if (typeof value === "object") {
    const o = {};
    for (const k of Object.keys(value)) o[k] = await localizeImages(value[k]);
    return o;
  }
  return value;
}

async function download(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return url; // leave as-is if it can't be fetched
    const buf = Buffer.from(await res.arrayBuffer());
    const ext = (url.split(".").pop() || "jpg").split(/[?#]/)[0].toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
    const name = `${Date.now()}-${randomUUID().slice(0, 8)}.${ext}`;
    await fs.writeFile(path.join(UP_DIR, name), buf);
    return `${UP_BASE}/${name}`;
  } catch {
    return url;
  }
}

function toMysqlDate(v) {
  if (!v) return v;
  const d = new Date(v);
  return isNaN(d) ? v : d.toISOString().slice(0, 19).replace("T", " ");
}

async function fetchAll(table) {
  const rows = [];
  const pageSize = 1000;
  for (let from = 0; ; from += pageSize) {
    const res = await fetch(`${SB}/rest/v1/${table}?select=*`, {
      headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, Range: `${from}-${from + pageSize - 1}` },
    });
    if (!res.ok) {
      if (res.status === 404) return null; // table doesn't exist in Supabase
      throw new Error(`${table}: ${res.status} ${await res.text()}`);
    }
    const batch = await res.json();
    rows.push(...batch);
    if (batch.length < pageSize) break;
  }
  return rows;
}

for (const table of TABLES) {
  let rows;
  try {
    rows = await fetchAll(table);
  } catch (e) {
    console.warn(`! skip ${table}: ${e.message}`);
    continue;
  }
  if (!rows) {
    console.warn(`- ${table}: not found in Supabase, skipping`);
    continue;
  }
  if (!rows.length) {
    console.log(`· ${table}: 0 rows`);
    continue;
  }
  let n = 0;
  for (const raw of rows) {
    const row = await localizeImages(raw);
    const keys = Object.keys(row);
    const params = keys.map((k) => {
      let v = row[k];
      if (v !== null && typeof v === "object") return JSON.stringify(v);
      if (/_at$/.test(k) || k === "published_date") return toMysqlDate(v);
      return v;
    });
    const cols = keys.map((k) => "`" + k + "`").join(", ");
    const upd = keys.filter((k) => k !== "id").map((k) => "`" + k + "` = VALUES(`" + k + "`)").join(", ");
    const sql = `INSERT INTO \`${table}\` (${cols}) VALUES (${keys.map(() => "?").join(", ")})` +
      (upd ? ` ON DUPLICATE KEY UPDATE ${upd}` : "");
    try {
      await conn.execute(sql, params);
      n++;
    } catch (e) {
      console.warn(`  ! ${table} row ${raw.id}: ${e.message}`);
    }
  }
  console.log(`✔ ${table}: ${n}/${rows.length} rows`);
}

console.log(`\nDone. Images downloaded: ${imageMap.size}. Upload dir: ${UP_DIR}`);
await conn.end();

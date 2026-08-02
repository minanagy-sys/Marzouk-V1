// Create (or update) an admin user in MySQL.
//
//   node scripts/create-admin.mjs <email> <password> [name] [role]
//   role: admin | editor   (default: admin)
//
// Reads DB config from env: MYSQL_HOST, MYSQL_PORT, MYSQL_USER,
// MYSQL_PASSWORD, MYSQL_DATABASE. Load your .env however you like, e.g.:
//   env $(grep -v '^#' .env | xargs) node scripts/create-admin.mjs a@b.com pass
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

const [, , email, password, name = "", role = "admin"] = process.argv;
if (!email || !password) {
  console.error("Usage: node scripts/create-admin.mjs <email> <password> [name] [role]");
  process.exit(1);
}
if (!["admin", "editor"].includes(role)) {
  console.error("role must be 'admin' or 'editor'");
  process.exit(1);
}

const conn = await mysql.createConnection({
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT || 3306),
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.MYSQL_DATABASE,
});

const hash = await bcrypt.hash(password, 10);
const em = email.trim().toLowerCase();

await conn.execute(
  `INSERT INTO admin_users (id, email, name, password_hash, role, is_active)
   VALUES (?, ?, ?, ?, ?, 1)
   ON DUPLICATE KEY UPDATE name = VALUES(name), password_hash = VALUES(password_hash), role = VALUES(role), is_active = 1`,
  [randomUUID(), em, name, hash, role],
);

console.log(`✔ admin user ready: ${em} (${role})`);
await conn.end();

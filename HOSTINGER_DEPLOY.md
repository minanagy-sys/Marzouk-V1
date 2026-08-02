# Hostinger (Node.js + MySQL) deployment

This branch (`hostinger-mysql`) runs the site on **Hostinger Node.js hosting with
MySQL** instead of Supabase. `main` stays on Supabase as a backup.

What changed vs `main`:

| Area | Supabase (main) | Hostinger (this branch) |
|---|---|---|
| Database | Supabase Postgres | **MySQL** (`lib/db.ts` + `lib/dbClient.ts` adapter) |
| Auth | Supabase Auth | **JWT in an httpOnly cookie**, users in `admin_users` (roles: admin/editor) |
| Image storage | Supabase Storage | **Server disk** (`UPLOAD_DIR`), served by `/uploads/*` |
| Site text load | fetched in the browser | **loaded on the server (SSR)** and passed as props |

The whole `lib/data/*` layer is unchanged — the MySQL adapter mimics the small
slice of the supabase-js API it used.

---

## 1. Create the database
In Hostinger → **Databases → MySQL**, create a database + user, and note the
host/port/name/user/password.

Import the schema (phpMyAdmin → SQL tab, or the MySQL client):
```
mysql/schema.sql
```

## 2. Configure the app
Copy `.env.hostinger.example` to `.env` and fill it in:
```
MYSQL_HOST=...  MYSQL_PORT=3306  MYSQL_USER=...  MYSQL_PASSWORD=...  MYSQL_DATABASE=...
ADMIN_JWT_SECRET=<long random string>
UPLOAD_DIR=/home/<user>/uploads          # persistent path outside the build
UPLOAD_PUBLIC_BASE=/uploads
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```
Generate a JWT secret:
```
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

## 3. Migrate your data + images from Supabase (one time)
Add your Supabase read credentials to the env, then:
```
# schema must already be imported (step 1)
env $(grep -v '^#' .env | xargs) SUPABASE_URL=https://xxxx.supabase.co \
  SUPABASE_SERVICE_ROLE_KEY=xxxx node scripts/migrate-from-supabase.mjs
```
This copies every table and **downloads all Supabase-Storage images** (including
ones embedded in rich text) into `UPLOAD_DIR`, rewriting the URLs to `/uploads/…`.

## 4. Create an admin login
```
env $(grep -v '^#' .env | xargs) node scripts/create-admin.mjs you@email.com "yourpassword" "Your Name" admin
```
Add more users any time (role `admin` or `editor`).

## 5. Build & run
```
npm install
npm run build
npm run start        # or use Hostinger's Node app manager / PM2
```
Point Hostinger's Node app at the project, start command `npm run start`,
and set the same environment variables in its dashboard.

---

### Notes
- **Uploads persistence:** keep `UPLOAD_DIR` on a path that survives redeploys
  (e.g. `/home/<user>/uploads`), not inside the project's build output.
- **Security:** all DB access is server-side; the admin API checks the signed
  cookie on every request and enforces the user's role. There is no public DB
  access (this replaces Supabase Row-Level Security).
- **Caching:** pages use ISR (`revalidate = 3600`). Admin edits call
  `revalidatePath` so they appear immediately, same as before.
- **Rollback:** `main` is the untouched Supabase version.

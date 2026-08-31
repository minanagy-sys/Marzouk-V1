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

### 3b. Produce one `.sql` file to import in Hostinger phpMyAdmin
The migration in step 3 writes into whatever MySQL you point it at. To get a
single portable file you can upload in **phpMyAdmin**, run the migration into a
**local** MySQL/MariaDB first, then dump it. Do this on a machine that can reach
Supabase (e.g. your Mac):

```
# 0) create the schema in your LOCAL db (once)
mysql -h 127.0.0.1 -u <local_user> -p <local_db> < mysql/schema.sql

# 1) pull the LATEST Supabase data + images into your local db
#    (.env.migrate points MYSQL_* at 127.0.0.1 and has SUPABASE_URL / KEY)
env $(grep -v '^#' .env.migrate | xargs) node scripts/migrate-from-supabase.mjs

# 2) make sure the social-link rows exist (TikTok/Snapchat included)
mysql -h 127.0.0.1 -u <local_user> -p <local_db> < mysql/contact_social_settings.sql

# 3) (optional) create the admin login locally so it ships inside the dump
env $(grep -v '^#' .env.migrate | xargs) node scripts/create-admin.mjs you@email.com "password" "Your Name" admin

# 4) dump schema + data to ONE file for phpMyAdmin
env $(grep -v '^#' .env.migrate | xargs) npm run db:dump   # -> marzouk_data.sql
#   (Homebrew MariaDB: if `mysqldump` is missing, use `mariadb-dump` with the same flags)
```

Then, on Hostinger:
1. **phpMyAdmin → your database → Import →** upload `marzouk_data.sql`. It's
   text-only (small), so it imports quickly. This one file creates every table
   and all content — you do **not** need to import `schema.sql` separately.
2. **Upload the images:** copy your local `uploads/` folder to the server's
   `UPLOAD_DIR` (e.g. `/home/<user>/uploads`). Images are on disk, not in the
   `.sql`, so this step is required for photos to show.
3. Set the app's `.env` (`MYSQL_*` for the Hostinger DB, `UPLOAD_DIR`, secrets),
   then build & run (step 5).

> Re-syncing later: repeat steps 1–4 to regenerate `marzouk_data.sql` from the
> newest Supabase data, re-import it, and re-upload any new `uploads/` files.

### 3c. Apply the SEO/settings upgrades (run once after importing)
After importing `marzouk_data.sql`, run these in phpMyAdmin (SQL tab) to add the
new blog SEO columns and seed the editable SEO/analytics rows. All are
insert-if-missing / `IF NOT EXISTS`, so they're safe to re-run:
```
mysql/upgrade_seo.sql            # adds blog keywords/alt/faq/schema_type columns
mysql/seo_settings.sql           # per-page SEO title/description + share image
mysql/integrations_settings.sql  # GA4 / GTM / Meta Pixel / Search Console / Bing
mysql/contact_social_settings.sql# phones, email, WhatsApp, social links
```
Then everything is editable from **Admin → Site text** (SEO / Integrations /
Footer) and per blog post — no code changes.

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

# Dr. Ahmed Marzouk — Website (Next.js)

Bilingual (Arabic RTL / English LTR) medical website for Dr. Ahmed Marzouk,
converted from the original HTML design to **Next.js 15 (App Router) + TypeScript**.

## Tech stack
- **Next.js 15** (App Router) — front end + back end in one app
- **TypeScript**, **React 19**
- **next/font** (El Messiri + Tajawal) for optimized bilingual fonts
- **Supabase** — database for bookings and (upcoming) editable content + admin

## Pages & URLs
The public site is served under a language prefix for SEO — **`/ar/...`** and
**`/en/...`** — each with its own `<html lang>`, localized metadata, hreflang
alternates, and (optionally) localized slugs. Visiting `/` redirects to the
preferred language; old unprefixed links redirect into `/ar`.

`/[lang]` Home · `/[lang]/about` · `/[lang]/services` · `/[lang]/cases` ·
`/[lang]/blogs` + `/[lang]/blogs/[slug]` · `/[lang]/media` · `/[lang]/contact`.
Admin stays at `/admin`. API: `/api/booking`.

## Run locally
```bash
npm install
cp .env.example .env.local   # then fill in your Supabase keys
npm run dev                  # http://localhost:3000
```

## Build
```bash
npm run build && npm run start
```

## Environment variables
See `.env.example`. Put real values in `.env.local` (git-ignored) or in your
host's environment settings. Never commit secrets.

## Supabase setup (run once in SQL Editor)
1. `supabase/schema.sql` — creates all tables + security.
2. `supabase/storage.sql` — creates the public `media` bucket for admin image uploads.
3. `supabase/blog_categories.sql` — adds blog categories + links posts to a category.
4. `supabase/instagram_and_extras.sql` — Instagram table + parent service + review ratings.
5. `supabase/home_sections.sql` — editable hero slides, stats, values, and features.
6. `supabase/service_categories_and_flags.sql` — parent-service categories + "show on home" toggles.
7. `supabase/booking_email.sql` — adds an email field to contact-form submissions.
8. `supabase/cases_show_on_home.sql` — adds a "show on home" flag to cases (celebrity slider).
9. `supabase/localized_slugs.sql` — optional per-language URL slugs (slug_ar / slug_en).
Then create an admin user in Supabase → Authentication → Users, and open `/admin`.

## Deploy (Vercel — recommended)
1. Push this repo to GitHub (done).
2. Import the repo at [vercel.com/new](https://vercel.com/new).
3. Add the environment variables from `.env.example` in the Vercel dashboard.
4. Deploy — every push auto-deploys and gives you a live preview URL.

## Project structure
```
app/            Routes (pages) + API routes
components/      Shared UI (Navbar, Footer, ImageSlot, HoverBox, PageHero, WhatsappFloat)
lib/            LangProvider, theme tokens, Supabase client, content modules
lib/content/    All page content (AR/EN) — the source that maps to Supabase tables
public/assets/  Images
original-draft/ The original HTML design (kept for reference)
```

## Roadmap
- [x] Pixel-faithful bilingual site (all pages)
- [x] Booking API (`/api/booking`) ready for Supabase
- [ ] Move all content into Supabase (dynamic, editable)
- [ ] Custom `/admin` dashboard (AR/EN editing for every element + blog CRUD)
- [ ] SEO/GEO: sitemap, robots, hreflang, LocalBusiness structured data

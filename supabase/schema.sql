-- ============================================================================
-- Dr. Ahmed Marzouk — Supabase schema
-- Bilingual (Arabic/English) CMS for a Next.js site.
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query).
-- Safe to re-run: uses "if not exists" / "on conflict".
-- ============================================================================

-- Helper: auto-update updated_at on row change
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

-- ---------------------------------------------------------------------------
-- SITE CONTENT (singleton text blocks: hero titles, kickers, footer, etc.)
-- key format: "<page>.<field>", e.g. "home.msgTitle"
-- ---------------------------------------------------------------------------
create table if not exists public.site_content (
  id          uuid primary key default gen_random_uuid(),
  key         text unique not null,
  value_ar    text not null default '',
  value_en    text not null default '',
  section     text,
  updated_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- SERVICES (also power the home grid, services page, and /services/[slug])
-- ---------------------------------------------------------------------------
create table if not exists public.services (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,
  slug_ar         text,
  slug_en         text,
  sort_order      int not null default 0,
  is_published    boolean not null default true,
  glyph           text default '',
  image_url       text,
  span_gc         text default 'auto',
  span_gr         text default 'auto',
  tag_ar          text default '', tag_en          text default '',
  title_ar        text default '', title_en        text default '',
  short_desc_ar   text default '', short_desc_en   text default '',
  hero_sub_ar     text default '', hero_sub_en     text default '',
  intro_ar        text default '', intro_en        text default '',
  sections        jsonb not null default '[]',   -- [{heading_ar,heading_en,body_ar,body_en}]
  benefits        jsonb not null default '[]',   -- [{ar,en}]
  faq             jsonb not null default '[]',   -- [{q_ar,q_en,a_ar,a_en}]
  meta_title_ar   text default '', meta_title_en   text default '',
  meta_desc_ar    text default '', meta_desc_en    text default '',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- CASES (category: 'success' | 'celebrity') → cases page + /cases/[slug]
-- ---------------------------------------------------------------------------
create table if not exists public.cases (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  slug_ar         text,
  slug_en         text,
  category      text not null default 'success',
  sort_order    int not null default 0,
  is_published  boolean not null default true,
  show_on_home  boolean not null default true,
  image_url     text,
  image_url_2   text,
  tag_ar        text default '', tag_en        text default '',
  title_ar      text default '', title_en      text default '',
  excerpt_ar    text default '', excerpt_en    text default '',
  body_ar       text default '', body_en       text default '',
  meta_title_ar text default '', meta_title_en text default '',
  meta_desc_ar  text default '', meta_desc_en  text default '',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- BLOG POSTS → blogs page + /blogs/[slug]
-- ---------------------------------------------------------------------------
create table if not exists public.blog_posts (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  slug_ar         text,
  slug_en         text,
  sort_order    int not null default 0,
  is_published  boolean not null default true,
  image_url     text,
  published_date date,
  tag_ar        text default '', tag_en        text default '',
  title_ar      text default '', title_en      text default '',
  excerpt_ar    text default '', excerpt_en    text default '',
  body_ar       jsonb not null default '[]',   -- array of paragraphs
  body_en       jsonb not null default '[]',
  meta_title_ar text default '', meta_title_en text default '',
  meta_desc_ar  text default '', meta_desc_en  text default '',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- MEDIA (type: 'gallery' | 'video')
-- ---------------------------------------------------------------------------
create table if not exists public.media_items (
  id            uuid primary key default gen_random_uuid(),
  type          text not null default 'gallery',
  sort_order    int not null default 0,
  is_published  boolean not null default true,
  image_url     text,
  video_url     text,
  span_gc       text default 'auto',
  span_gr       text default 'auto',
  title_ar      text default '', title_en      text default '',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- CELEBRITIES (home strip)
-- ---------------------------------------------------------------------------
create table if not exists public.celebrities (
  id            uuid primary key default gen_random_uuid(),
  sort_order    int not null default 0,
  is_published  boolean not null default true,
  image_url     text,
  name_ar       text default '', name_en       text default '',
  caption_ar    text default '', caption_en    text default '',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- TESTIMONIALS (about page)
-- ---------------------------------------------------------------------------
create table if not exists public.testimonials (
  id            uuid primary key default gen_random_uuid(),
  sort_order    int not null default 0,
  is_published  boolean not null default true,
  name          text default '',
  text_ar       text default '', text_en       text default '',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- CLINICS (contact page + footer + local SEO)
-- ---------------------------------------------------------------------------
create table if not exists public.clinics (
  id            uuid primary key default gen_random_uuid(),
  sort_order    int not null default 0,
  is_published  boolean not null default true,
  phone         text default '',
  maps_url      text default '',
  latitude      double precision,
  longitude     double precision,
  name_ar       text default '', name_en       text default '',
  address_ar    text default '', address_en    text default '',
  hours_ar      text default '', hours_en      text default '',
  area_ar       text default '', area_en       text default '',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- BOOKINGS (contact form submissions)
-- ---------------------------------------------------------------------------
create table if not exists public.bookings (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  phone         text not null,
  email         text default '',
  service       text default '',
  message       text default '',
  lang          text default 'ar',
  status        text default 'new',
  created_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['site_content','services','cases','blog_posts','media_items','celebrities','testimonials','clinics']
  loop
    execute format('drop trigger if exists trg_%1$s_updated on public.%1$s;', t);
    execute format('create trigger trg_%1$s_updated before update on public.%1$s for each row execute function public.set_updated_at();', t);
  end loop;
end $$;

-- ============================================================================
-- ROW LEVEL SECURITY
-- Public (anon) can READ published rows. Writes require the service_role key
-- (used only by the server / admin API) which bypasses RLS.
-- Bookings: anyone may INSERT (contact form); only service_role may read.
-- ============================================================================
alter table public.site_content  enable row level security;
alter table public.services      enable row level security;
alter table public.cases         enable row level security;
alter table public.blog_posts    enable row level security;
alter table public.media_items   enable row level security;
alter table public.celebrities   enable row level security;
alter table public.testimonials  enable row level security;
alter table public.clinics       enable row level security;
alter table public.bookings      enable row level security;

-- Public read policies (published only for collections; all for site_content)
drop policy if exists "read site_content" on public.site_content;
create policy "read site_content" on public.site_content for select using (true);

do $$
declare t text;
begin
  foreach t in array array['services','cases','blog_posts','media_items','celebrities','testimonials','clinics']
  loop
    execute format('drop policy if exists "read published %1$s" on public.%1$s;', t);
    execute format('create policy "read published %1$s" on public.%1$s for select using (is_published = true);', t);
  end loop;
end $$;

-- Bookings: allow anonymous inserts, no public reads
drop policy if exists "insert bookings" on public.bookings;
create policy "insert bookings" on public.bookings for insert with check (true);

-- ============================================================================
-- Done. Seed data lives in supabase/seed.sql (run it next, optional).
-- ============================================================================

-- ============================================================================
-- Extras: Instagram feed, parent services, review ratings.
-- Run once in the Supabase SQL Editor (after schema.sql).
-- ============================================================================

-- Instagram posts (managed manually, or synced via /api/instagram/sync)
create table if not exists public.instagram_posts (
  id           uuid primary key default gen_random_uuid(),
  external_id  text unique,
  sort_order   int not null default 0,
  is_published boolean not null default true,
  image_url    text,
  permalink    text,
  is_video     boolean not null default false,
  caption_ar   text default '',
  caption_en   text default '',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
drop trigger if exists trg_instagram_updated on public.instagram_posts;
create trigger trg_instagram_updated before update on public.instagram_posts
  for each row execute function public.set_updated_at();
alter table public.instagram_posts enable row level security;
drop policy if exists "read published instagram_posts" on public.instagram_posts;
create policy "read published instagram_posts" on public.instagram_posts
  for select using (is_published = true);

-- Parent / related service (self reference)
alter table public.services
  add column if not exists parent_id uuid references public.services(id) on delete set null;

-- Review rating (stars) for testimonials
alter table public.testimonials
  add column if not exists rating int not null default 5;

-- ============================================================================
-- Blog categories + link posts to a category.
-- Run once in the Supabase SQL Editor (after schema.sql).
-- ============================================================================

create table if not exists public.blog_categories (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  sort_order   int not null default 0,
  is_published boolean not null default true,
  name_ar      text default '',
  name_en      text default '',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Link each post to a category (optional).
alter table public.blog_posts
  add column if not exists category_id uuid references public.blog_categories(id) on delete set null;

-- updated_at trigger
drop trigger if exists trg_blog_categories_updated on public.blog_categories;
create trigger trg_blog_categories_updated before update on public.blog_categories
  for each row execute function public.set_updated_at();

-- RLS: public can read published categories
alter table public.blog_categories enable row level security;
drop policy if exists "read published blog_categories" on public.blog_categories;
create policy "read published blog_categories" on public.blog_categories
  for select using (is_published = true);

-- Seed a few starter categories (safe to re-run)
insert into public.blog_categories (slug, sort_order, name_ar, name_en) values
  ('delivery', 1, 'الولادة', 'Delivery'),
  ('fibroids', 2, 'الأورام الليفية', 'Fibroids'),
  ('pregnancy', 3, 'الحمل', 'Pregnancy'),
  ('endometriosis', 4, 'بطانة الرحم', 'Endometriosis'),
  ('womens-health', 5, 'صحة المرأة', 'Women’s Health')
on conflict (slug) do nothing;

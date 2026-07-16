-- ============================================================================
-- Service categories (parent services) + "show on home" flags.
-- Run once in the Supabase SQL Editor (after schema.sql).
-- ============================================================================

-- Parent services / categories
create table if not exists public.service_categories (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  sort_order   int not null default 0,
  is_published boolean not null default true,
  name_ar      text default '',
  name_en      text default '',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
drop trigger if exists trg_service_categories_updated on public.service_categories;
create trigger trg_service_categories_updated before update on public.service_categories
  for each row execute function public.set_updated_at();
alter table public.service_categories enable row level security;
drop policy if exists "read published service_categories" on public.service_categories;
create policy "read published service_categories" on public.service_categories
  for select using (is_published = true);

-- Link each service to a category (parent)
alter table public.services
  add column if not exists category_id uuid references public.service_categories(id) on delete set null;

-- "Show on home" toggles (home sliders). is_published still controls the page grid.
alter table public.services     add column if not exists show_on_home boolean not null default true;
alter table public.celebrities  add column if not exists show_on_home boolean not null default true;
alter table public.testimonials add column if not exists show_on_home boolean not null default true;
alter table public.blog_posts   add column if not exists show_on_home boolean not null default true;

-- Starter service categories (safe to re-run)
insert into public.service_categories (slug, sort_order, name_ar, name_en) values
  ('delivery', 1, 'الولادة', 'Delivery'),
  ('tumor-surgery', 2, 'جراحة الأورام', 'Tumor Surgery'),
  ('cosmetic', 3, 'التجميل النسائي', 'Cosmetic Gynecology'),
  ('specialized', 4, 'رعاية تخصصية', 'Specialized Care')
on conflict (slug) do nothing;

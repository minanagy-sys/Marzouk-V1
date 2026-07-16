-- ============================================================================
-- Editable home/about list sections: hero slides, stats, values, features.
-- Run once in the Supabase SQL Editor (after schema.sql).
-- ============================================================================

create table if not exists public.hero_slides (
  id uuid primary key default gen_random_uuid(),
  sort_order int not null default 0,
  is_published boolean not null default true,
  image_url text,
  kicker_ar text default '', kicker_en text default '',
  title1_ar text default '', title1_en text default '',
  title2_ar text default '', title2_en text default '',
  sub_ar text default '', sub_en text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.hero_stats (
  id uuid primary key default gen_random_uuid(),
  sort_order int not null default 0,
  is_published boolean not null default true,
  num_ar text default '', num_en text default '',
  label_ar text default '', label_en text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.value_items (
  id uuid primary key default gen_random_uuid(),
  sort_order int not null default 0,
  is_published boolean not null default true,
  num text default '',
  title_ar text default '', title_en text default '',
  body_ar text default '', body_en text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.feature_items (
  id uuid primary key default gen_random_uuid(),
  sort_order int not null default 0,
  is_published boolean not null default true,
  glyph text default '',
  title_ar text default '', title_en text default '',
  desc_ar text default '', desc_en text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
declare t text;
begin
  foreach t in array array['hero_slides','hero_stats','value_items','feature_items']
  loop
    execute format('drop trigger if exists trg_%1$s_updated on public.%1$s;', t);
    execute format('create trigger trg_%1$s_updated before update on public.%1$s for each row execute function public.set_updated_at();', t);
    execute format('alter table public.%1$s enable row level security;', t);
    execute format('drop policy if exists "read published %1$s" on public.%1$s;', t);
    execute format('create policy "read published %1$s" on public.%1$s for select using (is_published = true);', t);
  end loop;
end $$;

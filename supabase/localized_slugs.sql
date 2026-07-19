-- ============================================================================
-- Per-language URL slugs for split /ar and /en URLs. Run once in the SQL Editor.
-- Optional overrides — pages fall back to the canonical `slug` when empty.
-- ============================================================================

alter table public.services   add column if not exists slug_ar text;
alter table public.services   add column if not exists slug_en text;
alter table public.cases      add column if not exists slug_ar text;
alter table public.cases      add column if not exists slug_en text;
alter table public.blog_posts add column if not exists slug_ar text;
alter table public.blog_posts add column if not exists slug_en text;

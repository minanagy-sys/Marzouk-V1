-- ============================================================================
-- Add a "show on home" flag to cases (used by celebrity cases to appear in the
-- home celebrities slider). Run once in the Supabase SQL Editor. Safe to re-run.
-- ============================================================================

alter table public.cases add column if not exists show_on_home boolean not null default true;

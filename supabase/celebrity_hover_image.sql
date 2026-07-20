-- ============================================================================
-- CONTENT-SAFE: add a second/hover image to cases (used by celebrity cards on
-- the home slider — swaps to this image on hover). Run once. Safe to re-run.
-- ============================================================================

alter table public.cases add column if not exists image_url_2 text;

-- ============================================================================
-- CONTENT-SAFE: add a separate home-page card image to services.
-- image_url stays the Services-page (masonry) + detail image; image_url_home is
-- shown on the home-page services slider (different card shape). When empty, the
-- home slider falls back to image_url. Run once. Safe to re-run.
-- ============================================================================

alter table public.services add column if not exists image_url_home text;

-- ============================================================================
-- CONTENT-SAFE: add a separate Arabic (RTL) background image to hero slides.
-- The existing image_url stays the English (LTR) image; image_url_ar is used
-- on the Arabic site so the doctor can sit opposite the text. When image_url_ar
-- is empty, the site falls back to mirror-flipping the English image.
-- Run once. Safe to re-run.
-- ============================================================================

alter table public.hero_slides add column if not exists image_url_ar text;

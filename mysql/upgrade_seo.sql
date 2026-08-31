-- ============================================================================
-- SEO upgrade — run ONCE in phpMyAdmin after importing marzouk_data.sql.
-- Adds the new blog SEO/content columns to an existing database.
-- Safe to re-run (uses IF NOT EXISTS; MariaDB 10.4+ / MySQL 8+).
-- ============================================================================

ALTER TABLE blog_posts
  ADD COLUMN IF NOT EXISTS image_alt_ar TEXT       AFTER image_url,
  ADD COLUMN IF NOT EXISTS image_alt_en TEXT       AFTER image_alt_ar,
  ADD COLUMN IF NOT EXISTS faq          JSON       AFTER body_en,
  ADD COLUMN IF NOT EXISTS schema_type  VARCHAR(32) DEFAULT 'BlogPosting' AFTER faq,
  ADD COLUMN IF NOT EXISTS keywords_ar  TEXT       AFTER meta_desc_en,
  ADD COLUMN IF NOT EXISTS keywords_en  TEXT       AFTER keywords_ar;

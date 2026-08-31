-- ============================================================================
-- SEO settings — makes per-page title/description and the social share image
-- editable from Admin → Site text → SEO. Insert-if-missing; safe to re-run.
-- Empty values fall back to the built-in page defaults.
-- ============================================================================

INSERT INTO site_content (id, `key`, section, value_ar, value_en) VALUES
  (UUID(), 'seo.home.title',     'SEO', '', ''),
  (UUID(), 'seo.home.desc',      'SEO', '', ''),
  (UUID(), 'seo.about.title',    'SEO', '', ''),
  (UUID(), 'seo.about.desc',     'SEO', '', ''),
  (UUID(), 'seo.services.title', 'SEO', '', ''),
  (UUID(), 'seo.services.desc',  'SEO', '', ''),
  (UUID(), 'seo.cases.title',    'SEO', '', ''),
  (UUID(), 'seo.cases.desc',     'SEO', '', ''),
  (UUID(), 'seo.blogs.title',    'SEO', '', ''),
  (UUID(), 'seo.blogs.desc',     'SEO', '', ''),
  (UUID(), 'seo.media.title',    'SEO', '', ''),
  (UUID(), 'seo.media.desc',     'SEO', '', ''),
  (UUID(), 'seo.contact.title',  'SEO', '', ''),
  (UUID(), 'seo.contact.desc',   'SEO', '', ''),
  (UUID(), 'seo.ogImage',        'SEO', '', '')
ON DUPLICATE KEY UPDATE `key` = `key`;

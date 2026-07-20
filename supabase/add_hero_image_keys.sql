-- ============================================================================
-- CONTENT-SAFE: add the per-page hero-image fields so they show up in the
-- admin Site-text editor, WITHOUT re-seeding / overwriting anything. Existing
-- rows are left untouched (on conflict do nothing).
-- ============================================================================

insert into public.site_content (key, section, value_ar, value_en) values
  ('about.heroImage',    'About page',    '', ''),
  ('services.heroImage', 'Services page', '', ''),
  ('cases.heroImage',    'Cases page',    '', ''),
  ('blogs.heroImage',    'Blog page',     '', ''),
  ('media.heroImage',    'Media page',    '', ''),
  ('contact.heroImage',  'Contact page',  '', '')
on conflict (key) do nothing;

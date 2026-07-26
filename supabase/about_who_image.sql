-- ============================================================================
-- CONTENT-SAFE: make the "Who we are" image on the About page editable.
-- Registers the site_content key about.whoImage so it shows up in
-- Admin → Site text → About page with an image uploader. Defaults to the
-- current asset. Only inserts if missing, so it never overwrites an image
-- you have already set. Safe to re-run.
-- ============================================================================

insert into public.site_content (key, section, value_ar, value_en)
values ('about.whoImage', 'About page', '/assets/doctor-crop.png', '/assets/doctor-crop.png')
on conflict (key) do nothing;

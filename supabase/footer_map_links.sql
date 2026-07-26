-- ============================================================================
-- CONTENT-SAFE: make the two footer clinic lines link to directions.
-- Registers footer.map1 / footer.map2 so the directions URL for each clinic
-- can be edited in Admin → Site text → Footer. Defaults to a Google Maps
-- directions link for each address; paste an exact Google Maps place/share
-- link to pinpoint it. Only inserts if missing, so it never overwrites a link
-- you have already set. Safe to re-run.
-- ============================================================================

insert into public.site_content (key, section, value_ar, value_en) values
  ('footer.map1', 'Footer',
   'https://www.google.com/maps/dir/?api=1&destination=Silver%20Star%20Mall%2C%20Fifth%20Settlement%2C%20New%20Cairo',
   'https://www.google.com/maps/dir/?api=1&destination=Silver%20Star%20Mall%2C%20Fifth%20Settlement%2C%20New%20Cairo'),
  ('footer.map2', 'Footer',
   'https://www.google.com/maps/dir/?api=1&destination=Mostafa%20El-Nahas%20St%2C%20Nasr%20City%2C%20Cairo',
   'https://www.google.com/maps/dir/?api=1&destination=Mostafa%20El-Nahas%20St%2C%20Nasr%20City%2C%20Cairo')
on conflict (key) do nothing;

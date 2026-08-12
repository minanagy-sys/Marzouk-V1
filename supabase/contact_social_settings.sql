-- ============================================================================
-- CONTENT-SAFE: make the contact & social values editable from
-- Admin → Site text (Footer). Registers the keys the app now reads via st()
-- for phones, email, WhatsApp and the social links. Insert-if-missing, so it
-- never overwrites values you've already edited. Safe to re-run.
-- ============================================================================

insert into public.site_content (key, section, value_ar, value_en) values
  ('footer.phone1',    'Footer', '01063337333', '01063337333'),
  ('footer.phone2',    'Footer', '01022399994', '01022399994'),
  ('footer.email',     'Footer', 'info@ahmedmarzouk.com', 'info@ahmedmarzouk.com'),
  ('footer.whatsapp',  'Footer', '201063337333', '201063337333'),
  ('footer.facebook',  'Footer', 'https://www.facebook.com/Dr.AhmedMarzouk.official/', 'https://www.facebook.com/Dr.AhmedMarzouk.official/'),
  ('footer.youtube',   'Footer', 'https://www.youtube.com/channel/UCxxu2t7HkvFdMSOKTYUnrdQ', 'https://www.youtube.com/channel/UCxxu2t7HkvFdMSOKTYUnrdQ'),
  ('footer.instagram', 'Footer', 'https://www.instagram.com/dr.ahmed.marzok/', 'https://www.instagram.com/dr.ahmed.marzok/'),
  ('footer.tiktok',    'Footer', '', ''),
  ('footer.snapchat',  'Footer', '', '')
on conflict (key) do nothing;

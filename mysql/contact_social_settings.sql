-- ============================================================================
-- Make the contact & social values editable from Admin → Site text (Footer).
-- These were the last hardcoded bits (phones, email, WhatsApp, social links);
-- the app now reads them from site_content with these as the defaults.
-- Insert-if-missing (never overwrites values you've already edited). Safe to re-run.
-- ============================================================================

INSERT INTO site_content (id, `key`, section, value_ar, value_en) VALUES
  (UUID(), 'footer.phone1',    'Footer', '01063337333', '01063337333'),
  (UUID(), 'footer.phone2',    'Footer', '01022399994', '01022399994'),
  (UUID(), 'footer.email',     'Footer', 'info@ahmedmarzouk.com', 'info@ahmedmarzouk.com'),
  (UUID(), 'footer.whatsapp',  'Footer', '201063337333', '201063337333'),
  (UUID(), 'footer.facebook',  'Footer', 'https://www.facebook.com/Dr.AhmedMarzouk.official/', 'https://www.facebook.com/Dr.AhmedMarzouk.official/'),
  (UUID(), 'footer.youtube',   'Footer', 'https://www.youtube.com/channel/UCxxu2t7HkvFdMSOKTYUnrdQ', 'https://www.youtube.com/channel/UCxxu2t7HkvFdMSOKTYUnrdQ'),
  (UUID(), 'footer.instagram', 'Footer', 'https://www.instagram.com/dr.ahmed.marzok/', 'https://www.instagram.com/dr.ahmed.marzok/')
ON DUPLICATE KEY UPDATE `key` = `key`;

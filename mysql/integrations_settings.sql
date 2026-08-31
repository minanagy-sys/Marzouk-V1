-- ============================================================================
-- Analytics / verification integrations — editable from
-- Admin → Site text → Integrations. Paste your IDs into the value fields.
-- Insert-if-missing; safe to re-run. Empty values inject nothing.
-- ============================================================================

INSERT INTO site_content (id, `key`, section, value_ar, value_en) VALUES
  (UUID(), 'integrations.ga4',       'Integrations', '', ''),  -- Google Analytics 4 (G-XXXXXXX)
  (UUID(), 'integrations.gtm',       'Integrations', '', ''),  -- Google Tag Manager (GTM-XXXXXXX)
  (UUID(), 'integrations.metaPixel', 'Integrations', '', ''),  -- Meta/Facebook Pixel (numeric ID)
  (UUID(), 'integrations.gsc',       'Integrations', '', ''),  -- Google Search Console verification token
  (UUID(), 'integrations.bing',      'Integrations', '', '')   -- Bing Webmaster verification token
ON DUPLICATE KEY UPDATE `key` = `key`;

-- ============================================================================
-- CONTENT-SAFE: fix the English translation of ولادة on the birth services.
-- The English label was "Delivery"; the correct wording is "Birth".
-- Only touches rows that still say "Delivery", so it never overwrites any
-- wording you have already changed. Safe to re-run.
-- ============================================================================

-- Service tag: "Delivery" -> "Birth"
update public.services
set tag_en = 'Birth'
where tag_en = 'Delivery';

-- Service title: "...Cesarean Delivery" / "...Natural Delivery" -> "...Birth"
update public.services
set title_en = replace(title_en, 'Delivery', 'Birth')
where title_en like '%Delivery%';

-- SEO meta title: keep it in sync
update public.services
set meta_title_en = replace(meta_title_en, 'Delivery', 'Birth')
where meta_title_en like '%Delivery%';

-- Service category chip on the services page: "Delivery" -> "Birth"
update public.service_categories
set name_en = 'Birth'
where name_en = 'Delivery';

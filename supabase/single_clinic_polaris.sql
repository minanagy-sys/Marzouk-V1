-- ============================================================================
-- CONTENT-SAFE: keep only the Fifth Settlement clinic and move it to Polaris
-- Mall; remove the Nasr City clinic everywhere.
-- Guards match the OLD values so it never clobbers wording you have already
-- changed. Safe to re-run.
-- ============================================================================

-- 1) Clinics table (contact page map + list) --------------------------------
-- Remove the Nasr City clinic.
delete from public.clinics
where name_en ilike '%Nasr%'
   or name_ar like '%مدينة نصر%'
   or area_en ilike '%Nasr%'
   or address_en ilike '%Nahas%';

-- Move the Fifth Settlement clinic to Polaris Mall (address + directions link).
update public.clinics
set address_en = 'Polaris Mall, Fifth Settlement.',
    address_ar = 'بولاريس مول، التجمع الخامس.',
    maps_url   = 'https://maps.google.com/?q=Polaris+Mall,+Fifth+Settlement,+New+Cairo,+Egypt'
where name_en ilike '%Fifth%'
   or name_ar like '%التجمع الخامس%'
   or address_en ilike '%Silver Star%'
   or address_ar like '%سيلفر%';

-- 2) Footer text (site_content) ---------------------------------------------
-- Drop the second clinic line and its map link.
delete from public.site_content where key in ('footer.clinic2', 'footer.map2');

-- Point the first clinic line + directions at Polaris (only if still the old value).
update public.site_content
set value_ar = 'عيادة التجمع الخامس: بولاريس مول، التجمع الخامس.',
    value_en = 'Fifth Settlement Clinic: Polaris Mall, Fifth Settlement.'
where key = 'footer.clinic1'
  and (value_en ilike '%Silver Star%' or value_ar like '%سيلفر%');

update public.site_content
set value_ar = 'https://www.google.com/maps/dir/?api=1&destination=Polaris%20Mall%2C%20Fifth%20Settlement%2C%20New%20Cairo',
    value_en = 'https://www.google.com/maps/dir/?api=1&destination=Polaris%20Mall%2C%20Fifth%20Settlement%2C%20New%20Cairo'
where key = 'footer.map1'
  and (value_en ilike '%Silver%Star%' or value_en ilike '%Nasr%');

-- 3) The "2 Clinics" stat on the home / about pages -------------------------
update public.hero_stats
set num_ar = 'عيادة', label_ar = 'التجمع الخامس — بولاريس مول',
    num_en = '1 Clinic', label_en = 'Fifth Settlement — Polaris Mall'
where label_en ilike '%Nasr%'
   or label_ar like '%مدينة نصر%'
   or num_en ilike '%2 Clinic%'
   or num_ar like '%عيادتان%';

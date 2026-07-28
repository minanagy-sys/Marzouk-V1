-- ============================================================================
-- CONTENT-SAFE: keep only the Fifth Settlement clinic and move it to Polaris
-- Mall; remove the Nasr City clinic everywhere. Safe to re-run.
--
-- NOTE: running this in the SQL editor updates the DATA, but the public pages
-- are cached (ISR). They refresh on the next redeploy or within ~1 hour. To see
-- it immediately, redeploy, or open Admin → Clinics and Save any row (that
-- revalidates the site).
-- ============================================================================

-- 0) DIAGNOSTIC — run this first to see what is actually stored, so you can
--    confirm the Nasr City row is gone after the delete below.
--    select id, name_en, name_ar, area_en, address_en, is_published from public.clinics order by sort_order;

-- 1) Clinics table (contact page map + list) --------------------------------
-- Remove the Nasr City clinic by any field that could identify it.
delete from public.clinics
where name_en   ilike '%nasr%'
   or name_ar   like  '%نصر%'
   or area_en   ilike '%nasr%'
   or area_ar   like  '%نصر%'
   or address_en ilike '%nahas%'
   or address_ar like  '%النحاس%'
   or address_en ilike '%nasr%'
   or address_ar like  '%نصر%';

-- Move the Fifth Settlement clinic to Polaris Mall (address + directions link).
-- Arabic address is just "بولاريس مول" (no trailing التجمع الخامس).
update public.clinics
set address_en = 'Polaris Mall, Fifth Settlement.',
    address_ar = 'بولاريس مول.',
    maps_url   = 'https://maps.google.com/?q=Polaris+Mall,+Fifth+Settlement,+New+Cairo,+Egypt'
where name_en    ilike '%fifth%'
   or name_ar    like  '%التجمع الخامس%'
   or address_en ilike '%silver star%'
   or address_ar like  '%سيلفر%'
   or address_ar like  '%التجمع الخامس%';

-- 2) Footer text (site_content) ---------------------------------------------
delete from public.site_content where key in ('footer.clinic2', 'footer.map2');

update public.site_content
set value_ar = 'عيادة التجمع الخامس: بولاريس مول.',
    value_en = 'Fifth Settlement Clinic: Polaris Mall, Fifth Settlement.'
where key = 'footer.clinic1'
  and (value_en ilike '%silver star%' or value_ar like '%سيلفر%' or value_ar like '%، التجمع الخامس.%' or value_ar like '%مول، التجمع%');

update public.site_content
set value_ar = 'https://www.google.com/maps/dir/?api=1&destination=Polaris%20Mall%2C%20Fifth%20Settlement%2C%20New%20Cairo',
    value_en = 'https://www.google.com/maps/dir/?api=1&destination=Polaris%20Mall%2C%20Fifth%20Settlement%2C%20New%20Cairo'
where key = 'footer.map1'
  and (value_en ilike '%silver%star%' or value_en ilike '%nasr%');

-- 3) The "2 Clinics" stat on the home / about pages -------------------------
update public.hero_stats
set num_ar = 'عيادة', label_ar = 'التجمع الخامس — بولاريس مول',
    num_en = '1 Clinic', label_en = 'Fifth Settlement — Polaris Mall'
where label_en ilike '%nasr%'
   or label_ar like  '%نصر%'
   or num_en   ilike '%2 clinic%'
   or num_ar   like  '%عيادتان%';

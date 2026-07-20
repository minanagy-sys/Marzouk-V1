-- ============================================================================
-- CONTENT-SAFE: renumber "Display order" (sort_order) only. Touches no titles,
-- text, images, slugs or any other content. Keeps your current relative order.
--   • cases → numbered 1..N PER CATEGORY (success and celebrity independently)
--   • all other lists → numbered 1..N
-- Run once in the Supabase SQL Editor. Safe to re-run.
-- ============================================================================

-- Cases: independent 1..N for each category
with ranked as (
  select id, row_number() over (partition by category order by sort_order, id) as rn
  from public.cases
)
update public.cases c set sort_order = r.rn from ranked r where c.id = r.id;

-- Helper pattern for single-group lists: renumber 1..N by current order
with ranked as (select id, row_number() over (order by sort_order, id) as rn from public.services)
update public.services t set sort_order = r.rn from ranked r where t.id = r.id;

with ranked as (select id, row_number() over (order by sort_order, id) as rn from public.blog_posts)
update public.blog_posts t set sort_order = r.rn from ranked r where t.id = r.id;

with ranked as (select id, row_number() over (order by sort_order, id) as rn from public.service_categories)
update public.service_categories t set sort_order = r.rn from ranked r where t.id = r.id;

with ranked as (select id, row_number() over (order by sort_order, id) as rn from public.blog_categories)
update public.blog_categories t set sort_order = r.rn from ranked r where t.id = r.id;

with ranked as (select id, row_number() over (order by sort_order, id) as rn from public.media_items)
update public.media_items t set sort_order = r.rn from ranked r where t.id = r.id;

with ranked as (select id, row_number() over (order by sort_order, id) as rn from public.testimonials)
update public.testimonials t set sort_order = r.rn from ranked r where t.id = r.id;

with ranked as (select id, row_number() over (order by sort_order, id) as rn from public.clinics)
update public.clinics t set sort_order = r.rn from ranked r where t.id = r.id;

with ranked as (select id, row_number() over (order by sort_order, id) as rn from public.hero_slides)
update public.hero_slides t set sort_order = r.rn from ranked r where t.id = r.id;

with ranked as (select id, row_number() over (order by sort_order, id) as rn from public.hero_stats)
update public.hero_stats t set sort_order = r.rn from ranked r where t.id = r.id;

with ranked as (select id, row_number() over (order by sort_order, id) as rn from public.value_items)
update public.value_items t set sort_order = r.rn from ranked r where t.id = r.id;

with ranked as (select id, row_number() over (order by sort_order, id) as rn from public.feature_items)
update public.feature_items t set sort_order = r.rn from ranked r where t.id = r.id;

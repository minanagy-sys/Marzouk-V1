-- ============================================================================
-- Fill per-language URL slugs for the content you already have — WITHOUT
-- touching any titles/body/content. Safe to re-run; only fills empty slugs.
--
-- English slug  → your existing canonical `slug` (clean keyword URL).
-- Arabic slug   → derived from the Arabic title (spaces/punctuation → dashes,
--                 Arabic letters kept) for keyword-rich /ar URLs.
--
-- Run AFTER supabase/localized_slugs.sql (which adds the columns).
-- ============================================================================

-- helper expression: slugify(title_ar)
--   lower() only affects latin; Arabic letters are kept; spaces/punctuation → "-"

update public.services set
  slug_en = coalesce(nullif(slug_en, ''), slug),
  slug_ar = coalesce(nullif(slug_ar, ''),
    trim(both '-' from regexp_replace(lower(title_ar), '[[:space:][:punct:]]+', '-', 'g')))
where nullif(slug_en, '') is null or nullif(slug_ar, '') is null;

update public.cases set
  slug_en = coalesce(nullif(slug_en, ''), slug),
  slug_ar = coalesce(nullif(slug_ar, ''),
    trim(both '-' from regexp_replace(lower(title_ar), '[[:space:][:punct:]]+', '-', 'g')))
where nullif(slug_en, '') is null or nullif(slug_ar, '') is null;

update public.blog_posts set
  slug_en = coalesce(nullif(slug_en, ''), slug),
  slug_ar = coalesce(nullif(slug_ar, ''),
    trim(both '-' from regexp_replace(lower(title_ar), '[[:space:][:punct:]]+', '-', 'g')))
where nullif(slug_en, '') is null or nullif(slug_ar, '') is null;

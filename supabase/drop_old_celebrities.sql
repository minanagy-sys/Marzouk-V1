-- ============================================================================
-- OPTIONAL cleanup: the old `celebrities` table is no longer used — celebrity
-- entries now live in the `cases` table (category = 'celebrity'). Run this only
-- if you want to remove the unused table. Safe to skip.
-- ============================================================================

drop table if exists public.celebrities;

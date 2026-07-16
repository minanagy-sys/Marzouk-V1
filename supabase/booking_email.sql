-- ============================================================================
-- Add an email field to contact-form submissions (bookings).
-- Run once in the Supabase SQL Editor. Safe to re-run.
-- ============================================================================

alter table public.bookings add column if not exists email text default '';

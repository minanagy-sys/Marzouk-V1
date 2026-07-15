-- ============================================================================
-- Storage bucket for admin-uploaded images.
-- Run once in the Supabase SQL Editor (after schema.sql).
-- ============================================================================

-- Public bucket named "media" (holds services/cases/blogs/gallery images).
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

-- Anyone can READ files (needed so the website can display them).
drop policy if exists "Public read media" on storage.objects;
create policy "Public read media"
  on storage.objects for select
  using (bucket_id = 'media');

-- Uploads/updates/deletes happen server-side with the service_role key
-- (which bypasses RLS), so no public write policy is needed.

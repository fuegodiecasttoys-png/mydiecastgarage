-- RLS: allow authenticated users to create/update ONLY their own row in `public.profiles`.
-- Matches app usage: `user_id` = `auth.users.id` (= auth.uid()).
-- Run in Supabase SQL Editor after RLS is enabled on `public.profiles`.
--
-- Signup (`AuthExperience.tsx`) uses `.upsert(..., { onConflict: "user_id" })`:
--   - first insert → needs INSERT policy
--   - same user re-upserts → needs UPDATE policy

drop policy if exists "profiles_insert_own_row" on public.profiles;
create policy "profiles_insert_own_row"
  on public.profiles
  for insert
  to authenticated
  with check (user_id = auth.uid());

drop policy if exists "profiles_update_own_row" on public.profiles;
create policy "profiles_update_own_row"
  on public.profiles
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

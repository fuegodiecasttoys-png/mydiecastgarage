-- Signup: anonymous clients need SELECT on `public.profiles` so
-- `fetchUsernameAvailable` (app/lib/signupValidation.ts) can run
-- `.select("username").eq("username", ...).maybeSingle()`.
--
-- This policy is SELECT-only. Prefer selecting only `username` in the app;
-- RLS cannot hide other columns if a client requests `*`.
--
-- Run in Supabase SQL Editor after RLS is enabled on `public.profiles`.

drop policy if exists "Allow username check" on public.profiles;

create policy "Allow username check"
  on public.profiles
  for select
  using (true);

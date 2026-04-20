-- Username uniqueness + availability check for signup (works without exposing full profiles to anon).
-- Run in Supabase SQL Editor once. If unique index fails, dedupe `profiles.username` first.

-- ---------------------------------------------------------------------------
-- 1. Enforce one row per public username (app stores normalized lowercase)
-- ---------------------------------------------------------------------------
create unique index if not exists profiles_username_unique
  on public.profiles (username);

-- Optional case-insensitive safety if legacy rows mixed case:
-- create unique index if not exists profiles_username_lower_unique
--   on public.profiles (lower(trim(username)));

-- ---------------------------------------------------------------------------
-- 2. RPC: true = username is free, false = taken or invalid length for lookup
-- ---------------------------------------------------------------------------
create or replace function public.is_username_available(p_username text)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v text;
begin
  v := lower(trim(coalesce(p_username, '')));
  if length(v) < 3 then
    return false;
  end if;
  return not exists (
    select 1
    from public.profiles pr
    where pr.username is not null
      and lower(trim(pr.username)) = v
  );
end;
$$;

revoke all on function public.is_username_available(text) from public;
grant execute on function public.is_username_available(text) to anon;
grant execute on function public.is_username_available(text) to authenticated;

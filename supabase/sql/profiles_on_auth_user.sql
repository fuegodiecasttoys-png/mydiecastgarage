-- Optional: when email confirmation is ON, signup has no session and the client cannot upsert `profiles`.
-- Run in Supabase SQL Editor after adjusting column names to match your `public.profiles` table.
-- Requires UNIQUE or PRIMARY KEY on `public.profiles(user_id)`.

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_username text;
  v_display text;
begin
  v_username := lower(trim(coalesce(new.raw_user_meta_data->>'username', '')));
  v_display := trim(
    concat(
      coalesce(new.raw_user_meta_data->>'name', ''),
      ' ',
      coalesce(new.raw_user_meta_data->>'last_name', '')
    )
  );

  if v_username is null or length(v_username) < 3 then
    return new;
  end if;

  insert into public.profiles (user_id, username, name)
  values (new.id, v_username, nullif(v_display, ''))
  on conflict (user_id) do update
    set username = excluded.username,
        name = coalesce(nullif(excluded.name, ''), public.profiles.name);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile
  after insert on auth.users
  for each row execute function public.handle_new_user_profile();

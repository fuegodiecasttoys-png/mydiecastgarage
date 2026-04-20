-- Friend requests (username-based friends, read-only collections)
-- Run in Supabase SQL Editor after reviewing existing policies on `profiles` and `items`.

-- ---------------------------------------------------------------------------
-- 1. Table
-- ---------------------------------------------------------------------------
create table if not exists public.friend_requests (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.profiles (id) on delete cascade,
  receiver_id uuid not null references public.profiles (id) on delete cascade,
  status text not null default 'pending'
    constraint friend_requests_status_check
    check (status in ('pending', 'accepted', 'rejected')),
  created_at timestamptz not null default now(),
  constraint friend_requests_no_self check (sender_id <> receiver_id)
);

-- No duplicate pending pair (same direction)
create unique index if not exists friend_requests_unique_pending_pair
  on public.friend_requests (sender_id, receiver_id)
  where (status = 'pending');

create index if not exists friend_requests_receiver_pending_idx
  on public.friend_requests (receiver_id)
  where (status = 'pending');

create index if not exists friend_requests_sender_idx
  on public.friend_requests (sender_id);

create index if not exists friend_requests_status_idx
  on public.friend_requests (status);

-- ---------------------------------------------------------------------------
-- 2. RLS: friend_requests
-- ---------------------------------------------------------------------------
alter table public.friend_requests enable row level security;

drop policy if exists "friend_requests_select_participant" on public.friend_requests;
create policy "friend_requests_select_participant"
  on public.friend_requests for select
  to authenticated
  using (auth.uid() = sender_id or auth.uid() = receiver_id);

drop policy if exists "friend_requests_insert_as_sender" on public.friend_requests;
create policy "friend_requests_insert_as_sender"
  on public.friend_requests for insert
  to authenticated
  with check (auth.uid() = sender_id);

-- Receiver may accept or reject while row is still pending
drop policy if exists "friend_requests_update_receiver_pending" on public.friend_requests;
create policy "friend_requests_update_receiver_pending"
  on public.friend_requests for update
  to authenticated
  using (auth.uid() = receiver_id and status = 'pending')
  with check (auth.uid() = receiver_id);

-- ---------------------------------------------------------------------------
-- 3. RLS: allow friends to read each other's items (read-only in app)
-- ---------------------------------------------------------------------------
-- Add alongside your existing "own items" SELECT policy. Postgres ORs multiple SELECT policies.

drop policy if exists "items_select_friend_collections" on public.items;
create policy "items_select_friend_collections"
  on public.items for select
  to authenticated
  using (
    exists (
      select 1
      from public.friend_requests fr
      where fr.status = 'accepted'
        and (
          (fr.sender_id = auth.uid() and fr.receiver_id = items.user_id)
          or (fr.receiver_id = auth.uid() and fr.sender_id = items.user_id)
        )
    )
  );

-- ---------------------------------------------------------------------------
-- 4. Profiles: username lookup for "Add friends"
-- ---------------------------------------------------------------------------
-- If you already have a permissive SELECT on profiles for authenticated users, skip this.
-- Otherwise, allow any signed-in user to read id + username (needed for search).

drop policy if exists "profiles_select_authenticated_directory" on public.profiles;
create policy "profiles_select_authenticated_directory"
  on public.profiles for select
  to authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- Notes
-- ---------------------------------------------------------------------------
-- - Ensure `public.profiles.id` matches `auth.users.id` (typical pattern).
-- - If `profiles_select_authenticated_directory` is too broad for your product,
--   replace with a SECURITY DEFINER RPC that returns only id/username by exact match.
-- - Do NOT grant INSERT/UPDATE/DELETE on items to friends; SELECT-only is enough for read UI.

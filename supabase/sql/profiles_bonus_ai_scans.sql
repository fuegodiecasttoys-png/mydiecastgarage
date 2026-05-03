-- One-time scan pack credits (Stripe $0.99 pack). Run once in Supabase SQL Editor.
alter table public.profiles
  add column if not exists bonus_ai_scans integer not null default 0;

comment on column public.profiles.bonus_ai_scans is
  'Extra model scans from purchased packs; consumed after the 50/month Pro allowance.';

-- Extra AI scan credits (Stripe $0.99 pack, 50 diecast model scans). Run once in Supabase SQL Editor.
-- Canonical column name in this app: ai_credits (not card-related).
alter table public.profiles
  add column if not exists ai_credits integer not null default 0;

comment on column public.profiles.ai_credits is
  'Extra diecast model AI scans from purchased packs; used after the 50/month Pro allowance.';

-- Idempotency for Stripe webhooks (pack credits, checkout, subscription lifecycle).
-- Run in Supabase SQL Editor before relying on webhook deduplication.

create table if not exists public.stripe_processed_events (
  id uuid primary key default gen_random_uuid(),
  stripe_event_id text not null unique,
  stripe_session_id text unique,
  type text not null,
  created_at timestamptz not null default now()
);

comment on table public.stripe_processed_events is
  'Stripe webhook deliveries already applied; prevents duplicate grants on retries.';

create index if not exists stripe_processed_events_created_at_idx
  on public.stripe_processed_events (created_at desc);

alter table public.stripe_processed_events enable row level security;

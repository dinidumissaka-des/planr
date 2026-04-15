-- ─── Referral System ──────────────────────────────────────────────────────────
--
-- Table 1: referral_codes — one row per user, stores their unique shareable code.
-- Table 2: referral_uses  — one row per successful conversion (signup with a code).
--
-- Run this in the Supabase SQL editor.
-- ──────────────────────────────────────────────────────────────────────────────

-- 1. referral_codes
create table if not exists public.referral_codes (
  user_id    uuid        primary key references auth.users on delete cascade,
  code       text        not null unique,
  created_at timestamptz not null default now()
);

create index if not exists referral_codes_code_idx on public.referral_codes (code);

alter table public.referral_codes enable row level security;

-- Users can read and upsert their own code only.
create policy "users can manage their own referral code"
  on public.referral_codes
  for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- 2. referral_uses
create table if not exists public.referral_uses (
  id          uuid        primary key default gen_random_uuid(),
  code        text        not null references public.referral_codes (code) on delete cascade,
  referrer_id uuid        not null references auth.users on delete cascade,
  referred_id uuid        not null references auth.users on delete cascade,
  created_at  timestamptz not null default now(),
  unique (referred_id)  -- one person can only be referred once
);

create index if not exists referral_uses_code_idx       on public.referral_uses (code);
create index if not exists referral_uses_referrer_id_idx on public.referral_uses (referrer_id);

alter table public.referral_uses enable row level security;

-- Referrer can read their own conversions.
create policy "referrer can read their conversions"
  on public.referral_uses
  for select
  using (auth.uid() = referrer_id);

-- Any authenticated user can insert a use (needed at signup time).
create policy "authenticated users can record referral use"
  on public.referral_uses
  for insert
  with check (auth.uid() = referred_id);

-- Anyone can read a code row (needed to validate code at signup without auth).
create policy "anyone can look up a referral code"
  on public.referral_codes
  for select
  using (true);

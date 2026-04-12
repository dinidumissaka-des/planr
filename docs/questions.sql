-- ─── Questions table ──────────────────────────────────────────────────────────
--
-- Run this in your Supabase project → SQL Editor
--
-- ──────────────────────────────────────────────────────────────────────────────

create table if not exists public.questions (
  id                  uuid        primary key default gen_random_uuid(),
  user_id             uuid        not null references auth.users on delete cascade,
  question            text        not null,
  description         text,
  category            text,
  consultant_name     text        not null default 'Planr Team',
  consultant_initials text        not null default 'PT',
  consultant_role     text        not null default 'Support',
  created_at          timestamptz not null default now()
);

-- Index for per-user queries newest first
create index if not exists questions_user_id_idx
  on public.questions (user_id, created_at desc);

-- Row Level Security
alter table public.questions enable row level security;

create policy "Users can read own questions"
  on public.questions for select
  using (auth.uid() = user_id);

create policy "Users can insert own questions"
  on public.questions for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own questions"
  on public.questions for delete
  using (auth.uid() = user_id);

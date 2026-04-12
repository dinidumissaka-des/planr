-- ─── Consultations table ──────────────────────────────────────────────────────
--
-- Run this in your Supabase project → SQL Editor
--
-- ──────────────────────────────────────────────────────────────────────────────

create table if not exists public.consultations (
  id                 uuid        primary key default gen_random_uuid(),
  user_id            uuid        not null references auth.users on delete cascade,
  architect_id       int,
  architect_name     text        not null,
  architect_initials text        not null,
  consultation_type  text        not null,
  scheduled_at       timestamptz not null,
  status             text        not null default 'upcoming'
                     check (status in ('upcoming', 'ongoing', 'completed')),
  notes              text,
  categories         text[],
  created_at         timestamptz not null default now()
);

-- Index for per-user queries ordered by date
create index if not exists consultations_user_id_idx
  on public.consultations (user_id, scheduled_at asc);

-- Row Level Security
alter table public.consultations enable row level security;

create policy "Users can read own consultations"
  on public.consultations for select
  using (auth.uid() = user_id);

create policy "Users can insert own consultations"
  on public.consultations for insert
  with check (auth.uid() = user_id);

create policy "Users can update own consultations"
  on public.consultations for update
  using (auth.uid() = user_id);

create policy "Users can delete own consultations"
  on public.consultations for delete
  using (auth.uid() = user_id);

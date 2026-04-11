-- ─── Notifications table ──────────────────────────────────────────────────────
--
-- Run this in your Supabase project → SQL Editor
--
-- ──────────────────────────────────────────────────────────────────────────────

create table if not exists public.notifications (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references auth.users on delete cascade,
  type        text        not null default 'info',   -- 'success' | 'info' | 'warning'
  title       text        not null,
  body        text        not null,
  read        boolean     not null default false,
  created_at  timestamptz not null default now()
);

-- Index for per-user queries
create index if not exists notifications_user_id_idx on public.notifications (user_id, created_at desc);

-- Row Level Security
alter table public.notifications enable row level security;

create policy "Users can read own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "Users can delete own notifications"
  on public.notifications for delete
  using (auth.uid() = user_id);

-- ─── Welcome notification trigger ─────────────────────────────────────────────
--
-- Fires whenever a new row is inserted into auth.users (i.e. every sign-up).
-- Uses SECURITY DEFINER so it can write to public.notifications even though
-- the new user has no session yet.
-- ──────────────────────────────────────────────────────────────────────────────

create or replace function public.create_welcome_notification()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.notifications (user_id, type, title, body)
  values (
    new.id,
    'success',
    'Welcome to Planr!',
    'Your account is all set. Browse architects, book a consultation, or head to Q&A to ask your first question.'
  );
  return new;
end;
$$;

-- Drop first in case it already exists, then recreate
drop trigger if exists on_auth_user_created_notification on auth.users;

create trigger on_auth_user_created_notification
  after insert on auth.users
  for each row
  execute procedure public.create_welcome_notification();

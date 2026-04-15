-- ─── Consultant profiles ───────────────────────────────────────────────────
-- Run this in Supabase SQL editor before using the consultant dashboard.

CREATE TABLE IF NOT EXISTS public.consultant_profiles (
  user_id          uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  display_name     text NOT NULL,
  specialization   text NOT NULL DEFAULT 'General',
  bio              text,
  years_experience int,
  created_at       timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.consultant_profiles ENABLE ROW LEVEL SECURITY;

-- Consultants can read and update their own profile
DROP POLICY IF EXISTS "consultant_profiles_select" ON public.consultant_profiles;
CREATE POLICY "consultant_profiles_select" ON public.consultant_profiles
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "consultant_profiles_insert" ON public.consultant_profiles;
CREATE POLICY "consultant_profiles_insert" ON public.consultant_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "consultant_profiles_update" ON public.consultant_profiles;
CREATE POLICY "consultant_profiles_update" ON public.consultant_profiles
  FOR UPDATE USING (auth.uid() = user_id);


-- ─── Link consultations to consultant users ────────────────────────────────
-- Adds consultant_user_id to the existing consultations table so bookings
-- can be assigned to a specific consultant account.

ALTER TABLE public.consultations
  ADD COLUMN IF NOT EXISTS consultant_user_id uuid REFERENCES auth.users;

-- Consultants can view bookings assigned to them
DROP POLICY IF EXISTS "consultations_consultant_select" ON public.consultations;
CREATE POLICY "consultations_consultant_select" ON public.consultations
  FOR SELECT USING (auth.uid() = consultant_user_id);

-- Consultants can update status of bookings assigned to them
DROP POLICY IF EXISTS "consultations_consultant_update" ON public.consultations;
CREATE POLICY "consultations_consultant_update" ON public.consultations
  FOR UPDATE USING (auth.uid() = consultant_user_id);


-- ─── Extend questions table for replies ────────────────────────────────────

ALTER TABLE public.questions
  ADD COLUMN IF NOT EXISTS reply        text,
  ADD COLUMN IF NOT EXISTS replied_at   timestamptz,
  ADD COLUMN IF NOT EXISTS replied_by   uuid REFERENCES auth.users,
  ADD COLUMN IF NOT EXISTS is_answered  boolean NOT NULL DEFAULT false;

-- Consultants can read all questions
DROP POLICY IF EXISTS "questions_consultant_select" ON public.questions;
CREATE POLICY "questions_consultant_select" ON public.questions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.consultant_profiles
      WHERE user_id = auth.uid()
    )
  );

-- Consultants can update questions (to add replies)
DROP POLICY IF EXISTS "questions_consultant_update" ON public.questions;
CREATE POLICY "questions_consultant_update" ON public.questions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.consultant_profiles
      WHERE user_id = auth.uid()
    )
  );

-- ─── Extended consultant profiles ─────────────────────────────────────────────
-- Run this AFTER docs/consultant.sql in Supabase SQL editor.

ALTER TABLE public.consultant_profiles
  ADD COLUMN IF NOT EXISTS role              text,
  ADD COLUMN IF NOT EXISTS category          text,
  ADD COLUMN IF NOT EXISTS company           text,
  ADD COLUMN IF NOT EXISTS location          text,
  ADD COLUMN IF NOT EXISTS working_hours     text,
  ADD COLUMN IF NOT EXISTS specializations   text[]       NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS experience        jsonb        NOT NULL DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS education         jsonb        NOT NULL DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS portfolio         jsonb        NOT NULL DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS reviews           jsonb        NOT NULL DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS rating            numeric(3,1) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS review_count      int          NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_visible        boolean      NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS profile_completed boolean      NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS updated_at        timestamptz;

-- Drop the old single-value select policy (only allowed own row)
DROP POLICY IF EXISTS "consultant_profiles_select" ON public.consultant_profiles;

-- All authenticated users can read visible profiles; consultants can read their own
CREATE POLICY "consultant_profiles_select" ON public.consultant_profiles
  FOR SELECT USING (
    is_visible = true OR auth.uid() = user_id
  );

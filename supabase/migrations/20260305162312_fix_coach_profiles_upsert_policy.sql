/*
  # Fix coach_profiles upsert policy

  ## Problem
  The upsert (insert or update) in TutorForm fails because there is no UPDATE RLS policy
  that allows the coach to update their own profile when it already exists.
  The existing "Coaches can update own profile" policy exists but the upsert needs
  an explicit policy that covers the UPDATE part when user_id matches.

  ## Changes
  - Drop and recreate the UPDATE policy to ensure it works correctly with upsert
  - Add a unique constraint on user_id in coach_profiles (required for upsert onConflict)
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'coach_profiles_user_id_key' AND conrelid = 'coach_profiles'::regclass
  ) THEN
    ALTER TABLE coach_profiles ADD CONSTRAINT coach_profiles_user_id_key UNIQUE (user_id);
  END IF;
END $$;

DROP POLICY IF EXISTS "Coaches can update own profile" ON coach_profiles;

CREATE POLICY "Coaches can update own profile"
  ON coach_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

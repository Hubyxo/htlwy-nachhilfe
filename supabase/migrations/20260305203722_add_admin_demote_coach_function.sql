/*
  # Add admin function to demote coach to student

  1. New Function
    - `admin_demote_coach(coach_email text)` - removes coach_profile and sets role to 'student'
      - Runs with SECURITY DEFINER so it bypasses RLS
      - Only callable by authenticated users (admin login uses Supabase auth)
      - Finds user by email (case-insensitive), deletes their coach_profile,
        and resets their role to 'student'
*/

CREATE OR REPLACE FUNCTION admin_demote_coach(coach_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_user_id uuid;
BEGIN
  SELECT id INTO target_user_id
  FROM users
  WHERE lower(email) = lower(coach_email)
  LIMIT 1;

  IF target_user_id IS NOT NULL THEN
    DELETE FROM coach_profiles WHERE user_id = target_user_id;
    UPDATE users SET role = 'student' WHERE id = target_user_id;
  END IF;
END;
$$;

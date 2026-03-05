/*
  # Allow authenticated users to read other users' profiles

  ## Problem
  The users table SELECT policy only allows users to read their own profile (auth.uid() = id).
  This breaks the booking flow: when a student tries to book a coach, the app looks up
  the coach's user record by email to get their user_id. But with the current policy,
  the student can only see their own record, so the coach lookup returns null,
  and the booking fails with "no_account" error.

  ## Changes
  - Drop the restrictive "Users can view own profile" policy
  - Add a new policy allowing any authenticated user to read any user profile
    (this is necessary for the booking lookup by email)
*/

DROP POLICY IF EXISTS "Users can view own profile" ON users;

CREATE POLICY "Authenticated users can view all profiles"
  ON users FOR SELECT
  TO authenticated
  USING (true);

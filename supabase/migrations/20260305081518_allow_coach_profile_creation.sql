/*
  # Allow coach profile creation

  1. Changes
    - Add INSERT policy for coach_profiles table
    
  2. Security
    - Authenticated users can create their own coach profile
*/

CREATE POLICY "Users can create own coach profile"
  ON coach_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

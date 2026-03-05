/*
  # Allow user creation on first login

  1. Changes
    - Add INSERT policy for users table to allow authenticated users to create their own profile
    
  2. Security
    - Users can only create a profile for their own auth ID
*/

CREATE POLICY "Users can create own profile"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

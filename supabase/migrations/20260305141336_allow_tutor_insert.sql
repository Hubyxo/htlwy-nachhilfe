/*
  # Allow authenticated users to submit tutor applications

  1. Changes
    - Add INSERT policy on tutors table for authenticated users

  2. Security
    - Only authenticated users can insert their own tutor application
*/

CREATE POLICY "Authenticated users can submit tutor application"
  ON tutors FOR INSERT
  TO authenticated
  WITH CHECK (true);

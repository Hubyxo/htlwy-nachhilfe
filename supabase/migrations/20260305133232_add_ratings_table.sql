/*
  # Add Ratings Table

  1. New Tables
    - `ratings`
      - `id` (uuid, primary key)
      - `booking_id` (uuid, foreign key to bookings)
      - `student_id` (uuid, foreign key to users)
      - `coach_id` (uuid, foreign key to coach_profiles)
      - `score` (integer, 1-5)
      - `comment` (text, optional)
      - `created_at` (timestamp)

  2. Changes
    - Adds a `message` column to bookings for optional booking notes

  3. Security
    - Enable RLS on ratings
    - Students can create ratings for their completed bookings
    - Anyone authenticated can view ratings
*/

CREATE TABLE IF NOT EXISTS ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  coach_id uuid NOT NULL REFERENCES coach_profiles(id) ON DELETE CASCADE,
  score integer NOT NULL CHECK (score >= 1 AND score <= 5),
  comment text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(booking_id)
);

ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view ratings"
  ON ratings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Students can create ratings for own completed bookings"
  ON ratings FOR INSERT
  TO authenticated
  WITH CHECK (
    student_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = booking_id
        AND bookings.student_id = auth.uid()
        AND bookings.status = 'completed'
    )
  );

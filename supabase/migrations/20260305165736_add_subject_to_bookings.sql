/*
  # Add subject column to bookings table

  1. Changes
    - Add `subject` column (text, nullable) to `bookings` table
      - Stores the subject the student wants coaching for
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'subject'
  ) THEN
    ALTER TABLE bookings ADD COLUMN subject text;
  END IF;
END $$;

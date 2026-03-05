/*
  # Add rejection_reason column to bookings

  1. Changes
    - Add `rejection_reason` column (text, nullable) to `bookings` table
      - Stores the reason given by the coach when rejecting a booking request
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'rejection_reason'
  ) THEN
    ALTER TABLE bookings ADD COLUMN rejection_reason text;
  END IF;
END $$;

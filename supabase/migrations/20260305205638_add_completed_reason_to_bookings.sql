/*
  # Add completed_reason to bookings

  Adds a nullable text column to store the reason when a coach ends/completes an active coaching session.

  1. Modified Tables
    - `bookings`
      - `completed_reason` (text, nullable): reason provided by coach when marking coaching as completed
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'completed_reason'
  ) THEN
    ALTER TABLE bookings ADD COLUMN completed_reason text;
  END IF;
END $$;

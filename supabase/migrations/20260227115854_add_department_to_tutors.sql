/*
  # Add department column to tutors table

  1. Changes
    - Add `department` column to `tutors` table to store the selected department
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tutors' AND column_name = 'department'
  ) THEN
    ALTER TABLE tutors ADD COLUMN department text;
  END IF;
END $$;
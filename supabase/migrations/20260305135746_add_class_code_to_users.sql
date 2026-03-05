/*
  # Add class_code column to users table

  1. Changes
    - `users` table: add `class_code` column (text, nullable)
      - Stores the HTL class code derived from Microsoft/Azure AD metadata
      - Examples: 3AHET, 2AHMBA, 1AHIT, 5BHWIM
      - Null for teachers or users whose class cannot be determined
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'class_code'
  ) THEN
    ALTER TABLE users ADD COLUMN class_code text;
  END IF;
END $$;

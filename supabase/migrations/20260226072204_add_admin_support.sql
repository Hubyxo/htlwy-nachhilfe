/*
  # Add Admin Support

  1. Changes to existing tables
    - No changes to tutors and students tables
  
  2. New Tables
    - `admin_sessions` (for managing admin login sessions)
      - `id` (uuid, primary key)
      - `session_token` (text, unique)
      - `created_at` (timestamp)
      - `expires_at` (timestamp)

  2. Security
    - Enable RLS on admin_sessions table
    - Public insert/select for admin authentication
    - Sessions expire after 24 hours
*/

CREATE TABLE IF NOT EXISTS admin_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_token text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT (now() + interval '24 hours')
);

ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create admin sessions"
  ON admin_sessions
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can query admin sessions"
  ON admin_sessions
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can delete expired admin sessions"
  ON admin_sessions
  FOR DELETE
  USING (true);
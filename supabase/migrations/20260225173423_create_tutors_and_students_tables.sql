/*
  # Create Tutors and Students Tables

  1. New Tables
    - `tutors` (Nachhilfecoaches)
      - `id` (uuid, primary key)
      - `full_name` (text)
      - `email` (text)
      - `subjects` (text array - Fächer the coach teaches)
      - `school_year` (text - e.g., "3. Jahrgang")
      - `availability` (text - additional info about availability)
      - `additional_info` (text - extra information from form)
      - `created_at` (timestamp)
    
    - `students` (Nachhilfe suchende)
      - `id` (uuid, primary key)
      - `full_name` (text)
      - `email` (text)
      - `subjects` (text array - Fächer where help is needed)
      - `school_year` (text - e.g., "3. Jahrgang")
      - `availability` (text - additional info about availability)
      - `additional_info` (text - extra information from form)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access (coaches list)
    - Add policies for form submissions
*/

CREATE TABLE IF NOT EXISTS tutors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  subjects text[] NOT NULL DEFAULT '{}',
  school_year text NOT NULL,
  availability text,
  additional_info text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  subjects text[] NOT NULL DEFAULT '{}',
  school_year text NOT NULL,
  availability text,
  additional_info text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tutors ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view tutors"
  ON tutors
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert tutor applications"
  ON tutors
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view students"
  ON students
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert student applications"
  ON students
  FOR INSERT
  WITH CHECK (true);
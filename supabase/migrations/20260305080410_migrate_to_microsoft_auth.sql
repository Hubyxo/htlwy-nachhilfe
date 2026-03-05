/*
  # Migrate to Microsoft Authentication and Booking System

  1. New Tables
    - `users` (replaces old tutor/student system)
      - `id` (uuid, primary key, matches auth.users)
      - `email` (text, unique)
      - `display_name` (text)
      - `profile_image_url` (text, optional)
      - `role` (enum: 'student', 'coach')
      - `created_at` (timestamp)
    
    - `coach_profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `department` (text)
      - `class` (text, e.g., "3AHET")
      - `subjects` (text array)
      - `availability` (text)
      - `additional_info` (text)
      - `rating` (decimal, optional)
      - `completed_bookings` (integer, default 0)
      - `created_at` (timestamp)
    
    - `bookings`
      - `id` (uuid, primary key)
      - `student_id` (uuid, foreign key to users)
      - `coach_id` (uuid, foreign key to coach_profiles)
      - `status` (enum: 'pending', 'confirmed', 'completed', 'cancelled')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `notifications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `type` (text: 'booking_request', 'booking_confirmed', etc.)
      - `related_booking_id` (uuid, optional)
      - `message` (text)
      - `read` (boolean, default false)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all new tables
    - Users can only see their own data
    - Coaches can confirm/reject bookings
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY,
  email text UNIQUE NOT NULL,
  display_name text NOT NULL,
  profile_image_url text,
  role text NOT NULL CHECK (role IN ('student', 'coach')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE TABLE IF NOT EXISTS coach_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  department text NOT NULL,
  class text NOT NULL,
  subjects text[] NOT NULL,
  availability text NOT NULL,
  additional_info text,
  rating decimal(3, 2),
  completed_bookings integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE coach_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Coaches can view own profile"
  ON coach_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Students can view all coach profiles"
  ON coach_profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Coaches can update own profile"
  ON coach_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  coach_id uuid NOT NULL REFERENCES coach_profiles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Coaches can view their bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (
    coach_id IN (
      SELECT id FROM coach_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Students can create bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Coaches can update booking status"
  ON bookings FOR UPDATE
  TO authenticated
  USING (
    coach_id IN (
      SELECT id FROM coach_profiles WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    coach_id IN (
      SELECT id FROM coach_profiles WHERE user_id = auth.uid()
    )
  );

CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type text NOT NULL,
  related_booking_id uuid REFERENCES bookings(id) ON DELETE SET NULL,
  message text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);
/*
  # Add notification update policy

  1. Changes
    - Add UPDATE policy on notifications so users can mark their own notifications as read

  2. Security
    - Only the notification's owner can update it
*/

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

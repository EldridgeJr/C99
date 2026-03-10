/*
  # Fix Courses RLS Policy

  1. Changes
    - Update RLS policy to allow both authenticated and anonymous users to view courses
    - This ensures the course catalog is visible to all users

  2. Security
    - Read-only access for all users
    - Write access remains restricted
*/

-- Drop existing policy
DROP POLICY IF EXISTS "Anyone can view courses" ON courses;

-- Create new policy that allows both authenticated and anon users
CREATE POLICY "Anyone can view courses"
  ON courses
  FOR SELECT
  USING (true);

/*
  # Fix Business Resources RLS Policy

  1. Changes
    - Update RLS policy to allow both authenticated and anonymous users to view published resources
    - This ensures the resources section is visible to all users

  2. Security
    - Read-only access for published resources for all users
    - Write access remains restricted to admins
*/

-- Drop existing policy
DROP POLICY IF EXISTS "Clients can view published resources" ON business_resources;

-- Create new policy that allows both authenticated and anon users to view published resources
CREATE POLICY "Anyone can view published resources"
  ON business_resources
  FOR SELECT
  USING (is_published = true);

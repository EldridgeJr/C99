/*
  # Add email field to profiles table

  1. Changes
    - Add `email` column to profiles table to store user email for easier access
    - This duplicates the email from auth.users but makes it accessible via normal queries
    - Update existing profiles to populate email from auth.users

  2. Security
    - No changes to RLS policies needed
*/

-- Add email column to profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'email'
  ) THEN
    ALTER TABLE profiles ADD COLUMN email text;
  END IF;
END $$;

-- Populate email for existing profiles from auth.users
UPDATE profiles
SET email = auth.users.email
FROM auth.users
WHERE profiles.id = auth.users.id AND profiles.email IS NULL;

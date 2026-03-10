/*
  # Add password field to profiles table

  1. Changes
    - Add `password` column to `profiles` table to store client passwords
    - This allows law firms to view and share login credentials with clients
  
  2. Security Note
    - Password is stored in plain text for law firm admin access
    - This is intentional for this use case where firms need to provide credentials to clients
*/

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS password TEXT;

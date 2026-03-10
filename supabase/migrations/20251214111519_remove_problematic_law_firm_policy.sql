/*
  # Remove Problematic Law Firm RLS Policy
  
  1. Changes
    - Drop "Law firms can view their clients" policy that causes authentication deadlock
    - This policy was causing recursive queries during authentication
    
  2. Notes
    - Law firm admins will still have their admin privileges
    - Can add back a simpler version later using a different approach
    - Users can still view their own profiles
*/

-- Drop the problematic policy that causes deadlock
DROP POLICY IF EXISTS "Law firms can view their clients" ON profiles;

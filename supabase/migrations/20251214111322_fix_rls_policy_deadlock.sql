/*
  # Fix RLS Policy Deadlock Issue
  
  1. Changes
    - Drop the problematic "Law firms can view their clients" policy
    - Recreate it without querying auth.users during policy evaluation
    - Use a more efficient query structure
    
  2. Security
    - Maintain same security level
    - Prevent deadlock during authentication
*/

-- Drop the problematic policy
DROP POLICY IF EXISTS "Law firms can view their clients" ON profiles;

-- Recreate the policy with a better structure that doesn't query auth.users
-- This allows law firm admins to view profiles that belong to their firm
CREATE POLICY "Law firms can view their clients"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    -- Law firm admin can see clients from their firm
    EXISTS (
      SELECT 1 
      FROM profiles p
      INNER JOIN law_firms lf ON p.law_firm_id = lf.id
      WHERE p.id = profiles.id
        AND profiles.law_firm_id = p.law_firm_id
        AND EXISTS (
          SELECT 1 FROM profiles admin_profile
          WHERE admin_profile.id = auth.uid()
            AND admin_profile.user_type = 'admin'
            AND admin_profile.law_firm_id = profiles.law_firm_id
        )
    )
  );

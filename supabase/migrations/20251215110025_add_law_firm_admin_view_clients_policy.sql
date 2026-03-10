/*
  # Allow law firm admins to view client profiles
  
  1. Changes
    - Add SELECT policy for law firm admins to view client profiles from their firm
    
  2. Security
    - Only allows admins to view clients belonging to their law firm
    - Ensures proper data isolation between law firms
*/

CREATE POLICY "Law firm admins can view client profiles from their firm"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM profiles p
      WHERE p.id = auth.uid()
        AND p.user_type = 'admin'
        AND p.law_firm_id = profiles.law_firm_id
    )
  );
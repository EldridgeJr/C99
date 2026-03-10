/*
  # Fix Law Firms RLS Policy
  
  1. Changes
    - Drop existing law_firms policy that may cause issues
    - Create separate policies for Court99 admins and law firm admins
    - Court99 admins (no law_firm_id) can manage all law firms
    - Law firm admins can only view their own law firm
  
  2. Security
    - Ensures proper separation of permissions
    - Prevents circular dependency issues
*/

-- Drop existing policy
DROP POLICY IF EXISTS "Admins can manage all law firms" ON law_firms;

-- Court99 admins can manage all law firms
CREATE POLICY "Court99 admins can manage all law firms"
  ON law_firms
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.user_type = 'admin'
      AND profiles.law_firm_id IS NULL
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.user_type = 'admin'
      AND profiles.law_firm_id IS NULL
    )
  );

-- Law firm admins can view their own firm
CREATE POLICY "Law firm admins can view their own firm"
  ON law_firms
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.user_type = 'admin'
      AND profiles.law_firm_id = law_firms.id
    )
  );

/*
  # Allow Law Firm Admins to Create Client Profiles

  1. Changes
    - Add INSERT policy for law firm admins to create client profiles for their firm
    - This allows law firm admins to onboard new clients
    
  2. Security
    - Law firm admins can only create profiles with user_type = 'client'
    - They can only assign clients to their own law firm
*/

CREATE POLICY "Law firm admins can insert client profiles for their firm"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.user_type = 'admin'
      AND p.law_firm_id = profiles.law_firm_id
    )
    AND profiles.user_type = 'client'
  );

CREATE POLICY "Court99 admins can insert any profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.user_type = 'admin'
      AND p.law_firm_id IS NULL
    )
  );

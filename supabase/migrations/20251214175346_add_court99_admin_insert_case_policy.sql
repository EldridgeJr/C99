/*
  # Add Court99 Admin INSERT Policy for Cases

  1. Changes
    - Add INSERT policy for Court99 admins to create cases for any law firm
    
  2. Security
    - Court99 admins (user_type = 'admin' with law_firm_id IS NULL) can insert cases for any firm
*/

CREATE POLICY "Court99 admins can insert cases for any firm"
  ON cases FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'admin'
      AND profiles.law_firm_id IS NULL
    )
  );

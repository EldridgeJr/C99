/*
  # Create Client Content Assignments Schema
  
  1. New Tables
    - `client_content_assignments`
      - `id` (uuid, primary key)
      - `client_id` (uuid, references profiles)
      - `content_type` (text: 'course', 'podcast', 'content_item')
      - `content_id` (uuid)
      - `assigned_by` (uuid, references profiles - the admin who assigned it)
      - `assigned_at` (timestamptz)
      - `is_active` (boolean, default true)
  
  2. Security
    - Enable RLS on `client_content_assignments` table
    - Add policy for clients to view their own content assignments
    - Add policy for law firm admins to manage content assignments for their clients
    - Add policy for Court99 admins to manage all content assignments
  
  3. Indexes
    - Add index on (client_id, content_type, content_id) for fast lookups
    - Add index on client_id for filtering
*/

CREATE TABLE IF NOT EXISTS client_content_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content_type text NOT NULL CHECK (content_type IN ('course', 'podcast', 'content_item')),
  content_id uuid NOT NULL,
  assigned_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  assigned_at timestamptz DEFAULT now() NOT NULL,
  is_active boolean DEFAULT true NOT NULL
);

ALTER TABLE client_content_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can view their own content assignments"
  ON client_content_assignments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = client_id);

CREATE POLICY "Law firm admins can view content assignments for their clients"
  ON client_content_assignments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles admin
      JOIN profiles client ON client.id = client_content_assignments.client_id
      WHERE admin.id = auth.uid()
        AND admin.user_type = 'admin'
        AND admin.law_firm_id = client.law_firm_id
        AND admin.law_firm_id IS NOT NULL
    )
  );

CREATE POLICY "Law firm admins can insert content assignments for their clients"
  ON client_content_assignments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles admin
      JOIN profiles client ON client.id = client_content_assignments.client_id
      WHERE admin.id = auth.uid()
        AND admin.user_type = 'admin'
        AND admin.law_firm_id = client.law_firm_id
        AND admin.law_firm_id IS NOT NULL
    )
  );

CREATE POLICY "Law firm admins can update content assignments for their clients"
  ON client_content_assignments
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles admin
      JOIN profiles client ON client.id = client_content_assignments.client_id
      WHERE admin.id = auth.uid()
        AND admin.user_type = 'admin'
        AND admin.law_firm_id = client.law_firm_id
        AND admin.law_firm_id IS NOT NULL
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles admin
      JOIN profiles client ON client.id = client_content_assignments.client_id
      WHERE admin.id = auth.uid()
        AND admin.user_type = 'admin'
        AND admin.law_firm_id = client.law_firm_id
        AND admin.law_firm_id IS NOT NULL
    )
  );

CREATE POLICY "Law firm admins can delete content assignments for their clients"
  ON client_content_assignments
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles admin
      JOIN profiles client ON client.id = client_content_assignments.client_id
      WHERE admin.id = auth.uid()
        AND admin.user_type = 'admin'
        AND admin.law_firm_id = client.law_firm_id
        AND admin.law_firm_id IS NOT NULL
    )
  );

CREATE POLICY "Court99 admins can manage all content assignments"
  ON client_content_assignments
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

CREATE INDEX IF NOT EXISTS idx_client_content_assignments_lookup 
  ON client_content_assignments(client_id, content_type, content_id);

CREATE INDEX IF NOT EXISTS idx_client_content_assignments_client 
  ON client_content_assignments(client_id);

CREATE INDEX IF NOT EXISTS idx_client_content_assignments_active 
  ON client_content_assignments(client_id, is_active) 
  WHERE is_active = true;
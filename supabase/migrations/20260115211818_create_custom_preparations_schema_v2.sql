/*
  # Custom Preparation Schema

  1. New Tables
    - `custom_preparations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `document_name` (text)
      - `document_type` (text)
      - `document_url` (text, storage reference)
      - `analysis_data` (jsonb, stores AI analysis results)
      - `status` (text: 'pending', 'analyzing', 'completed', 'failed')
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `custom_preparations` table
    - Users can only view and create their own preparations
    - Law firm admins can view preparations of their clients
*/

CREATE TABLE IF NOT EXISTS custom_preparations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  document_name text NOT NULL,
  document_type text,
  document_url text,
  analysis_data jsonb,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'analyzing', 'completed', 'failed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE custom_preparations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own preparations"
  ON custom_preparations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own preparations"
  ON custom_preparations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preparations"
  ON custom_preparations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Law firm admins can view client preparations"
  ON custom_preparations
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN cases c ON c.client_id = custom_preparations.user_id
      WHERE p.id = auth.uid()
      AND p.user_type = 'law_firm_admin'
      AND c.law_firm_id = p.law_firm_id
    )
  );

CREATE INDEX IF NOT EXISTS idx_custom_preparations_user_id ON custom_preparations(user_id);
CREATE INDEX IF NOT EXISTS idx_custom_preparations_status ON custom_preparations(status);
CREATE INDEX IF NOT EXISTS idx_custom_preparations_created_at ON custom_preparations(created_at DESC);

/*
  # Create Law Firm Content Access Schema

  1. New Tables
    - `law_firm_content_access`
      - `id` (uuid, primary key)
      - `law_firm_id` (uuid, foreign key to law_firms)
      - `content_type` (text) - 'course' or 'podcast'
      - `content_id` (uuid) - ID of the course or podcast
      - `is_enabled` (boolean) - Whether the content is visible to clients
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - Unique constraint on (law_firm_id, content_type, content_id)

  2. Security
    - Enable RLS on law_firm_content_access table
    - Law firm admins can view and manage their own law firm's content access
    - Clients can view their law firm's content access settings (read-only)

  3. Notes
    - By default, if no record exists, content is considered enabled
    - Law firm admins explicitly disable content for their clients
    - This allows fine-grained control over what clients see
*/

-- Create law_firm_content_access table
CREATE TABLE IF NOT EXISTS law_firm_content_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  law_firm_id uuid NOT NULL REFERENCES law_firms(id) ON DELETE CASCADE,
  content_type text NOT NULL CHECK (content_type IN ('course', 'podcast')),
  content_id uuid NOT NULL,
  is_enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(law_firm_id, content_type, content_id)
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_law_firm_content_access_law_firm_id ON law_firm_content_access(law_firm_id);
CREATE INDEX IF NOT EXISTS idx_law_firm_content_access_content ON law_firm_content_access(content_type, content_id);

-- Enable Row Level Security
ALTER TABLE law_firm_content_access ENABLE ROW LEVEL SECURITY;

-- RLS Policies for law_firm_content_access table
CREATE POLICY "Law firm admins can view their content access settings"
  ON law_firm_content_access
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'admin'
      AND profiles.law_firm_id = law_firm_content_access.law_firm_id
    )
  );

CREATE POLICY "Law firm admins can insert their content access settings"
  ON law_firm_content_access
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'admin'
      AND profiles.law_firm_id = law_firm_content_access.law_firm_id
    )
  );

CREATE POLICY "Law firm admins can update their content access settings"
  ON law_firm_content_access
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'admin'
      AND profiles.law_firm_id = law_firm_content_access.law_firm_id
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'admin'
      AND profiles.law_firm_id = law_firm_content_access.law_firm_id
    )
  );

CREATE POLICY "Law firm admins can delete their content access settings"
  ON law_firm_content_access
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'admin'
      AND profiles.law_firm_id = law_firm_content_access.law_firm_id
    )
  );

CREATE POLICY "Clients can view their law firm's content access settings"
  ON law_firm_content_access
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'client'
      AND profiles.law_firm_id = law_firm_content_access.law_firm_id
    )
  );

-- Create a function to get enabled content for a law firm
-- This function returns content IDs that are enabled (or have no setting, defaulting to enabled)
CREATE OR REPLACE FUNCTION get_enabled_content_for_law_firm(
  p_law_firm_id uuid,
  p_content_type text
)
RETURNS TABLE (content_id uuid) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT c.id as content_id
  FROM (
    SELECT id FROM courses WHERE p_content_type = 'course'
    UNION ALL
    SELECT id FROM podcasts WHERE p_content_type = 'podcast'
  ) c
  WHERE NOT EXISTS (
    SELECT 1 FROM law_firm_content_access lfca
    WHERE lfca.law_firm_id = p_law_firm_id
    AND lfca.content_type = p_content_type
    AND lfca.content_id = c.id
    AND lfca.is_enabled = false
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

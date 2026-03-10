/*
  # Create Livestreams Schema

  ## Overview
  This migration creates the infrastructure for livestreaming functionality where Court99 admins can create and manage livestreams, and clients can view them.

  ## New Tables
  
  ### `livestreams`
  Stores livestream information created by Court99 admins
  - `id` (uuid, primary key) - Unique identifier for the livestream
  - `title` (text, required) - Title of the livestream
  - `description` (text) - Detailed description of the livestream
  - `stream_url` (text, required) - URL or embed code for the livestream
  - `scheduled_start` (timestamptz) - When the livestream is scheduled to start
  - `scheduled_end` (timestamptz) - When the livestream is scheduled to end
  - `status` (text, required) - Current status: 'scheduled', 'live', 'ended'
  - `created_by` (uuid, required) - Reference to the admin who created it
  - `created_at` (timestamptz) - When the livestream was created
  - `updated_at` (timestamptz) - When the livestream was last updated
  - `thumbnail_url` (text) - URL to the livestream thumbnail image
  - `viewer_count` (integer) - Current number of viewers

  ## Security
  
  ### RLS Policies
  1. Court99 admins can:
     - View all livestreams (SELECT)
     - Create new livestreams (INSERT)
     - Update their own livestreams (UPDATE)
     - Delete their own livestreams (DELETE)
  
  2. Clients can:
     - View livestreams that are 'live' or 'scheduled' (SELECT)
  
  ## Important Notes
  - All tables have RLS enabled for security
  - Livestreams can only be created by Court99 admins (user_type='admin' and law_firm_id IS NULL)
  - Clients can only view livestreams, not create or modify them
  - The status field controls visibility to clients
*/

-- Create livestreams table
CREATE TABLE IF NOT EXISTS livestreams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  stream_url text NOT NULL,
  scheduled_start timestamptz,
  scheduled_end timestamptz,
  status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'ended')),
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  thumbnail_url text,
  viewer_count integer DEFAULT 0
);

-- Enable RLS
ALTER TABLE livestreams ENABLE ROW LEVEL SECURITY;

-- Court99 admins can view all livestreams
CREATE POLICY "Court99 admins can view all livestreams"
  ON livestreams
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'admin'
      AND profiles.law_firm_id IS NULL
    )
  );

-- Court99 admins can create livestreams
CREATE POLICY "Court99 admins can create livestreams"
  ON livestreams
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'admin'
      AND profiles.law_firm_id IS NULL
    )
    AND created_by = auth.uid()
  );

-- Court99 admins can update their own livestreams
CREATE POLICY "Court99 admins can update their own livestreams"
  ON livestreams
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'admin'
      AND profiles.law_firm_id IS NULL
    )
    AND created_by = auth.uid()
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'admin'
      AND profiles.law_firm_id IS NULL
    )
    AND created_by = auth.uid()
  );

-- Court99 admins can delete their own livestreams
CREATE POLICY "Court99 admins can delete their own livestreams"
  ON livestreams
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'admin'
      AND profiles.law_firm_id IS NULL
    )
    AND created_by = auth.uid()
  );

-- Clients can view livestreams that are live or scheduled
CREATE POLICY "Clients can view live and scheduled livestreams"
  ON livestreams
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'client'
    )
    AND status IN ('live', 'scheduled')
  );

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_livestreams_updated_at
  BEFORE UPDATE ON livestreams
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
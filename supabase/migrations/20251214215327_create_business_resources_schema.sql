/*
  # Create Business Resources Schema
  
  1. New Tables
    - `business_resources`
      - `id` (uuid, primary key)
      - `title` (text) - Resource article title
      - `subtitle` (text) - Short subtitle or tagline
      - `content` (text) - Full article content
      - `category` (text) - Category/topic area
      - `order_index` (integer) - Display order
      - `thumbnail_url` (text) - Optional thumbnail image
      - `is_published` (boolean) - Whether the resource is published
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `resource_reads`
      - `id` (uuid, primary key)
      - `client_id` (uuid, foreign key to profiles)
      - `resource_id` (uuid, foreign key to business_resources)
      - `completed` (boolean) - Whether the resource was fully read
      - `last_read_at` (timestamptz) - Last time the user read this
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Clients can view published resources
    - Clients can manage their own read tracking
    - Admins can manage all resources
*/

-- Create business_resources table
CREATE TABLE IF NOT EXISTS business_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text NOT NULL,
  content text NOT NULL,
  category text DEFAULT 'business',
  order_index integer DEFAULT 0,
  thumbnail_url text,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create resource_reads table
CREATE TABLE IF NOT EXISTS resource_reads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  resource_id uuid NOT NULL REFERENCES business_resources(id) ON DELETE CASCADE,
  completed boolean DEFAULT false,
  last_read_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(client_id, resource_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_business_resources_order ON business_resources(order_index);
CREATE INDEX IF NOT EXISTS idx_resource_reads_client_id ON resource_reads(client_id);
CREATE INDEX IF NOT EXISTS idx_resource_reads_resource_id ON resource_reads(resource_id);

-- Enable RLS
ALTER TABLE business_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_reads ENABLE ROW LEVEL SECURITY;

-- RLS Policies for business_resources
CREATE POLICY "Clients can view published resources"
  ON business_resources
  FOR SELECT
  TO authenticated
  USING (is_published = true);

CREATE POLICY "Admins can manage all resources"
  ON business_resources
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type IN ('admin', 'court99_admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type IN ('admin', 'court99_admin')
    )
  );

-- RLS Policies for resource_reads
CREATE POLICY "Clients can view own reads"
  ON resource_reads
  FOR SELECT
  TO authenticated
  USING (client_id = auth.uid());

CREATE POLICY "Clients can insert own reads"
  ON resource_reads
  FOR INSERT
  TO authenticated
  WITH CHECK (client_id = auth.uid());

CREATE POLICY "Clients can update own reads"
  ON resource_reads
  FOR UPDATE
  TO authenticated
  USING (client_id = auth.uid())
  WITH CHECK (client_id = auth.uid());

CREATE POLICY "Admins can view all reads"
  ON resource_reads
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type IN ('admin', 'court99_admin')
    )
  );
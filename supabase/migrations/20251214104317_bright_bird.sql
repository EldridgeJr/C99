/*
  # Create law firms table for operations management

  1. New Tables
    - `law_firms`
      - `id` (uuid, primary key)
      - `name` (text, firm name)
      - `contact_email` (text, primary contact email)
      - `contact_phone` (text, phone number)
      - `address` (text, firm address)
      - `subscription_plan` (text, subscription tier)
      - `status` (text, active/inactive/suspended)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `law_firms` table
    - Add policy for admin users to manage law firms
    - Add policy for law firms to view their own data

  3. Indexes
    - Add index on status for filtering
    - Add index on created_at for sorting
*/

CREATE TABLE IF NOT EXISTS law_firms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  contact_email text UNIQUE NOT NULL,
  contact_phone text,
  address text,
  subscription_plan text DEFAULT 'basic' CHECK (subscription_plan IN ('basic', 'professional', 'enterprise')),
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE law_firms ENABLE ROW LEVEL SECURITY;

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_law_firms_status ON law_firms(status);
CREATE INDEX IF NOT EXISTS idx_law_firms_created_at ON law_firms(created_at);

-- Policies for law firms management
CREATE POLICY "Admins can manage all law firms"
  ON law_firms
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.user_type = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.user_type = 'admin'
    )
  );

-- Add law_firm_id to profiles table to link clients to law firms
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'law_firm_id'
  ) THEN
    ALTER TABLE profiles ADD COLUMN law_firm_id uuid REFERENCES law_firms(id) ON DELETE SET NULL;
    CREATE INDEX IF NOT EXISTS idx_profiles_law_firm_id ON profiles(law_firm_id);
  END IF;
END $$;

-- Update profiles RLS to allow law firms to view their clients
CREATE POLICY "Law firms can view their clients"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    law_firm_id IN (
      SELECT id FROM law_firms 
      WHERE contact_email = (
        SELECT email FROM auth.users WHERE id = auth.uid()
      )
    )
  );
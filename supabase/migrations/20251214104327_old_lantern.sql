/*
  # Seed law firms data for operations dashboard

  1. Sample Data
    - Insert sample law firms with different subscription plans and statuses
    - Create realistic data for testing the operations dashboard

  2. Client Account Associations
    - Link existing profiles to law firms for realistic metrics
*/

-- Insert sample law firms
INSERT INTO law_firms (name, contact_email, contact_phone, address, subscription_plan, status, created_at) VALUES
  ('Mitchell & Associates', 'contact@mitchell-law.com', '(555) 123-4567', '123 Main St, Suite 100, New York, NY 10001', 'professional', 'active', '2024-01-15 10:00:00'),
  ('Thompson Legal Group', 'info@thompsonlegal.com', '(555) 234-5678', '456 Oak Ave, Los Angeles, CA 90210', 'enterprise', 'active', '2024-02-01 14:30:00'),
  ('Davis & Partners', 'admin@davispartners.com', '(555) 345-6789', '789 Pine St, Chicago, IL 60601', 'basic', 'active', '2024-02-15 09:15:00'),
  ('Wilson Law Firm', 'contact@wilsonlaw.com', '(555) 456-7890', '321 Elm St, Houston, TX 77001', 'professional', 'active', '2024-03-01 11:45:00'),
  ('Brown Legal Services', 'info@brownlegal.com', '(555) 567-8901', '654 Maple Dr, Phoenix, AZ 85001', 'basic', 'inactive', '2024-03-10 16:20:00'),
  ('Garcia & Co', 'contact@garcialaw.com', '(555) 678-9012', '987 Cedar Ln, Philadelphia, PA 19101', 'enterprise', 'active', '2024-04-05 13:10:00'),
  ('Johnson Legal', 'admin@johnsonlegal.com', '(555) 789-0123', '147 Birch St, San Antonio, TX 78201', 'professional', 'active', '2024-04-20 10:30:00'),
  ('Miller Law Office', 'info@millerlaw.com', '(555) 890-1234', '258 Spruce Ave, San Diego, CA 92101', 'basic', 'active', '2024-05-01 15:45:00'),
  ('Anderson Legal Group', 'contact@andersonlegal.com', '(555) 901-2345', '369 Willow St, Dallas, TX 75201', 'enterprise', 'active', '2024-05-15 12:00:00'),
  ('Taylor & Associates', 'admin@taylorassoc.com', '(555) 012-3456', '741 Poplar Dr, Austin, TX 73301', 'professional', 'suspended', '2024-06-01 09:30:00');

-- Update existing profiles to be associated with law firms (for demonstration)
-- This creates realistic client account numbers for each firm
DO $$
DECLARE
  firm_ids uuid[];
  profile_ids uuid[];
  i integer;
  firm_index integer;
  profile_count integer;
  firm_count integer;
BEGIN
  -- Get all law firm IDs
  SELECT array_agg(id) INTO firm_ids FROM law_firms;

  -- Get all profile IDs
  SELECT array_agg(id) INTO profile_ids FROM profiles LIMIT 50;

  -- Get counts to check if arrays have data
  profile_count := array_length(profile_ids, 1);
  firm_count := array_length(firm_ids, 1);

  -- Only distribute if we have both profiles and firms
  IF profile_count IS NOT NULL AND firm_count IS NOT NULL AND profile_count > 0 AND firm_count > 0 THEN
    -- Distribute profiles among law firms
    FOR i IN 1..profile_count LOOP
      firm_index := ((i - 1) % firm_count) + 1;

      UPDATE profiles
      SET law_firm_id = firm_ids[firm_index]
      WHERE id = profile_ids[i];
    END LOOP;
  END IF;
END $$;
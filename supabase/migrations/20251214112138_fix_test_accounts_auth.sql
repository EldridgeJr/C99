/*
  # Fix Test Accounts Authentication
  
  1. Changes
    - Remove incorrectly created test accounts
    - Create an edge function to properly create test accounts using Supabase Auth Admin API
    
  2. Note
    - This migration cleans up the incorrectly created accounts
    - Test accounts will be created through the Supabase Auth API instead
*/

-- Delete existing test accounts that were incorrectly created
DO $$
DECLARE
  admin_id uuid;
  lawfirm_admin_id uuid;
  client_id uuid;
BEGIN
  -- Get IDs of test accounts
  SELECT id INTO admin_id FROM auth.users WHERE email = 'admin@court99.com';
  SELECT id INTO lawfirm_admin_id FROM auth.users WHERE email = 'admin@smithpartners.com';
  SELECT id INTO client_id FROM auth.users WHERE email = 'john.doe@example.com';
  
  -- Delete profiles first (due to foreign key)
  IF admin_id IS NOT NULL THEN
    DELETE FROM profiles WHERE id = admin_id;
  END IF;
  
  IF lawfirm_admin_id IS NOT NULL THEN
    DELETE FROM profiles WHERE id = lawfirm_admin_id;
  END IF;
  
  IF client_id IS NOT NULL THEN
    DELETE FROM profiles WHERE id = client_id;
  END IF;
  
  -- Delete from auth.users
  IF admin_id IS NOT NULL THEN
    DELETE FROM auth.users WHERE id = admin_id;
  END IF;
  
  IF lawfirm_admin_id IS NOT NULL THEN
    DELETE FROM auth.users WHERE id = lawfirm_admin_id;
  END IF;
  
  IF client_id IS NOT NULL THEN
    DELETE FROM auth.users WHERE id = client_id;
  END IF;
END $$;

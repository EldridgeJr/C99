/*
  # Fix Test Account Creation (v2)
  
  1. Changes
    - Remove old test accounts if they exist
    - Recreate test accounts using proper auth.users structure
    - Ensure pgcrypto extension is available
    - Exclude generated columns from INSERT
    
  2. Test Accounts
    - Court99 Admin: admin@court99.com / Admin123!
    - Law Firm Admin: admin@smithpartners.com / LawFirm123!
    - Client: mart.snoek@example.com / Client123!
*/

-- Ensure pgcrypto is available
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- Clean up any existing test accounts
DO $$
DECLARE
  admin_id uuid;
  lawfirm_admin_id uuid;
  client_id uuid;
BEGIN
  -- Get IDs of test accounts if they exist
  SELECT id INTO admin_id FROM auth.users WHERE email = 'admin@court99.com';
  SELECT id INTO lawfirm_admin_id FROM auth.users WHERE email = 'admin@smithpartners.com';
  SELECT id INTO client_id FROM auth.users WHERE email = 'mart.snoek@example.com';
  
  -- Delete profiles first (due to foreign key)
  IF admin_id IS NOT NULL THEN
    DELETE FROM profiles WHERE id = admin_id;
    DELETE FROM auth.users WHERE id = admin_id;
  END IF;
  
  IF lawfirm_admin_id IS NOT NULL THEN
    DELETE FROM profiles WHERE id = lawfirm_admin_id;
    DELETE FROM auth.users WHERE id = lawfirm_admin_id;
  END IF;
  
  IF client_id IS NOT NULL THEN
    DELETE FROM profiles WHERE id = client_id;
    DELETE FROM auth.users WHERE id = client_id;
  END IF;
END $$;

-- Create test accounts with proper structure
DO $$
DECLARE
  admin_user_id uuid;
  law_firm_id uuid;
  law_firm_admin_id uuid;
  client_user_id uuid;
BEGIN
  -- Create Court99 admin
  admin_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    aud,
    role
  ) VALUES (
    admin_user_id,
    '00000000-0000-0000-0000-000000000000',
    'admin@court99.com',
    extensions.crypt('Admin123!', extensions.gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{}'::jsonb,
    'authenticated',
    'authenticated'
  );
  
  INSERT INTO profiles (id, full_name, user_type, created_at, updated_at)
  VALUES (admin_user_id, 'Court99 Administrator', 'admin', now(), now());
  
  -- Get or create law firm
  SELECT id INTO law_firm_id FROM law_firms WHERE contact_email = 'admin@smithpartners.com';
  
  IF law_firm_id IS NULL THEN
    INSERT INTO law_firms (
      name,
      contact_email,
      contact_phone,
      address,
      subscription_plan,
      status,
      admin_code
    ) VALUES (
      'Smith & Partners Legal',
      'admin@smithpartners.com',
      '(555) 100-2000',
      '100 Legal Plaza, Suite 500, Boston, MA 02101',
      'professional',
      'active',
      'SP2024'
    )
    RETURNING id INTO law_firm_id;
  END IF;
  
  -- Create law firm admin
  law_firm_admin_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    aud,
    role
  ) VALUES (
    law_firm_admin_id,
    '00000000-0000-0000-0000-000000000000',
    'admin@smithpartners.com',
    extensions.crypt('LawFirm123!', extensions.gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{}'::jsonb,
    'authenticated',
    'authenticated'
  );
  
  INSERT INTO profiles (id, full_name, user_type, law_firm_id, created_at, updated_at)
  VALUES (law_firm_admin_id, 'Sarah Smith', 'admin', law_firm_id, now(), now());
  
  -- Create client
  client_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    aud,
    role
  ) VALUES (
    client_user_id,
    '00000000-0000-0000-0000-000000000000',
    'mart.snoek@example.com',
    extensions.crypt('Client123!', extensions.gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{}'::jsonb,
    'authenticated',
    'authenticated'
  );

  INSERT INTO profiles (id, full_name, user_type, law_firm_id, created_at, updated_at)
  VALUES (client_user_id, 'Mart Snoek', 'client', law_firm_id, now(), now());
  
END $$;

/*
  # Create Test Accounts
  
  1. New Accounts
    - Court99 Admin Account
      - Email: admin@court99.com
      - Password: Admin123!
      - Type: admin (Court99 platform administrator)
      
    - Law Firm: "Smith & Partners Legal"
      - Admin Email: admin@smithpartners.com
      - Password: LawFirm123!
      - Type: admin (Law firm administrator)
      
    - Client Account: "Mart Snoek"
      - Email: mart.snoek@example.com
      - Password: Client123!
      - Type: client (linked to Smith & Partners Legal)
  
  2. Security
    - All accounts use secure passwords
    - Proper user_type assignments
    - Client properly linked to law firm
    
  3. Notes
    - These are test accounts for development/demo purposes
    - Passwords should be changed in production
    - Court99 admin has platform-wide access
    - Law firm admin can manage their firm's clients
    - Client has access to learning materials
*/

-- Create Court99 Admin User
DO $$
DECLARE
  admin_user_id uuid;
  law_firm_id uuid;
  law_firm_admin_id uuid;
  client_user_id uuid;
BEGIN
  -- Create Court99 admin in auth.users
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
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'admin@court99.com',
    crypt('Admin123!', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    'authenticated',
    'authenticated'
  )
  RETURNING id INTO admin_user_id;
  
  -- Create profile for Court99 admin
  INSERT INTO profiles (id, full_name, user_type, created_at, updated_at)
  VALUES (admin_user_id, 'Court99 Administrator', 'admin', now(), now());
  
  -- Create law firm
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
  
  -- Create law firm admin user in auth.users
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
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'admin@smithpartners.com',
    crypt('LawFirm123!', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    'authenticated',
    'authenticated'
  )
  RETURNING id INTO law_firm_admin_id;
  
  -- Create profile for law firm admin (admin type, linked to law firm)
  INSERT INTO profiles (id, full_name, user_type, law_firm_id, created_at, updated_at)
  VALUES (law_firm_admin_id, 'Sarah Smith', 'admin', law_firm_id, now(), now());
  
  -- Create client user in auth.users
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
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'mart.snoek@example.com',
    crypt('Client123!', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    'authenticated',
    'authenticated'
  )
  RETURNING id INTO client_user_id;

  -- Create profile for client (linked to law firm)
  INSERT INTO profiles (id, full_name, user_type, law_firm_id, created_at, updated_at)
  VALUES (client_user_id, 'Mart Snoek', 'client', law_firm_id, now(), now());
  
END $$;

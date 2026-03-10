/*
  # Create Test Case for Client

  1. New Data
    - Creates a test case for Lev Loukhton (lev.loukhton@example.com)
    - Case Number: CASE-2024-001
    - Links case to client and law firm

  2. Purpose
    - Allows the test client account to log in with case number
    - Provides a working case for testing client features
*/

DO $$
DECLARE
  v_client_id uuid;
  v_firm_id uuid;
BEGIN
  -- Get the client user ID
  SELECT id INTO v_client_id
  FROM auth.users
  WHERE email = 'lev.loukhton@example.com';

  -- Get the law firm ID
  SELECT law_firm_id INTO v_firm_id
  FROM profiles
  WHERE id = v_client_id;

  -- Create a test case for the client (only if it doesn't exist)
  IF NOT EXISTS (
    SELECT 1 FROM cases
    WHERE case_number = 'CASE-2024-001'
    AND client_id = v_client_id
  ) THEN
    INSERT INTO cases (
      case_number,
      case_type,
      description,
      client_id,
      law_firm_id,
      status
    ) VALUES (
      'CASE-2024-001',
      'general',
      'Test case for Lev Loukhton',
      v_client_id,
      v_firm_id,
      'open'
    );
  END IF;
END $$;

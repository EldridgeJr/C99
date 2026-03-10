/*
  # Update Client Account from Mart Snoek to Lev Loukhton

  1. Changes
    - Updates the test client email from mart.snoek@example.com to lev.loukhton@example.com
    - Updates the profile full_name from Mart Snoek to Lev Loukhton
    - Updates the case description to reference the new client name

  2. Security
    - Maintains all existing RLS policies
    - Preserves client association with law firm and case
*/

DO $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Get the user ID for the old email
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'mart.snoek@example.com';

  -- Only proceed if the user exists
  IF v_user_id IS NOT NULL THEN
    -- Update auth.users email
    UPDATE auth.users
    SET email = 'lev.loukhton@example.com',
        raw_user_meta_data = jsonb_set(
          COALESCE(raw_user_meta_data, '{}'::jsonb),
          '{email}',
          '"lev.loukhton@example.com"'
        )
    WHERE id = v_user_id;

    -- Update profile
    UPDATE profiles
    SET full_name = 'Lev Loukhton',
        email = 'lev.loukhton@example.com'
    WHERE id = v_user_id;

    -- Update case description
    UPDATE cases
    SET description = 'Test case for Lev Loukhton'
    WHERE client_id = v_user_id
      AND case_number = 'CASE-2024-001';
  END IF;
END $$;

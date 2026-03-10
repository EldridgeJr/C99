/*
  # Add Admin Password Storage to Law Firms
  
  1. Changes
    - Add `admin_password` column to `law_firms` table
    - This stores the password for display purposes in test/demo environments
    - Update existing law firms with their known passwords
  
  2. Security Notes
    - This is for demo/testing purposes only
    - In production, passwords should never be stored in plain text
    - Admins should change passwords after first login
*/

-- Add admin_password column to law_firms table
ALTER TABLE law_firms 
ADD COLUMN IF NOT EXISTS admin_password text;

-- Update existing law firms with their known test passwords
UPDATE law_firms 
SET admin_password = 'LawFirm123!'
WHERE contact_email = 'admin@smithpartners.com';

-- For any other existing law firms without a password, set a default
UPDATE law_firms 
SET admin_password = 'password123'
WHERE admin_password IS NULL;
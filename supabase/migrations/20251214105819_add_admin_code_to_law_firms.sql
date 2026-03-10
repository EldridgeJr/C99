/*
  # Add administration code to law firms

  1. Changes
    - Add `admin_code` column to `law_firms` table for internal tracking
    - This is an internal identifier used by the operations team

  2. Notes
    - Column is nullable to allow existing records to continue functioning
    - Can be made unique if needed for strict internal tracking
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'law_firms' AND column_name = 'admin_code'
  ) THEN
    ALTER TABLE law_firms ADD COLUMN admin_code text;
  END IF;
END $$;
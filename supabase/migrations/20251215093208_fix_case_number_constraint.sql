/*
  # Fix Case Number Uniqueness Constraint

  1. Changes
    - Remove global unique constraint on case_number
    - Add composite unique constraint for (law_firm_id, case_number)
    - This allows different law firms to use the same case numbers
  
  2. Security
    - No RLS changes needed
*/

-- Drop the global unique constraint
ALTER TABLE cases DROP CONSTRAINT IF EXISTS cases_case_number_key;

-- Add a composite unique constraint for law_firm_id + case_number
ALTER TABLE cases ADD CONSTRAINT cases_law_firm_case_number_unique 
  UNIQUE (law_firm_id, case_number);

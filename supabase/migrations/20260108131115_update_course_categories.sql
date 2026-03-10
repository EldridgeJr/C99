/*
  # Update Course Categories
  
  1. Changes
    - Update existing course categories to new category names
    - New categories: Before Court, During Court, Communication & Behavior, Mental Readiness, Information & Organization, After Court
  
  2. Course Mappings
    - Civil Litigation Basics → Before Court
    - Court Etiquette and Professional Conduct → Communication & Behavior
    - Legal Fundamentals for Self-Representation → Information & Organization
    - Managing Court-Related Stress and Anxiety → Mental Readiness
    - Business Litigation Essentials → Before Court
    - Quick Start: Court Preparation Essentials → Before Court
*/

-- Update course categories to new naming scheme
UPDATE courses
SET category = 'Before Court'
WHERE id IN (
  '1dbcd417-400d-4479-94b6-dd85fb72492c',
  '44444444-4444-4444-4444-444444444444',
  '55555555-5555-5555-5555-555555555555'
);

UPDATE courses
SET category = 'Communication & Behavior'
WHERE id = '22222222-2222-2222-2222-222222222222';

UPDATE courses
SET category = 'Information & Organization'
WHERE id = '11111111-1111-1111-1111-111111111111';

UPDATE courses
SET category = 'Mental Readiness'
WHERE id = '33333333-3333-3333-3333-333333333333';

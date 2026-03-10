/*
  # Update Content Items Categories
  
  1. Changes
    - Update content_items categories to match new category structure
    - New categories: Before Court, During Court, Communication & Behavior, Mental Readiness, Information & Organization, After Court
  
  2. Content Mappings
    - Understanding Court Procedures → Before Court
    - Common Court Mistakes → Before Court
    - Quick Start: Essential Checklist → Before Court
    
    - Presenting Financial Evidence → During Court
    
    - Courtroom Etiquette Essentials → Communication & Behavior
    - How to Address the Judge → Communication & Behavior
    
    - Mental health items → Mental Readiness
    
    - Legal/business/document items → Information & Organization
*/

-- Update to "Before Court"
UPDATE content_items
SET category = 'Before Court'
WHERE id IN (
  '6c17627a-fcdd-42c3-aa72-9575dc042a95',
  '6397bc01-c43e-496a-b9df-977536d223bd',
  '1feb9ede-daed-4d90-85c8-da7924728478'
);

-- Update to "During Court"
UPDATE content_items
SET category = 'During Court'
WHERE id = '569de2bf-217d-4bef-a8fc-23db34a3176b';

-- Update to "Communication & Behavior"
UPDATE content_items
SET category = 'Communication & Behavior'
WHERE id IN (
  '415b9093-7df5-45c8-8ad5-a9db49ace351',
  'de699cac-9f2d-483c-8fb7-1bec30e2ae31'
);

-- Update to "Mental Readiness"
UPDATE content_items
SET category = 'Mental Readiness'
WHERE id IN (
  '9b035abf-f035-4359-a1b6-ba10bf19e3b3',
  '126c8d19-4d0e-44c3-af01-2e98a2672e75',
  '83c50c22-e99c-4491-a39a-7a9cb5dfae08'
);

-- Update to "Information & Organization"
UPDATE content_items
SET category = 'Information & Organization'
WHERE id IN (
  '97ed8208-e1d6-4e4a-a708-1be1cd0999c1',
  '255875ac-26ab-4f92-a151-6fbc8cd9a42b',
  '2179d104-815c-43cb-8c6c-184bdc703d77',
  'ade050a6-a492-4ff9-a191-390f0aa1b5d6',
  '4da35582-3fc7-42b3-9dde-9fda6b0fbcb4'
);

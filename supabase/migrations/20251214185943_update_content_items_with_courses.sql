/*
  # Update Content Items

  ## Overview
  Updates existing content items and adds course-linked content for each category.

  ## Changes Made
  1. Clear existing content items
  2. Add content items linked to new courses
  3. Set proper categories, durations, and XP rewards
  4. Add thumbnail URLs from Pexels

  ## Content Categories
  - Law: Legal research, documentation, rights
  - Court: Procedures, etiquette, protocols
  - Mental Health: Stress management, confidence building
  - Business: Contracts, financial evidence
  - Focus: Quick guides, checklists
*/

-- Clear old content items
DELETE FROM content_items;

-- LAW CATEGORY CONTENT
INSERT INTO content_items (title, description, content_type, category, url, thumbnail_url, duration_minutes, difficulty_level, xp_reward)
VALUES 
  ('Understanding Your Legal Rights', 
   'Comprehensive guide to your fundamental legal rights in court proceedings.',
   'video',
   'law',
   'https://example.com/legal-rights',
   'https://images.pexels.com/photos/5668772/pexels-photo-5668772.jpeg',
   15,
   'beginner',
   10),
  ('Legal Research Made Simple',
   'Learn how to research case law and legal precedents effectively for your case.',
   'video',
   'law',
   'https://example.com/legal-research',
   'https://images.pexels.com/photos/6077447/pexels-photo-6077447.jpeg',
   20,
   'intermediate',
   15),
  ('Legal Document Templates',
   'Download and customize essential legal document templates for your case.',
   'audio',
   'law',
   'https://example.com/legal-templates',
   'https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg',
   12,
   'beginner',
   10);

-- COURT CATEGORY CONTENT
INSERT INTO content_items (title, description, content_type, category, url, thumbnail_url, duration_minutes, difficulty_level, xp_reward)
VALUES 
  ('Courtroom Etiquette Essentials',
   'Master the do''s and don''ts of courtroom behavior and professional conduct.',
   'video',
   'court',
   'https://example.com/court-etiquette',
   'https://images.pexels.com/photos/8111832/pexels-photo-8111832.jpeg',
   18,
   'beginner',
   10),
  ('Understanding Court Procedures',
   'Step-by-step guide to typical court proceedings and what to expect.',
   'video',
   'court',
   'https://example.com/court-procedures',
   'https://images.pexels.com/photos/6077326/pexels-photo-6077326.jpeg',
   25,
   'beginner',
   15),
  ('How to Address the Judge',
   'Learn proper protocol for speaking to and addressing the judge in court.',
   'video',
   'court',
   'https://example.com/address-judge',
   'https://images.pexels.com/photos/5669619/pexels-photo-5669619.jpeg',
   10,
   'beginner',
   10);

-- MENTAL HEALTH CATEGORY CONTENT
INSERT INTO content_items (title, description, content_type, category, url, thumbnail_url, duration_minutes, difficulty_level, xp_reward)
VALUES 
  ('Managing Court Anxiety',
   'Practical techniques to manage stress and anxiety before and during your hearing.',
   'video',
   'mental_health',
   'https://example.com/manage-anxiety',
   'https://images.pexels.com/photos/3759657/pexels-photo-3759657.jpeg',
   20,
   'beginner',
   10),
  ('Breathing Exercises for Calm',
   'Guided breathing exercises you can use in court to stay calm and focused.',
   'audio',
   'mental_health',
   'https://example.com/breathing-exercises',
   'https://images.pexels.com/photos/3822621/pexels-photo-3822621.jpeg',
   15,
   'beginner',
   10),
  ('Building Confidence for Court',
   'Strategies to build confidence and present yourself effectively in legal proceedings.',
   'video',
   'mental_health',
   'https://example.com/build-confidence',
   'https://images.pexels.com/photos/3771045/pexels-photo-3771045.jpeg',
   18,
   'beginner',
   10);

-- BUSINESS CATEGORY CONTENT
INSERT INTO content_items (title, description, content_type, category, url, thumbnail_url, duration_minutes, difficulty_level, xp_reward)
VALUES 
  ('Contract Law Basics',
   'Essential principles of contract law for business disputes and litigation.',
   'video',
   'business',
   'https://example.com/contract-law',
   'https://images.pexels.com/photos/6077381/pexels-photo-6077381.jpeg',
   22,
   'intermediate',
   15),
  ('Presenting Financial Evidence',
   'How to organize and present financial documents and evidence in court.',
   'video',
   'business',
   'https://example.com/financial-evidence',
   'https://images.pexels.com/photos/6476567/pexels-photo-6476567.jpeg',
   20,
   'intermediate',
   15);

-- FOCUS CATEGORY CONTENT
INSERT INTO content_items (title, description, content_type, category, url, thumbnail_url, duration_minutes, difficulty_level, xp_reward)
VALUES 
  ('Quick Start: Essential Checklist',
   'Fast-track your preparation with this comprehensive pre-hearing checklist.',
   'video',
   'focus',
   'https://example.com/quick-checklist',
   'https://images.pexels.com/photos/5668797/pexels-photo-5668797.jpeg',
   12,
   'beginner',
   10),
  ('Documents You Must Bring',
   'Complete list of essential documents for your court hearing.',
   'video',
   'focus',
   'https://example.com/essential-docs',
   'https://images.pexels.com/photos/6077339/pexels-photo-6077339.jpeg',
   8,
   'beginner',
   10),
  ('Common Court Mistakes',
   'Learn the most common mistakes people make in court and how to avoid them.',
   'video',
   'focus',
   'https://example.com/common-mistakes',
   'https://images.pexels.com/photos/5669602/pexels-photo-5669602.jpeg',
   15,
   'beginner',
   10);

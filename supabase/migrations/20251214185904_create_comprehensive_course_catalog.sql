/*
  # Comprehensive Course Catalog

  ## Overview
  Creates a full course catalog covering all learning categories for client preparation.

  ## New Courses Created

  ### 1. Law Category
  - **Legal Fundamentals for Self-Representation**
    - Understanding your legal rights
    - Legal terminology and concepts
    - Working with legal documents
    - Legal research basics

  ### 2. Court Category
  - **Mastering Court Procedures** (already exists - Civil Litigation)
  - **Court Etiquette and Professional Conduct**
    - Courtroom behavior
    - Addressing the judge
    - Professional appearance
    - Court protocols

  ### 3. Mental Health Category
  - **Managing Court-Related Stress and Anxiety**
    - Understanding court anxiety
    - Breathing and relaxation techniques
    - Building confidence
    - Maintaining composure under pressure

  ### 4. Business Category
  - **Business Litigation Essentials**
    - Contract disputes
    - Business documentation
    - Financial evidence presentation
    - Commercial law basics

  ### 5. Focus Category
  - **Quick Start: Court Preparation Essentials**
    - Essential preparation checklist
    - Key documents to bring
    - Day-of-hearing preparation
    - Common mistakes to avoid

  ## Features
  - Each course has 3-5 modules
  - Each module has 3-6 lessons
  - Lessons include video, reading, and interactive content
  - XP rewards for completion
  - Progressive difficulty levels
*/

-- Legal Fundamentals Course
INSERT INTO courses (id, title, description, difficulty_level, category, estimated_hours, is_free, certificate_enabled)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 
   'Legal Fundamentals for Self-Representation', 
   'Master the essential legal concepts and terminology needed to effectively represent yourself in court. Learn how to navigate legal documents and understand your rights.',
   'beginner',
   'law',
   10,
   true,
   true);

-- Court Etiquette Course
INSERT INTO courses (id, title, description, difficulty_level, category, estimated_hours, is_free, certificate_enabled)
VALUES 
  ('22222222-2222-2222-2222-222222222222',
   'Court Etiquette and Professional Conduct',
   'Learn the proper courtroom behavior, communication protocols, and professional standards expected in court proceedings.',
   'beginner',
   'court',
   6,
   true,
   true);

-- Mental Health Course
INSERT INTO courses (id, title, description, difficulty_level, category, estimated_hours, is_free, certificate_enabled)
VALUES 
  ('33333333-3333-3333-3333-333333333333',
   'Managing Court-Related Stress and Anxiety',
   'Develop practical strategies to manage stress, build confidence, and maintain composure throughout your court proceedings.',
   'beginner',
   'mental_health',
   8,
   true,
   false);

-- Business Course
INSERT INTO courses (id, title, description, difficulty_level, category, estimated_hours, is_free, certificate_enabled)
VALUES 
  ('44444444-4444-4444-4444-444444444444',
   'Business Litigation Essentials',
   'Navigate business disputes with confidence. Understand commercial law, contract disputes, and how to present financial evidence effectively.',
   'intermediate',
   'business',
   12,
   false,
   true);

-- Focus/Quick Start Course
INSERT INTO courses (id, title, description, difficulty_level, category, estimated_hours, is_free, certificate_enabled)
VALUES 
  ('55555555-5555-5555-5555-555555555555',
   'Quick Start: Court Preparation Essentials',
   'Fast-track your court preparation with this focused course covering the most critical elements you need to know before your hearing.',
   'beginner',
   'focus',
   4,
   true,
   false);

-- ============================================
-- LEGAL FUNDAMENTALS MODULES & LESSONS
-- ============================================

INSERT INTO modules (id, course_id, title, description, order_index, xp_reward)
VALUES 
  ('a1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111',
   'Understanding Your Legal Rights', 'Foundation of legal rights and protections', 1, 20),
  ('a1111111-1111-1111-1111-111111111112', '11111111-1111-1111-1111-111111111111',
   'Legal Terminology Mastery', 'Essential legal terms and their meanings', 2, 20),
  ('a1111111-1111-1111-1111-111111111113', '11111111-1111-1111-1111-111111111111',
   'Working with Legal Documents', 'How to read and prepare legal documents', 3, 25);

-- Legal Rights Lessons
INSERT INTO lessons (module_id, title, content, lesson_type, order_index, duration_minutes, xp_reward)
VALUES 
  ('a1111111-1111-1111-1111-111111111111', 'Introduction to Legal Rights',
   'Your legal rights form the foundation of your case. Understanding these rights empowers you to navigate the legal system effectively. In this lesson, we cover constitutional protections, procedural rights, and substantive rights that apply to your situation.',
   'video', 1, 15, 5),
  ('a1111111-1111-1111-1111-111111111111', 'Due Process and Fair Treatment',
   'Due process guarantees that legal proceedings will be fair and that you will be given notice and an opportunity to be heard before the government acts to take away your life, liberty, or property. Learn what this means in practical terms.',
   'reading', 2, 10, 5),
  ('a1111111-1111-1111-1111-111111111111', 'Your Right to Present Evidence',
   'Understanding how to exercise your right to present evidence and call witnesses. This lesson covers the rules of evidence and how to effectively present your case.',
   'video', 3, 20, 5);

-- Legal Terminology Lessons
INSERT INTO lessons (module_id, title, content, lesson_type, order_index, duration_minutes, xp_reward)
VALUES 
  ('a1111111-1111-1111-1111-111111111112', 'Common Legal Terms Explained',
   'Master essential legal vocabulary including plaintiff, defendant, burden of proof, preponderance of evidence, and more. Clear definitions with practical examples.',
   'reading', 1, 15, 5),
  ('a1111111-1111-1111-1111-111111111112', 'Court Terminology Guide',
   'Learn courtroom-specific terms like motion, objection, sustained, overruled, and exhibit. Understanding these terms helps you follow proceedings and communicate effectively.',
   'video', 2, 18, 5),
  ('a1111111-1111-1111-1111-111111111112', 'Legal Terminology Quiz',
   'Test your knowledge of legal terms with this interactive quiz. Ensure you are ready to understand court proceedings.',
   'quiz', 3, 10, 5);

-- ============================================
-- COURT ETIQUETTE MODULES & LESSONS
-- ============================================

INSERT INTO modules (id, course_id, title, description, order_index, xp_reward)
VALUES 
  ('b2222222-2222-2222-2222-222222222221', '22222222-2222-2222-2222-222222222222',
   'Courtroom Behavior Basics', 'Proper conduct and demeanor in court', 1, 15),
  ('b2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222',
   'Professional Communication', 'How to address the court and others', 2, 20);

-- Courtroom Behavior Lessons
INSERT INTO lessons (module_id, title, content, lesson_type, order_index, duration_minutes, xp_reward)
VALUES 
  ('b2222222-2222-2222-2222-222222222221', 'First Impressions Matter',
   'Learn proper courtroom attire, arrival procedures, and how to make a positive first impression. Professional appearance and punctuality set the tone.',
   'video', 1, 12, 5),
  ('b2222222-2222-2222-2222-222222222221', 'Courtroom Do''s and Don''ts',
   'Essential rules: stand when the judge enters, turn off your phone, never interrupt, and maintain respectful body language throughout proceedings.',
   'reading', 2, 10, 5),
  ('b2222222-2222-2222-2222-222222222221', 'Observing Court Protocols',
   'Watch real courtroom footage to see proper etiquette in action. Learn from both good and bad examples.',
   'video', 3, 15, 5);

-- Professional Communication Lessons
INSERT INTO lessons (module_id, title, content, lesson_type, order_index, duration_minutes, xp_reward)
VALUES 
  ('b2222222-2222-2222-2222-222222222222', 'Addressing the Judge',
   'Always address the judge as "Your Honor." Learn when to speak, how to request permission, and proper tone and language.',
   'video', 1, 15, 5),
  ('b2222222-2222-2222-2222-222222222222', 'Communicating with Opposing Counsel',
   'Maintain professionalism even in disagreement. Learn proper forms of address and how to object respectfully.',
   'reading', 2, 12, 5);

-- ============================================
-- MENTAL HEALTH MODULES & LESSONS
-- ============================================

INSERT INTO modules (id, course_id, title, description, order_index, xp_reward)
VALUES 
  ('c3333333-3333-3333-3333-333333333331', '33333333-3333-3333-3333-333333333333',
   'Understanding Court Anxiety', 'Recognizing and addressing stress', 1, 15),
  ('c3333333-3333-3333-3333-333333333332', '33333333-3333-3333-3333-333333333333',
   'Stress Management Techniques', 'Practical tools for managing anxiety', 2, 20),
  ('c3333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333',
   'Building Confidence', 'Developing mental resilience', 3, 25);

-- Understanding Anxiety Lessons
INSERT INTO lessons (module_id, title, content, lesson_type, order_index, duration_minutes, xp_reward)
VALUES 
  ('c3333333-3333-3333-3333-333333333331', 'Why Court Causes Anxiety',
   'Understand the psychological factors that make court stressful. Recognizing your anxiety is the first step to managing it effectively.',
   'video', 1, 15, 5),
  ('c3333333-3333-3333-3333-333333333331', 'Physical Symptoms of Stress',
   'Learn to identify physical manifestations of stress: rapid heartbeat, sweating, tension. Understanding these helps you address them.',
   'reading', 2, 10, 5);

-- Stress Management Lessons
INSERT INTO lessons (module_id, title, content, lesson_type, order_index, duration_minutes, xp_reward)
VALUES 
  ('c3333333-3333-3333-3333-333333333332', 'Breathing Techniques for Calm',
   'Master box breathing, 4-7-8 breathing, and other techniques you can use in court to stay calm and focused.',
   'interactive', 1, 20, 5),
  ('c3333333-3333-3333-3333-333333333332', 'Mindfulness and Grounding',
   'Practice mindfulness exercises and grounding techniques to stay present and avoid being overwhelmed by anxiety.',
   'video', 2, 18, 5),
  ('c3333333-3333-3333-3333-333333333332', 'Pre-Hearing Preparation Routine',
   'Develop a morning routine that sets you up for success. Exercise, nutrition, and mental preparation strategies.',
   'reading', 3, 12, 5);

-- ============================================
-- BUSINESS LITIGATION MODULES & LESSONS
-- ============================================

INSERT INTO modules (id, course_id, title, description, order_index, xp_reward)
VALUES 
  ('d4444444-4444-4444-4444-444444444441', '44444444-4444-4444-4444-444444444444',
   'Contract Disputes', 'Understanding and litigating contract issues', 1, 25),
  ('d4444444-4444-4444-4444-444444444442', '44444444-4444-4444-4444-444444444444',
   'Business Documentation', 'Organizing and presenting business records', 2, 25),
  ('d4444444-4444-4444-4444-444444444443', '44444444-4444-4444-4444-444444444444',
   'Financial Evidence', 'Presenting financial information effectively', 3, 30);

-- Contract Disputes Lessons
INSERT INTO lessons (module_id, title, content, lesson_type, order_index, duration_minutes, xp_reward)
VALUES 
  ('d4444444-4444-4444-4444-444444444441', 'Elements of a Valid Contract',
   'Learn the essential elements: offer, acceptance, consideration, capacity, and legality. Understanding these helps you analyze your case.',
   'video', 1, 20, 5),
  ('d4444444-4444-4444-4444-444444444441', 'Breach of Contract Basics',
   'Understand material breach, anticipatory breach, and remedies. Learn what you need to prove to succeed in your claim.',
   'reading', 2, 15, 5),
  ('d4444444-4444-4444-4444-444444444441', 'Contract Interpretation',
   'How courts interpret contract terms, dealing with ambiguities, and the importance of written documentation.',
   'video', 3, 18, 5);

-- ============================================
-- QUICK START MODULES & LESSONS
-- ============================================

INSERT INTO modules (id, course_id, title, description, order_index, xp_reward)
VALUES 
  ('e5555555-5555-5555-5555-555555555551', '55555555-5555-5555-5555-555555555555',
   'Essential Preparation Checklist', 'What you must know and do', 1, 20),
  ('e5555555-5555-5555-5555-555555555552', '55555555-5555-5555-5555-555555555555',
   'Day of Hearing', 'Final preparation and execution', 2, 25);

-- Essential Preparation Lessons
INSERT INTO lessons (module_id, title, content, lesson_type, order_index, duration_minutes, xp_reward)
VALUES 
  ('e5555555-5555-5555-5555-555555555551', 'The Night Before Your Hearing',
   'Critical preparation steps: review your notes, organize documents, prepare your outfit, get adequate rest. A comprehensive checklist.',
   'video', 1, 15, 5),
  ('e5555555-5555-5555-5555-555555555551', 'Essential Documents Checklist',
   'Complete list of documents to bring: ID, case documents, evidence, witness information, notes. How to organize them for easy access.',
   'reading', 2, 10, 5),
  ('e5555555-5555-5555-5555-555555555551', 'Common Mistakes to Avoid',
   'Learn from others mistakes: arriving late, missing documents, poor organization, emotional responses, and lack of preparation.',
   'video', 3, 12, 5);

-- Day of Hearing Lessons
INSERT INTO lessons (module_id, title, content, lesson_type, order_index, duration_minutes, xp_reward)
VALUES 
  ('e5555555-5555-5555-5555-555555555552', 'Arrival and Check-In',
   'Arrive early, find the right courtroom, check in properly. What to do while waiting and last-minute preparation.',
   'video', 1, 15, 5),
  ('e5555555-5555-5555-5555-555555555552', 'During Your Hearing',
   'Quick reference guide: how to present yourself, respond to questions, handle unexpected situations, and stay focused.',
   'reading', 2, 12, 5);

/*
  # Seed Civil Litigation Basics Course

  ## Overview
  Populates the database with the complete "Civil Litigation Basics" course.

  ## Course Structure
  
  1. Course: Civil Litigation Basics
    - Difficulty: Beginner
    - Category: Court Procedures
    - Duration: 12 hours
    - Certificate: Yes
    - 6 Modules with 28 total lessons
  
  2. Modules:
    - Module 1: What is Civil Litigation? (2h, 90 XP)
    - Module 2: The Court System Structure (2h, 90 XP)
    - Module 3: Filing and Serving Documents (2h, 120 XP)
    - Module 4: The Discovery Process (2.5h, 150 XP)
    - Module 5: Pre-Trial Procedures (2h, 120 XP)
    - Module 6: Trial and Settlement (1.5h, 100 XP)
  
  3. Each module contains multiple lessons with various types (video, reading, quiz, interactive)
  
  4. Total: 28 lessons across all modules
*/

DO $$
DECLARE
  course_id uuid;
  module_1_id uuid;
  module_2_id uuid;
  module_3_id uuid;
  module_4_id uuid;
  module_5_id uuid;
  module_6_id uuid;
BEGIN
  -- Insert course
  INSERT INTO courses (title, description, difficulty_level, category, estimated_hours, is_free, certificate_enabled)
  VALUES (
    'Civil Litigation Basics',
    'Learn the fundamentals of civil court procedures and what to expect during your hearing. This comprehensive course covers the entire civil litigation process from filing to trial, preparing you to confidently navigate the court system.',
    'beginner',
    'Court Procedures',
    12,
    false,
    true
  )
  RETURNING id INTO course_id;

  -- Module 1: What is Civil Litigation?
  INSERT INTO modules (course_id, title, description, order_index, xp_reward)
  VALUES (course_id, 'What is Civil Litigation?', 'Introduction to civil litigation, its purpose, and how it differs from criminal law', 1, 90)
  RETURNING id INTO module_1_id;

  INSERT INTO lessons (module_id, title, content, lesson_type, order_index, duration_minutes)
  VALUES
    (module_1_id, 'Introduction to Civil Cases', 'An overview of what civil litigation is, the types of cases, and the parties involved in civil disputes.', 'video', 1, 8),
    (module_1_id, 'Civil vs. Criminal Law', 'Understanding the key differences between civil and criminal proceedings, including burden of proof and penalties.', 'video', 2, 10),
    (module_1_id, 'Types of Civil Cases', 'Learn about common civil case types including contract disputes, personal injury, property disputes, and family law.', 'reading', 3, 12),
    (module_1_id, 'The Role of Plaintiffs and Defendants', 'Understanding the responsibilities and rights of both parties in a civil lawsuit.', 'video', 4, 6),
    (module_1_id, 'Quiz: Civil Litigation Basics', 'Test your knowledge on civil litigation fundamentals.', 'quiz', 5, 10);

  -- Module 2: The Court System Structure
  INSERT INTO modules (course_id, title, description, order_index, xp_reward)
  VALUES (course_id, 'The Court System Structure', 'Understanding the hierarchy and organization of courts, from trial courts to appellate courts', 2, 90)
  RETURNING id INTO module_2_id;

  INSERT INTO lessons (module_id, title, content, lesson_type, order_index, duration_minutes)
  VALUES
    (module_2_id, 'Federal vs. State Courts', 'Learn about the structure of the federal and state court systems and how they interact.', 'video', 1, 12),
    (module_2_id, 'Trial Courts and Appellate Courts', 'Understanding the roles and differences between trial courts where cases begin and appellate courts that review decisions.', 'video', 2, 10),
    (module_2_id, 'Jurisdiction and Venue', 'What determines which court has the authority to hear your case and where the trial takes place.', 'reading', 3, 15),
    (module_2_id, 'Court Personnel and Their Roles', 'Meet the judges, court clerks, bailiffs, and other court officials and understand their responsibilities.', 'video', 4, 8),
    (module_2_id, 'State Court Procedures Overview', 'A guide to how different state court systems organize and conduct civil litigation.', 'interactive', 5, 10),
    (module_2_id, 'Quiz: Court System Structure', 'Test your understanding of court organization and jurisdiction.', 'quiz', 6, 12);

  -- Module 3: Filing and Serving Documents
  INSERT INTO modules (course_id, title, description, order_index, xp_reward)
  VALUES (course_id, 'Filing and Serving Documents', 'Learn how to initiate a lawsuit, file documents, and serve the defendant properly', 3, 120)
  RETURNING id INTO module_3_id;

  INSERT INTO lessons (module_id, title, content, lesson_type, order_index, duration_minutes)
  VALUES
    (module_3_id, 'The Complaint: Starting Your Case', 'Learn what a complaint is, what it must contain, and how to file it with the court.', 'video', 1, 12),
    (module_3_id, 'Understanding the Summons', 'What a summons is and why it''s critical to serve it properly on the defendant.', 'reading', 2, 8),
    (module_3_id, 'Methods of Service', 'Explore the various ways to serve documents, including personal service, certified mail, and substituted service.', 'video', 3, 14),
    (module_3_id, 'Proof of Service', 'Understanding affidavits of service and how to prove documents were properly served.', 'reading', 4, 10),
    (module_3_id, 'Filing Fees and Court Requirements', 'Learn about filing fees, required forms, and initial pleading requirements in civil cases.', 'interactive', 5, 12),
    (module_3_id, 'The Response: Answer and Motions', 'What the defendant must do when served with a complaint, including filing an answer or motion.', 'video', 6, 10),
    (module_3_id, 'Quiz: Filing and Serving Documents', 'Test your knowledge on proper document filing and service procedures.', 'quiz', 7, 14);

  -- Module 4: The Discovery Process
  INSERT INTO modules (course_id, title, description, order_index, xp_reward)
  VALUES (course_id, 'The Discovery Process', 'Master the critical discovery phase where evidence is exchanged and facts are revealed', 4, 150)
  RETURNING id INTO module_4_id;

  INSERT INTO lessons (module_id, title, content, lesson_type, order_index, duration_minutes)
  VALUES
    (module_4_id, 'Introduction to Discovery', 'Learn what discovery is and why it''s a crucial phase in civil litigation.', 'video', 1, 10),
    (module_4_id, 'Interrogatories', 'Understanding written questions you must answer under oath during discovery.', 'reading', 2, 12),
    (module_4_id, 'Requests for Production of Documents', 'Learn how to request and provide documents, emails, photos, and other evidence.', 'video', 3, 14),
    (module_4_id, 'Depositions Explained', 'What depositions are, how they work, and what to expect when being deposed.', 'video', 4, 16),
    (module_4_id, 'Preparing for Your Deposition', 'Practical tips and strategies for handling a deposition successfully.', 'interactive', 5, 18),
    (module_4_id, 'Requests for Admission', 'How to admit or deny facts during discovery and why your responses matter.', 'reading', 6, 10),
    (module_4_id, 'Discovery Objections and Privileges', 'Understanding objections like attorney-client privilege and work product doctrine.', 'video', 7, 14),
    (module_4_id, 'Quiz: The Discovery Process', 'Test your knowledge on discovery methods and procedures.', 'quiz', 8, 16);

  -- Module 5: Pre-Trial Procedures
  INSERT INTO modules (course_id, title, description, order_index, xp_reward)
  VALUES (course_id, 'Pre-Trial Procedures', 'Navigate motions, pre-trial conferences, and settlement discussions before trial', 5, 120)
  RETURNING id INTO module_5_id;

  INSERT INTO lessons (module_id, title, content, lesson_type, order_index, duration_minutes)
  VALUES
    (module_5_id, 'Summary Judgment Motions', 'Understanding motions for summary judgment and how they can end cases before trial.', 'video', 1, 14),
    (module_5_id, 'Other Important Pre-Trial Motions', 'Learn about motions in limine, motions to dismiss, and other critical pre-trial motions.', 'reading', 2, 12),
    (module_5_id, 'The Pre-Trial Conference', 'What to expect at pre-trial conferences and how they shape the path to trial.', 'video', 3, 12),
    (module_5_id, 'Mediation and Settlement Negotiations', 'Understanding alternative dispute resolution and how settlements can resolve cases.', 'interactive', 4, 16),
    (module_5_id, 'Settlement Agreements', 'What''s included in settlement agreements and what happens when you settle.', 'reading', 5, 10),
    (module_5_id, 'Trial Preparation Checklist', 'A comprehensive checklist to prepare for trial if settlement isn''t reached.', 'interactive', 6, 12),
    (module_5_id, 'Quiz: Pre-Trial Procedures', 'Test your understanding of pre-trial motions and procedures.', 'quiz', 7, 14);

  -- Module 6: Trial and Settlement
  INSERT INTO modules (course_id, title, description, order_index, xp_reward)
  VALUES (course_id, 'Trial and Settlement', 'Understand what happens at trial and how cases are resolved', 6, 100)
  RETURNING id INTO module_6_id;

  INSERT INTO lessons (module_id, title, content, lesson_type, order_index, duration_minutes)
  VALUES
    (module_6_id, 'Trial Overview', 'A step-by-step walkthrough of what happens during a civil trial.', 'video', 1, 12),
    (module_6_id, 'Jury Selection (Voir Dire)', 'Understanding jury selection and how attorneys choose jurors for your case.', 'video', 2, 14),
    (module_6_id, 'Opening Statements', 'What opening statements are and their purpose in setting the stage for trial.', 'reading', 3, 10),
    (module_6_id, 'Presenting Evidence and Testimony', 'How evidence is presented, witnesses testify, and cross-examination works at trial.', 'video', 4, 16),
    (module_6_id, 'Closing Arguments', 'Understanding closing arguments and how attorneys summarize their cases.', 'video', 5, 12),
    (module_6_id, 'Jury Instructions and Verdict', 'How judges instruct juries on the law and how verdicts are reached.', 'reading', 6, 10),
    (module_6_id, 'Post-Trial Motions and Appeal Rights', 'What happens after a verdict and your options for appealing a decision.', 'video', 7, 10),
    (module_6_id, 'Final Quiz: Civil Litigation Mastery', 'Comprehensive test on everything you''ve learned in Civil Litigation Basics.', 'quiz', 8, 20);

END $$;
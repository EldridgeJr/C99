/*
  # Seed Guided Case Writing Content

  Populates the case writing sections and prompts with initial content.

  1. Sections Created (6 total)
    - Your Story (chronological narrative)
    - Key Facts (important details)
    - Your Position (what you want)
    - Supporting Evidence (what you have)
    - Timeline (sequence of events)
    - Concerns & Questions (worries and unknowns)

  2. Prompts
    - 4 writing prompts per section (24 total)
    - Each includes helper text and word limits
*/

INSERT INTO case_writing_sections (title, description, order_index, icon) VALUES
  ('Your Story', 'Tell your story in your own words. Write freely about what happened, focusing on the facts as you experienced them.', 1, 'BookOpen'),
  ('Key Facts', 'Identify the most important facts of your case. What are the crucial details that matter most?', 2, 'List'),
  ('Your Position', 'What do you want to achieve? What outcome are you seeking from this legal matter?', 3, 'Target'),
  ('Supporting Evidence', 'What evidence do you have? Documents, witnesses, photos, or other materials that support your case.', 4, 'FileCheck'),
  ('Timeline', 'When did things happen? Create a clear sequence of events with dates and times.', 5, 'Calendar'),
  ('Concerns & Questions', 'What worries you? What questions do you have? This helps identify areas needing attention.', 6, 'HelpCircle')
ON CONFLICT DO NOTHING;

DO $$
DECLARE
  story_section_id uuid;
  facts_section_id uuid;
  position_section_id uuid;
  evidence_section_id uuid;
  timeline_section_id uuid;
  concerns_section_id uuid;
BEGIN
  SELECT id INTO story_section_id FROM case_writing_sections WHERE title = 'Your Story';
  SELECT id INTO facts_section_id FROM case_writing_sections WHERE title = 'Key Facts';
  SELECT id INTO position_section_id FROM case_writing_sections WHERE title = 'Your Position';
  SELECT id INTO evidence_section_id FROM case_writing_sections WHERE title = 'Supporting Evidence';
  SELECT id INTO timeline_section_id FROM case_writing_sections WHERE title = 'Timeline';
  SELECT id INTO concerns_section_id FROM case_writing_sections WHERE title = 'Concerns & Questions';

  INSERT INTO case_writing_prompts (section_id, question, helper_text, order_index, word_limit) VALUES
    (story_section_id, 'What happened? Describe the situation in your own words.', 'Start from the beginning. Write as if you''re telling a friend what happened. Focus on facts, not emotions.', 1, 500),
    (story_section_id, 'Who are the main people involved?', 'List each person and explain their role in the situation. Include names, relationships, and how they''re connected to your case.', 2, 300),
    (story_section_id, 'Where did the main events take place?', 'Describe the locations. Be specific - street addresses, building names, cities. Location details can be important.', 3, 200),
    (story_section_id, 'How has this situation affected you?', 'Describe the impact on your life, work, family, health, or finances. Be honest but stick to facts.', 4, 400);

  INSERT INTO case_writing_prompts (section_id, question, helper_text, order_index, word_limit) VALUES
    (facts_section_id, 'What are the three most important facts of your case?', 'If you could only share three things, what would they be? Number them 1, 2, 3 in order of importance.', 1, 300),
    (facts_section_id, 'What agreements or contracts are involved?', 'Were there any written agreements, verbal promises, or contracts? Describe what was agreed upon.', 2, 300),
    (facts_section_id, 'What actions were taken by each party?', 'List specific actions: who did what, when, and why it matters to your case.', 3, 400),
    (facts_section_id, 'What makes your situation legally relevant?', 'Why do you believe this is a legal matter? What laws, rights, or obligations do you think apply?', 4, 300);

  INSERT INTO case_writing_prompts (section_id, question, helper_text, order_index, word_limit) VALUES
    (position_section_id, 'What outcome do you want?', 'Be specific. Do you want money, an action to stop/start, an apology, or something else? Describe your ideal resolution.', 1, 300),
    (position_section_id, 'Why do you believe you''re entitled to this outcome?', 'Explain your reasoning. What makes your desired outcome fair or legally justified?', 2, 400),
    (position_section_id, 'What would you accept as a compromise?', 'Is there a middle ground? What would be an acceptable alternative outcome?', 3, 300),
    (position_section_id, 'What are you willing to do to reach a resolution?', 'Are you open to negotiation, mediation, or other approaches? What are your boundaries?', 4, 300);

  INSERT INTO case_writing_prompts (section_id, question, helper_text, order_index, word_limit) VALUES
    (evidence_section_id, 'What documents do you have?', 'List all relevant documents: contracts, emails, letters, receipts, invoices, photos, etc. Just list them for now.', 1, 400),
    (evidence_section_id, 'Who can support your version of events?', 'List potential witnesses who saw or heard what happened. Include their names and what they witnessed.', 2, 300),
    (evidence_section_id, 'What physical evidence exists?', 'Photos, videos, damaged items, recordings, text messages. Describe what you have or know about.', 3, 300),
    (evidence_section_id, 'What evidence might the other side have?', 'Think from their perspective. What documents or witnesses might they use? This helps prepare.', 4, 300);

  INSERT INTO case_writing_prompts (section_id, question, helper_text, order_index, word_limit) VALUES
    (timeline_section_id, 'When did this situation first begin?', 'Provide the date (or approximate date) when the issue started. What happened on that day?', 1, 200),
    (timeline_section_id, 'What key events happened, and when?', 'List major events in chronological order with dates. Format: [Date] - [What happened]', 2, 500),
    (timeline_section_id, 'When did you first realize there was a problem?', 'Sometimes the problem isn''t obvious immediately. When did you understand something was wrong?', 3, 200),
    (timeline_section_id, 'What deadlines or time limits apply to your case?', 'Are there court dates, statute of limitations, contract deadlines, or other time-sensitive issues?', 4, 300);

  INSERT INTO case_writing_prompts (section_id, question, helper_text, order_index, word_limit) VALUES
    (concerns_section_id, 'What worries you most about this situation?', 'Be honest about your concerns. Understanding your worries helps address them proactively.', 1, 300),
    (concerns_section_id, 'What questions do you have about the legal process?', 'What do you want to understand better? No question is too basic - write them all down.', 2, 400),
    (concerns_section_id, 'What information do you still need to gather?', 'What''s missing? What documents, facts, or details do you need to track down?', 3, 300),
    (concerns_section_id, 'What would success look like for you?', 'Beyond the legal outcome, what would make you feel this was resolved successfully?', 4, 300);

END $$;
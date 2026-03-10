/*
  # Guided Case Writing Schema

  Creates tables for the Guided Case Writing feature where clients
  work step-by-step through structured writing assignments about their case.

  1. New Tables
    - `case_writing_sections` - Section templates (Your Story, Key Facts, etc.)
    - `case_writing_prompts` - Writing prompts within each section
    - `case_writing_responses` - User responses to prompts with scoring
    - `case_writing_progress` - Tracks user progress through sections

  2. Security
    - RLS enabled on all tables
    - Authenticated users can read sections and prompts
    - Users can only read/write their own responses and progress
*/

CREATE TABLE IF NOT EXISTS case_writing_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  order_index integer NOT NULL,
  icon text DEFAULT 'FileText',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE case_writing_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view case writing sections"
  ON case_writing_sections FOR SELECT
  TO authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS case_writing_prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid NOT NULL REFERENCES case_writing_sections(id) ON DELETE CASCADE,
  question text NOT NULL,
  helper_text text,
  order_index integer NOT NULL,
  word_limit integer DEFAULT 500,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE case_writing_prompts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view case writing prompts"
  ON case_writing_prompts FOR SELECT
  TO authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS case_writing_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  prompt_id uuid NOT NULL REFERENCES case_writing_prompts(id) ON DELETE CASCADE,
  response_text text DEFAULT '',
  clarity_score integer DEFAULT 0,
  focus_score integer DEFAULT 0,
  stress_indicators jsonb DEFAULT '[]'::jsonb,
  word_count integer DEFAULT 0,
  last_edited_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, prompt_id)
);

ALTER TABLE case_writing_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own case writing responses"
  ON case_writing_responses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own case writing responses"
  ON case_writing_responses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own case writing responses"
  ON case_writing_responses FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own case writing responses"
  ON case_writing_responses FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS case_writing_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  current_section_id uuid REFERENCES case_writing_sections(id) ON DELETE SET NULL,
  current_prompt_id uuid REFERENCES case_writing_prompts(id) ON DELETE SET NULL,
  completed_prompts jsonb DEFAULT '[]'::jsonb,
  last_active_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE case_writing_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own case writing progress"
  ON case_writing_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own case writing progress"
  ON case_writing_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own case writing progress"
  ON case_writing_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_case_writing_prompts_section_id ON case_writing_prompts(section_id);
CREATE INDEX IF NOT EXISTS idx_case_writing_responses_user_id ON case_writing_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_case_writing_responses_prompt_id ON case_writing_responses(prompt_id);
CREATE INDEX IF NOT EXISTS idx_case_writing_progress_user_id ON case_writing_progress(user_id);
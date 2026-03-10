/*
  # Add Dashboard Features Schema
  
  1. New Tables
    - `cases` - Client cases managed by law firms
      - `id` (uuid, primary key)
      - `case_number` (text, unique)
      - `client_id` (uuid, references profiles)
      - `law_firm_id` (uuid, references law_firms)
      - `case_type` (text) - civil, criminal, family, corporate, etc.
      - `status` (text) - open, closed, pending
      - `description` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `case_modules` - Modules assigned to specific cases
      - `id` (uuid, primary key)
      - `case_id` (uuid, references cases)
      - `course_id` (uuid, references courses)
      - `module_id` (uuid, references modules)
      - `assigned_at` (timestamptz)
    
    - `content_items` - Videos, audios, exercises for clients
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `content_type` (text) - video, audio, exercise, article
      - `category` (text) - law, business, mental_health, focus, court
      - `url` (text)
      - `thumbnail_url` (text)
      - `duration_minutes` (integer)
      - `difficulty_level` (text)
      - `created_at` (timestamptz)
    
    - `client_progress` - Track client progress through content
      - `id` (uuid, primary key)
      - `client_id` (uuid, references profiles)
      - `content_item_id` (uuid, references content_items)
      - `case_id` (uuid, references cases)
      - `progress_percentage` (integer)
      - `completed` (boolean)
      - `last_accessed` (timestamptz)
      - `created_at` (timestamptz)
    
    - `exercises` - Interactive exercises for clients
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `exercise_type` (text) - swipe, quiz, reflection
      - `category` (text)
      - `content` (jsonb) - exercise data
      - `xp_reward` (integer)
      - `created_at` (timestamptz)
    
    - `client_stats` - Statistics and streak tracking
      - `id` (uuid, primary key)
      - `client_id` (uuid, references profiles)
      - `total_xp` (integer)
      - `current_streak` (integer)
      - `longest_streak` (integer)
      - `last_activity` (date)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS on all tables
    - Add policies for each user type
*/

-- Cases table
CREATE TABLE IF NOT EXISTS cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_number text UNIQUE NOT NULL,
  client_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  law_firm_id uuid REFERENCES law_firms(id) ON DELETE CASCADE,
  case_type text NOT NULL,
  status text DEFAULT 'open',
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE cases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Court99 admins can view all cases"
  ON cases FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'admin'
      AND profiles.law_firm_id IS NULL
    )
  );

CREATE POLICY "Law firm admins can view their firm's cases"
  ON cases FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'admin'
      AND profiles.law_firm_id = cases.law_firm_id
    )
  );

CREATE POLICY "Clients can view their own cases"
  ON cases FOR SELECT
  TO authenticated
  USING (auth.uid() = client_id);

CREATE POLICY "Law firm admins can insert cases for their firm"
  ON cases FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'admin'
      AND profiles.law_firm_id = cases.law_firm_id
    )
  );

CREATE POLICY "Law firm admins can update their firm's cases"
  ON cases FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'admin'
      AND profiles.law_firm_id = cases.law_firm_id
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'admin'
      AND profiles.law_firm_id = cases.law_firm_id
    )
  );

-- Case modules table
CREATE TABLE IF NOT EXISTS case_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid REFERENCES cases(id) ON DELETE CASCADE,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  module_id uuid REFERENCES modules(id) ON DELETE CASCADE,
  assigned_at timestamptz DEFAULT now()
);

ALTER TABLE case_modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view modules for their accessible cases"
  ON case_modules FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cases
      WHERE cases.id = case_modules.case_id
      AND (
        cases.client_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND (
            (profiles.user_type = 'admin' AND profiles.law_firm_id IS NULL)
            OR (profiles.user_type = 'admin' AND profiles.law_firm_id = cases.law_firm_id)
          )
        )
      )
    )
  );

CREATE POLICY "Law firm admins can manage case modules"
  ON case_modules FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cases
      JOIN profiles ON profiles.id = auth.uid()
      WHERE cases.id = case_modules.case_id
      AND profiles.user_type = 'admin'
      AND profiles.law_firm_id = cases.law_firm_id
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM cases
      JOIN profiles ON profiles.id = auth.uid()
      WHERE cases.id = case_modules.case_id
      AND profiles.user_type = 'admin'
      AND profiles.law_firm_id = cases.law_firm_id
    )
  );

-- Content items table
CREATE TABLE IF NOT EXISTS content_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  content_type text NOT NULL,
  category text NOT NULL,
  url text,
  thumbnail_url text,
  duration_minutes integer DEFAULT 0,
  difficulty_level text DEFAULT 'beginner',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All authenticated users can view content items"
  ON content_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Court99 admins can manage content items"
  ON content_items FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'admin'
      AND profiles.law_firm_id IS NULL
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'admin'
      AND profiles.law_firm_id IS NULL
    )
  );

-- Client progress table
CREATE TABLE IF NOT EXISTS client_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  content_item_id uuid REFERENCES content_items(id) ON DELETE CASCADE,
  case_id uuid REFERENCES cases(id) ON DELETE CASCADE,
  progress_percentage integer DEFAULT 0,
  completed boolean DEFAULT false,
  last_accessed timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(client_id, content_item_id, case_id)
);

ALTER TABLE client_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can view own progress"
  ON client_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = client_id);

CREATE POLICY "Law firm admins can view their clients' progress"
  ON client_progress FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cases
      JOIN profiles ON profiles.id = auth.uid()
      WHERE cases.id = client_progress.case_id
      AND profiles.user_type = 'admin'
      AND profiles.law_firm_id = cases.law_firm_id
    )
  );

CREATE POLICY "Clients can update own progress"
  ON client_progress FOR ALL
  TO authenticated
  USING (auth.uid() = client_id)
  WITH CHECK (auth.uid() = client_id);

-- Exercises table
CREATE TABLE IF NOT EXISTS exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  exercise_type text NOT NULL,
  category text NOT NULL,
  content jsonb NOT NULL,
  xp_reward integer DEFAULT 10,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All authenticated users can view exercises"
  ON exercises FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Court99 admins can manage exercises"
  ON exercises FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'admin'
      AND profiles.law_firm_id IS NULL
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'admin'
      AND profiles.law_firm_id IS NULL
    )
  );

-- Client stats table
CREATE TABLE IF NOT EXISTS client_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  total_xp integer DEFAULT 0,
  current_streak integer DEFAULT 0,
  longest_streak integer DEFAULT 0,
  last_activity date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE client_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can view own stats"
  ON client_stats FOR SELECT
  TO authenticated
  USING (auth.uid() = client_id);

CREATE POLICY "Clients can update own stats"
  ON client_stats FOR UPDATE
  TO authenticated
  USING (auth.uid() = client_id)
  WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Clients can insert own stats"
  ON client_stats FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = client_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cases_client_id ON cases(client_id);
CREATE INDEX IF NOT EXISTS idx_cases_law_firm_id ON cases(law_firm_id);
CREATE INDEX IF NOT EXISTS idx_cases_status ON cases(status);
CREATE INDEX IF NOT EXISTS idx_case_modules_case_id ON case_modules(case_id);
CREATE INDEX IF NOT EXISTS idx_client_progress_client_id ON client_progress(client_id);
CREATE INDEX IF NOT EXISTS idx_client_progress_case_id ON client_progress(case_id);
CREATE INDEX IF NOT EXISTS idx_content_items_category ON content_items(category);
CREATE INDEX IF NOT EXISTS idx_content_items_content_type ON content_items(content_type);

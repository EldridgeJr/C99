/*
  # Legal Prep Platform Schema

  ## Overview
  Creates a comprehensive learning platform schema for legal education similar to CodeCademy/Duolingo.

  ## New Tables
  
  1. `profiles`
    - `id` (uuid, primary key, references auth.users)
    - `full_name` (text)
    - `avatar_url` (text, nullable)
    - `user_type` (text) - 'client' or 'admin'
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  2. `courses`
    - `id` (uuid, primary key)
    - `title` (text)
    - `description` (text)
    - `difficulty_level` (text) - 'beginner', 'intermediate', 'advanced'
    - `category` (text) - e.g., 'Court Procedures', 'Legal Documentation'
    - `estimated_hours` (integer)
    - `is_free` (boolean)
    - `certificate_enabled` (boolean)
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  3. `modules`
    - `id` (uuid, primary key)
    - `course_id` (uuid, references courses)
    - `title` (text)
    - `description` (text)
    - `order_index` (integer)
    - `xp_reward` (integer)
    - `created_at` (timestamptz)

  4. `lessons`
    - `id` (uuid, primary key)
    - `module_id` (uuid, references modules)
    - `title` (text)
    - `content` (text)
    - `lesson_type` (text) - 'video', 'reading', 'quiz', 'interactive'
    - `order_index` (integer)
    - `duration_minutes` (integer)
    - `created_at` (timestamptz)

  5. `user_progress`
    - `id` (uuid, primary key)
    - `user_id` (uuid, references profiles)
    - `course_id` (uuid, references courses)
    - `module_id` (uuid, references modules, nullable)
    - `lesson_id` (uuid, references lessons, nullable)
    - `progress_percentage` (integer)
    - `completed` (boolean)
    - `last_accessed` (timestamptz)
    - `created_at` (timestamptz)

  6. `user_xp`
    - `id` (uuid, primary key)
    - `user_id` (uuid, references profiles)
    - `category` (text)
    - `total_xp` (integer)
    - `updated_at` (timestamptz)

  7. `weekly_goals`
    - `id` (uuid, primary key)
    - `user_id` (uuid, references profiles)
    - `target_xp` (integer)
    - `current_xp` (integer)
    - `week_start` (date)
    - `created_at` (timestamptz)

  8. `live_sessions`
    - `id` (uuid, primary key)
    - `title` (text)
    - `description` (text)
    - `session_type` (text) - 'testimony', 'court_procedures', 'evidence', 'cross_examination'
    - `scheduled_at` (timestamptz)
    - `duration_minutes` (integer)
    - `max_participants` (integer)
    - `created_at` (timestamptz)

  9. `user_cases`
    - `id` (uuid, primary key)
    - `user_id` (uuid, references profiles)
    - `case_name` (text)
    - `hearing_date` (date, nullable)
    - `status` (text)
    - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Add policies for authenticated users to manage their own data
  - Add admin policies for content management
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name text NOT NULL,
  avatar_url text,
  user_type text NOT NULL DEFAULT 'client' CHECK (user_type IN ('client', 'admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  difficulty_level text NOT NULL CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  category text NOT NULL,
  estimated_hours integer NOT NULL DEFAULT 0,
  is_free boolean DEFAULT false,
  certificate_enabled boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view courses"
  ON courses FOR SELECT
  TO authenticated
  USING (true);

-- Create modules table
CREATE TABLE IF NOT EXISTS modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  order_index integer NOT NULL,
  xp_reward integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view modules"
  ON modules FOR SELECT
  TO authenticated
  USING (true);

-- Create lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id uuid NOT NULL REFERENCES modules ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  lesson_type text NOT NULL CHECK (lesson_type IN ('video', 'reading', 'quiz', 'interactive')),
  order_index integer NOT NULL,
  duration_minutes integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view lessons"
  ON lessons FOR SELECT
  TO authenticated
  USING (true);

-- Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES courses ON DELETE CASCADE,
  module_id uuid REFERENCES modules ON DELETE CASCADE,
  lesson_id uuid REFERENCES lessons ON DELETE CASCADE,
  progress_percentage integer DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  completed boolean DEFAULT false,
  last_accessed timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, course_id, module_id, lesson_id)
);

ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress"
  ON user_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON user_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create user_xp table
CREATE TABLE IF NOT EXISTS user_xp (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles ON DELETE CASCADE,
  category text NOT NULL,
  total_xp integer DEFAULT 0,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, category)
);

ALTER TABLE user_xp ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own XP"
  ON user_xp FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own XP"
  ON user_xp FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create weekly_goals table
CREATE TABLE IF NOT EXISTS weekly_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles ON DELETE CASCADE,
  target_xp integer NOT NULL,
  current_xp integer DEFAULT 0,
  week_start date NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, week_start)
);

ALTER TABLE weekly_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own goals"
  ON weekly_goals FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own goals"
  ON weekly_goals FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create live_sessions table
CREATE TABLE IF NOT EXISTS live_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  session_type text NOT NULL CHECK (session_type IN ('testimony', 'court_procedures', 'evidence', 'cross_examination')),
  scheduled_at timestamptz NOT NULL,
  duration_minutes integer DEFAULT 60,
  max_participants integer DEFAULT 20,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE live_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view sessions"
  ON live_sessions FOR SELECT
  TO authenticated
  USING (true);

-- Create user_cases table
CREATE TABLE IF NOT EXISTS user_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles ON DELETE CASCADE,
  case_name text NOT NULL,
  hearing_date date,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_cases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own cases"
  ON user_cases FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own cases"
  ON user_cases FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_modules_course_id ON modules(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_module_id ON lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_course_id ON user_progress(course_id);
CREATE INDEX IF NOT EXISTS idx_user_xp_user_id ON user_xp(user_id);
CREATE INDEX IF NOT EXISTS idx_weekly_goals_user_id ON weekly_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_user_cases_user_id ON user_cases(user_id);
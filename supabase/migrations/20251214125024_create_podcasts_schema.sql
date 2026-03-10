/*
  # Create Podcasts Schema

  1. New Tables
    - `podcasts`
      - `id` (uuid, primary key)
      - `title` (text) - Podcast series title
      - `description` (text) - Podcast description
      - `host_name` (text) - Name of the podcast host
      - `category` (text) - Category (law, mental_health, business, etc.)
      - `thumbnail_url` (text) - Podcast cover image
      - `is_published` (boolean) - Whether the podcast is published
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `podcast_episodes`
      - `id` (uuid, primary key)
      - `podcast_id` (uuid, foreign key to podcasts)
      - `episode_number` (integer) - Episode number in series
      - `title` (text) - Episode title
      - `description` (text) - Episode description
      - `audio_url` (text) - URL to audio file
      - `duration_minutes` (integer) - Episode duration in minutes
      - `published_date` (date) - When the episode was published
      - `transcript_url` (text, nullable) - Optional transcript URL
      - `is_published` (boolean) - Whether the episode is published
      - `created_at` (timestamptz)
    
    - `podcast_progress`
      - `id` (uuid, primary key)
      - `client_id` (uuid, foreign key to profiles)
      - `episode_id` (uuid, foreign key to podcast_episodes)
      - `progress_seconds` (integer) - Current playback position in seconds
      - `completed` (boolean) - Whether the episode was completed
      - `last_listened_at` (timestamptz) - Last time the user listened
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Clients can view published podcasts and episodes
    - Clients can manage their own progress
    - Admins can manage all podcast content
*/

-- Create podcasts table
CREATE TABLE IF NOT EXISTS podcasts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  host_name text NOT NULL,
  category text NOT NULL,
  thumbnail_url text NOT NULL,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create podcast_episodes table
CREATE TABLE IF NOT EXISTS podcast_episodes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  podcast_id uuid NOT NULL REFERENCES podcasts(id) ON DELETE CASCADE,
  episode_number integer NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  audio_url text NOT NULL,
  duration_minutes integer NOT NULL,
  published_date date DEFAULT CURRENT_DATE,
  transcript_url text,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create podcast_progress table
CREATE TABLE IF NOT EXISTS podcast_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  episode_id uuid NOT NULL REFERENCES podcast_episodes(id) ON DELETE CASCADE,
  progress_seconds integer DEFAULT 0,
  completed boolean DEFAULT false,
  last_listened_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(client_id, episode_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_podcast_episodes_podcast_id ON podcast_episodes(podcast_id);
CREATE INDEX IF NOT EXISTS idx_podcast_progress_client_id ON podcast_progress(client_id);
CREATE INDEX IF NOT EXISTS idx_podcast_progress_episode_id ON podcast_progress(episode_id);

-- Enable Row Level Security
ALTER TABLE podcasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE podcast_episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE podcast_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for podcasts table
CREATE POLICY "Clients can view published podcasts"
  ON podcasts
  FOR SELECT
  TO authenticated
  USING (is_published = true);

CREATE POLICY "Admins can manage all podcasts"
  ON podcasts
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'admin'
    )
  );

-- RLS Policies for podcast_episodes table
CREATE POLICY "Clients can view published episodes"
  ON podcast_episodes
  FOR SELECT
  TO authenticated
  USING (
    is_published = true 
    AND EXISTS (
      SELECT 1 FROM podcasts
      WHERE podcasts.id = podcast_episodes.podcast_id
      AND podcasts.is_published = true
    )
  );

CREATE POLICY "Admins can manage all episodes"
  ON podcast_episodes
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'admin'
    )
  );

-- RLS Policies for podcast_progress table
CREATE POLICY "Clients can view own progress"
  ON podcast_progress
  FOR SELECT
  TO authenticated
  USING (client_id = auth.uid());

CREATE POLICY "Clients can insert own progress"
  ON podcast_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (client_id = auth.uid());

CREATE POLICY "Clients can update own progress"
  ON podcast_progress
  FOR UPDATE
  TO authenticated
  USING (client_id = auth.uid())
  WITH CHECK (client_id = auth.uid());

CREATE POLICY "Admins can view all progress"
  ON podcast_progress
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'admin'
    )
  );
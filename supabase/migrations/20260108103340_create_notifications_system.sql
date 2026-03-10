/*
  # Create Notifications System

  1. New Tables
    - `notifications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles)
      - `type` (text) - notification type: 'course_completed', 'podcast_completed', 'resource_completed'
      - `title` (text) - notification title
      - `message` (text) - notification message
      - `source_id` (uuid) - ID of the completed item
      - `source_type` (text) - type of completed item: 'course', 'podcast', 'resource'
      - `is_read` (boolean) - whether the notification has been read
      - `created_at` (timestamp)
  
  2. Security
    - Enable RLS on `notifications` table
    - Add policy for users to read their own notifications
    - Add policy for users to update their own notifications (mark as read)
  
  3. Functions & Triggers
    - Create function to generate completion notifications
    - Add triggers on user_progress, podcast_progress, and resource_reads tables
*/

CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  type text NOT NULL CHECK (type IN ('course_completed', 'podcast_completed', 'resource_completed', 'module_completed', 'lesson_completed')),
  title text NOT NULL,
  message text NOT NULL,
  source_id uuid NOT NULL,
  source_type text NOT NULL CHECK (source_type IN ('course', 'podcast', 'resource', 'module', 'lesson')),
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION create_course_completion_notification()
RETURNS TRIGGER AS $$
DECLARE
  course_title text;
BEGIN
  IF NEW.completed = true AND (OLD.completed IS NULL OR OLD.completed = false) THEN
    SELECT title INTO course_title FROM courses WHERE id = NEW.course_id;
    
    INSERT INTO notifications (user_id, type, title, message, source_id, source_type)
    VALUES (
      NEW.user_id,
      'course_completed',
      'Course Completed!',
      'Congratulations! You completed "' || course_title || '"',
      NEW.course_id,
      'course'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION create_podcast_completion_notification()
RETURNS TRIGGER AS $$
DECLARE
  episode_title text;
  podcast_title text;
BEGIN
  IF NEW.completed = true AND (OLD.completed IS NULL OR OLD.completed = false) THEN
    SELECT pe.title, p.title 
    INTO episode_title, podcast_title 
    FROM podcast_episodes pe
    JOIN podcasts p ON p.id = pe.podcast_id
    WHERE pe.id = NEW.episode_id;
    
    INSERT INTO notifications (user_id, type, title, message, source_id, source_type)
    VALUES (
      NEW.client_id,
      'podcast_completed',
      'Podcast Episode Completed!',
      'You finished listening to "' || episode_title || '" from ' || podcast_title,
      NEW.episode_id,
      'podcast'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION create_resource_completion_notification()
RETURNS TRIGGER AS $$
DECLARE
  resource_title text;
BEGIN
  IF NEW.completed = true AND (OLD.completed IS NULL OR OLD.completed = false) THEN
    SELECT title INTO resource_title FROM business_resources WHERE id = NEW.resource_id;
    
    INSERT INTO notifications (user_id, type, title, message, source_id, source_type)
    VALUES (
      NEW.client_id,
      'resource_completed',
      'Resource Completed!',
      'You finished reading "' || resource_title || '"',
      NEW.resource_id,
      'resource'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_course_completion_notification'
  ) THEN
    CREATE TRIGGER trigger_course_completion_notification
      AFTER INSERT OR UPDATE ON user_progress
      FOR EACH ROW
      EXECUTE FUNCTION create_course_completion_notification();
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_podcast_completion_notification'
  ) THEN
    CREATE TRIGGER trigger_podcast_completion_notification
      AFTER INSERT OR UPDATE ON podcast_progress
      FOR EACH ROW
      EXECUTE FUNCTION create_podcast_completion_notification();
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_resource_completion_notification'
  ) THEN
    CREATE TRIGGER trigger_resource_completion_notification
      AFTER INSERT OR UPDATE ON resource_reads
      FOR EACH ROW
      EXECUTE FUNCTION create_resource_completion_notification();
  END IF;
END $$;
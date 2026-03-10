/*
  # Add Streak Update System

  ## Overview
  Implements automatic streak tracking that updates when users complete any content.

  ## Changes
  
  1. **Database Function**: `update_user_streak`
     - Automatically called when content is completed
     - Initializes client_stats if it doesn't exist
     - Updates streak logic:
       * If last activity was yesterday: increment current_streak
       * If last activity was today: no change (already counted)
       * If last activity was before yesterday: reset streak to 1
     - Updates longest_streak if current_streak exceeds it
     - Sets last_activity to today's date
  
  2. **Triggers**: Added to all progress tables
     - `user_progress` - triggers on course/module/lesson completion
     - `client_progress` - triggers on content item completion
     - `podcast_progress` - triggers on podcast episode completion
     - Only fires when `completed` changes from false to true
  
  ## Security
  - Uses existing RLS policies on client_stats table
  - Function runs with SECURITY DEFINER to ensure proper access
  - Only updates stats for the user making the change
*/

-- Function to update user streak
CREATE OR REPLACE FUNCTION update_user_streak(user_id_param uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_stats RECORD;
  days_since_last_activity integer;
  new_streak integer;
BEGIN
  -- Get or create client_stats record
  INSERT INTO client_stats (client_id, total_xp, current_streak, longest_streak, last_activity)
  VALUES (user_id_param, 0, 0, 0, NULL)
  ON CONFLICT (client_id) DO NOTHING;
  
  -- Lock the row for update
  SELECT current_streak, longest_streak, last_activity
  INTO current_stats
  FROM client_stats
  WHERE client_id = user_id_param
  FOR UPDATE;
  
  -- Calculate days since last activity
  IF current_stats.last_activity IS NULL THEN
    days_since_last_activity = NULL;
  ELSE
    days_since_last_activity = CURRENT_DATE - current_stats.last_activity;
  END IF;
  
  -- Update streak based on last activity
  IF days_since_last_activity IS NULL OR days_since_last_activity > 1 THEN
    -- First activity or missed a day - start new streak
    new_streak = 1;
  ELSIF days_since_last_activity = 1 THEN
    -- Activity was yesterday - continue streak
    new_streak = current_stats.current_streak + 1;
  ELSE
    -- Activity was today - don't change streak
    new_streak = current_stats.current_streak;
  END IF;
  
  -- Only update if not already updated today
  IF days_since_last_activity IS NULL OR days_since_last_activity > 0 THEN
    UPDATE client_stats
    SET 
      current_streak = new_streak,
      longest_streak = GREATEST(longest_streak, new_streak),
      last_activity = CURRENT_DATE,
      updated_at = now()
    WHERE client_id = user_id_param;
  END IF;
END;
$$;

-- Trigger function for user_progress table
CREATE OR REPLACE FUNCTION trigger_update_streak_on_user_progress()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only update streak when marking as completed
  IF NEW.completed = true AND (OLD.completed IS NULL OR OLD.completed = false) THEN
    PERFORM update_user_streak(NEW.user_id);
  END IF;
  RETURN NEW;
END;
$$;

-- Trigger function for client_progress table
CREATE OR REPLACE FUNCTION trigger_update_streak_on_client_progress()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only update streak when marking as completed
  IF NEW.completed = true AND (OLD.completed IS NULL OR OLD.completed = false) THEN
    PERFORM update_user_streak(NEW.client_id);
  END IF;
  RETURN NEW;
END;
$$;

-- Trigger function for podcast_progress table
CREATE OR REPLACE FUNCTION trigger_update_streak_on_podcast_progress()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only update streak when marking as completed
  IF NEW.completed = true AND (OLD.completed IS NULL OR OLD.completed = false) THEN
    PERFORM update_user_streak(NEW.client_id);
  END IF;
  RETURN NEW;
END;
$$;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_streak_on_user_progress ON user_progress;
DROP TRIGGER IF EXISTS update_streak_on_client_progress ON client_progress;
DROP TRIGGER IF EXISTS update_streak_on_podcast_progress ON podcast_progress;

-- Create triggers on all progress tables
CREATE TRIGGER update_streak_on_user_progress
  AFTER INSERT OR UPDATE OF completed ON user_progress
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_streak_on_user_progress();

CREATE TRIGGER update_streak_on_client_progress
  AFTER INSERT OR UPDATE OF completed ON client_progress
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_streak_on_client_progress();

CREATE TRIGGER update_streak_on_podcast_progress
  AFTER INSERT OR UPDATE OF completed ON podcast_progress
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_streak_on_podcast_progress();

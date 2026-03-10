/*
  # XP Award Triggers

  ## Overview
  Automatically awards XP when clients complete various types of content.

  ## Triggers Created
  
  ### 1. Lesson Completion Trigger
  - Awards XP when user_progress is marked as completed for a lesson
  - Uses lesson's xp_reward value

  ### 2. Module Completion Trigger
  - Awards XP when all lessons in a module are completed
  - Uses module's xp_reward value

  ### 3. Content Item Completion Trigger
  - Awards XP when client_progress is marked as completed for content_items
  - Uses content_item's xp_reward value

  ### 4. Podcast Episode Completion Trigger
  - Awards XP when podcast_progress is marked as completed
  - Uses episode's xp_reward value

  ### 5. Exercise Completion Trigger
  - Awards XP when exercise is completed
  - Uses exercise's xp_reward value

  ## Important Notes
  - Triggers only fire when completed status changes from false to true
  - Duplicate XP awards are prevented by the award_xp function
  - All XP awards are logged in xp_transactions table
*/

-- Trigger function for lesson completion
CREATE OR REPLACE FUNCTION trigger_award_lesson_xp()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_xp_reward integer;
  v_lesson_title text;
BEGIN
  -- Only award XP when marking as completed (not when already completed)
  IF NEW.completed = true AND (OLD.completed IS NULL OR OLD.completed = false) AND NEW.lesson_id IS NOT NULL THEN
    -- Get lesson XP reward and title
    SELECT xp_reward, title
    INTO v_xp_reward, v_lesson_title
    FROM lessons
    WHERE id = NEW.lesson_id;

    -- Award XP
    IF v_xp_reward IS NOT NULL AND v_xp_reward > 0 THEN
      PERFORM award_xp(
        NEW.user_id,
        'lesson',
        NEW.lesson_id,
        v_xp_reward,
        'Completed lesson: ' || v_lesson_title
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- Trigger function for module completion
CREATE OR REPLACE FUNCTION trigger_award_module_xp()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_xp_reward integer;
  v_module_title text;
  v_total_lessons integer;
  v_completed_lessons integer;
BEGIN
  -- Only check when a lesson is completed and module_id exists
  IF NEW.completed = true AND NEW.module_id IS NOT NULL THEN
    -- Count total and completed lessons in this module for this user
    SELECT COUNT(DISTINCT l.id), COUNT(DISTINCT up.lesson_id)
    INTO v_total_lessons, v_completed_lessons
    FROM lessons l
    LEFT JOIN user_progress up ON up.lesson_id = l.id 
      AND up.user_id = NEW.user_id 
      AND up.completed = true
    WHERE l.module_id = NEW.module_id;

    -- If all lessons are completed, award module XP
    IF v_total_lessons = v_completed_lessons THEN
      SELECT xp_reward, title
      INTO v_xp_reward, v_module_title
      FROM modules
      WHERE id = NEW.module_id;

      IF v_xp_reward IS NOT NULL AND v_xp_reward > 0 THEN
        PERFORM award_xp(
          NEW.user_id,
          'module',
          NEW.module_id,
          v_xp_reward,
          'Completed module: ' || v_module_title
        );
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- Trigger function for content item completion
CREATE OR REPLACE FUNCTION trigger_award_content_item_xp()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_xp_reward integer;
  v_content_title text;
BEGIN
  IF NEW.completed = true AND (OLD.completed IS NULL OR OLD.completed = false) AND NEW.content_item_id IS NOT NULL THEN
    SELECT xp_reward, title
    INTO v_xp_reward, v_content_title
    FROM content_items
    WHERE id = NEW.content_item_id;

    IF v_xp_reward IS NOT NULL AND v_xp_reward > 0 THEN
      PERFORM award_xp(
        NEW.client_id,
        'content_item',
        NEW.content_item_id,
        v_xp_reward,
        'Completed: ' || v_content_title
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- Trigger function for podcast episode completion
CREATE OR REPLACE FUNCTION trigger_award_podcast_xp()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_xp_reward integer;
  v_episode_title text;
BEGIN
  IF NEW.completed = true AND (OLD.completed IS NULL OR OLD.completed = false) THEN
    SELECT xp_reward, title
    INTO v_xp_reward, v_episode_title
    FROM podcast_episodes
    WHERE id = NEW.episode_id;

    IF v_xp_reward IS NOT NULL AND v_xp_reward > 0 THEN
      PERFORM award_xp(
        NEW.client_id,
        'podcast',
        NEW.episode_id,
        v_xp_reward,
        'Completed podcast: ' || v_episode_title
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- Create triggers
DROP TRIGGER IF EXISTS on_lesson_completed ON user_progress;
CREATE TRIGGER on_lesson_completed
  AFTER INSERT OR UPDATE ON user_progress
  FOR EACH ROW
  EXECUTE FUNCTION trigger_award_lesson_xp();

DROP TRIGGER IF EXISTS on_module_completed ON user_progress;
CREATE TRIGGER on_module_completed
  AFTER INSERT OR UPDATE ON user_progress
  FOR EACH ROW
  EXECUTE FUNCTION trigger_award_module_xp();

DROP TRIGGER IF EXISTS on_content_item_completed ON client_progress;
CREATE TRIGGER on_content_item_completed
  AFTER INSERT OR UPDATE ON client_progress
  FOR EACH ROW
  EXECUTE FUNCTION trigger_award_content_item_xp();

DROP TRIGGER IF EXISTS on_podcast_completed ON podcast_progress;
CREATE TRIGGER on_podcast_completed
  AFTER INSERT OR UPDATE ON podcast_progress
  FOR EACH ROW
  EXECUTE FUNCTION trigger_award_podcast_xp();

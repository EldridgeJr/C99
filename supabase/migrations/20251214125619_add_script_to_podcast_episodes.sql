/*
  # Add Script Content to Podcast Episodes

  1. Changes
    - Add `script` column to `podcast_episodes` table to store the episode script/content
    - This will be used to generate audio dynamically using text-to-speech
  
  2. Notes
    - Script content will be used by the TTS edge function
    - Allows for fully generative podcast content
*/

-- Add script column to podcast_episodes
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'podcast_episodes' AND column_name = 'script'
  ) THEN
    ALTER TABLE podcast_episodes ADD COLUMN script text;
  END IF;
END $$;

/*
  # Add YouTube Audio Episodes to Recent Episodes
  
  1. Changes
    - Insert new podcast episodes using YouTube video as audio source
    - Episodes will appear in "Recent Episodes" section
    
  2. Notes
    - All episodes use the same YouTube video URL: https://www.youtube.com/watch?v=kBdfcR-8hEY
    - Episodes are published and ready for clients to view
    - Added to existing "Legal Prep Essentials" podcast series
*/

DO $$
DECLARE
  legal_prep_id uuid;
BEGIN
  -- Get the Legal Prep Essentials podcast ID
  SELECT id INTO legal_prep_id FROM podcasts WHERE title = 'Legal Prep Essentials' LIMIT 1;
  
  IF legal_prep_id IS NOT NULL THEN
    -- Insert new episodes with YouTube audio
    INSERT INTO podcast_episodes (podcast_id, episode_number, title, description, audio_url, duration_minutes, is_published, published_date)
    VALUES 
      (
        legal_prep_id,
        5,
        'Essential Legal Preparation Strategies',
        'Comprehensive guide to preparing yourself for legal proceedings. Learn key strategies and techniques.',
        'https://www.youtube.com/watch?v=kBdfcR-8hEY',
        15,
        true,
        CURRENT_DATE
      ),
      (
        legal_prep_id,
        6,
        'Advanced Court Preparation Techniques',
        'Deep dive into advanced preparation methods that will help you feel confident and ready.',
        'https://www.youtube.com/watch?v=kBdfcR-8hEY',
        15,
        true,
        CURRENT_DATE
      ),
      (
        legal_prep_id,
        7,
        'Building Your Legal Strategy',
        'Learn how to work with your attorney to build a strong legal strategy and preparation plan.',
        'https://www.youtube.com/watch?v=kBdfcR-8hEY',
        15,
        true,
        CURRENT_DATE
      ),
      (
        legal_prep_id,
        8,
        'Day of Court: Final Preparations',
        'Everything you need to know for the day of your court appearance, from arrival to presentation.',
        'https://www.youtube.com/watch?v=kBdfcR-8hEY',
        15,
        true,
        CURRENT_DATE
      )
    ON CONFLICT DO NOTHING;
  END IF;
END $$;
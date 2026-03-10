/*
  # Add Video URLs to Civil Litigation Basics Video Lessons

  ## Overview
  Updates all video lessons in the Civil Litigation Basics course to include embedded YouTube video URLs.
  
  ## Changes
  - Adds `video_url` field to the content JSON of all video-type lessons
  - Uses the YouTube video: https://www.youtube.com/watch?v=PcP3s289u-8
  
  ## Security
  - Uses existing RLS policies on lessons table
  - No structural changes to database schema
*/

-- Update all video lessons in Civil Litigation Basics course
UPDATE lessons l
SET content = (
  CASE 
    WHEN l.content::text LIKE '{%' THEN
      (l.content::jsonb || jsonb_build_object('video_url', 'https://www.youtube.com/embed/PcP3s289u-8'))::text
    ELSE
      jsonb_build_object(
        'description', l.content,
        'video_url', 'https://www.youtube.com/embed/PcP3s289u-8'
      )::text
  END
)
FROM modules m
JOIN courses c ON m.course_id = c.id
WHERE l.module_id = m.id
  AND c.title = 'Civil Litigation Basics'
  AND l.lesson_type = 'video';

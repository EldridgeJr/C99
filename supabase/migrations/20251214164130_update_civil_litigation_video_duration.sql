/*
  # Update Civil Litigation Video Lesson Duration

  ## Overview
  Updates the duration of all video lessons in the Civil Litigation Basics course to 5 minutes.
  
  ## Changes
  - Sets duration_minutes to 5 for all video-type lessons in Civil Litigation Basics course
  
  ## Security
  - Uses existing RLS policies on lessons table
*/

UPDATE lessons l
SET duration_minutes = 5
FROM modules m
JOIN courses c ON m.course_id = c.id
WHERE l.module_id = m.id
  AND c.title = 'Civil Litigation Basics'
  AND l.lesson_type = 'video';

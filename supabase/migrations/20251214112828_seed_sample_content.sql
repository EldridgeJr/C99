/*
  # Seed Sample Content
  
  1. Content Items
    - Add sample videos, audios, exercises about law, business, mental health
  
  2. Exercises
    - Add sample interactive exercises
*/

-- Insert sample content items
INSERT INTO content_items (title, description, content_type, category, url, thumbnail_url, duration_minutes, difficulty_level) VALUES
  ('Understanding Civil Litigation Basics', 'Learn the fundamentals of civil litigation process', 'video', 'law', 'https://example.com/videos/civil-litigation-basics', 'https://images.pexels.com/photos/8111855/pexels-photo-8111855.jpeg?auto=compress&cs=tinysrgb&w=800', 15, 'beginner'),
  ('Court Procedures Explained', 'A comprehensive guide to court procedures', 'video', 'court', 'https://example.com/videos/court-procedures', 'https://images.pexels.com/photos/6077326/pexels-photo-6077326.jpeg?auto=compress&cs=tinysrgb&w=800', 20, 'beginner'),
  ('Managing Stress During Legal Proceedings', 'Learn techniques to manage stress and anxiety', 'audio', 'mental_health', 'https://example.com/audio/stress-management', 'https://images.pexels.com/photos/3760093/pexels-photo-3760093.jpeg?auto=compress&cs=tinysrgb&w=800', 10, 'beginner'),
  ('Business Law Fundamentals', 'Essential business law concepts for entrepreneurs', 'video', 'business', 'https://example.com/videos/business-law', 'https://images.pexels.com/photos/6077059/pexels-photo-6077059.jpeg?auto=compress&cs=tinysrgb&w=800', 25, 'intermediate'),
  ('Meditation for Focus', 'Guided meditation to improve concentration', 'audio', 'focus', 'https://example.com/audio/meditation-focus', 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=800', 8, 'beginner'),
  ('Your Rights in Court', 'Understanding your legal rights and protections', 'video', 'law', 'https://example.com/videos/rights-in-court', 'https://images.pexels.com/photos/5669619/pexels-photo-5669619.jpeg?auto=compress&cs=tinysrgb&w=800', 18, 'beginner'),
  ('Preparing for Your Court Appearance', 'Tips for presenting yourself effectively in court', 'video', 'court', 'https://example.com/videos/court-appearance', 'https://images.pexels.com/photos/8730890/pexels-photo-8730890.jpeg?auto=compress&cs=tinysrgb&w=800', 12, 'intermediate'),
  ('Building Resilience', 'Develop mental resilience during challenging times', 'audio', 'mental_health', 'https://example.com/audio/building-resilience', 'https://images.pexels.com/photos/5273907/pexels-photo-5273907.jpeg?auto=compress&cs=tinysrgb&w=800', 15, 'intermediate'),
  ('Contract Law Basics', 'Understanding contracts and agreements', 'video', 'business', 'https://example.com/videos/contract-law', 'https://images.pexels.com/photos/7731325/pexels-photo-7731325.jpeg?auto=compress&cs=tinysrgb&w=800', 22, 'beginner'),
  ('Deep Focus Techniques', 'Advanced techniques for maintaining focus', 'audio', 'focus', 'https://example.com/audio/deep-focus', 'https://images.pexels.com/photos/7432705/pexels-photo-7432705.jpeg?auto=compress&cs=tinysrgb&w=800', 12, 'advanced')
ON CONFLICT DO NOTHING;

-- Insert sample exercises
INSERT INTO exercises (title, description, exercise_type, category, content, xp_reward) VALUES
  (
    'Legal Terms Match',
    'Match legal terms with their definitions',
    'swipe',
    'law',
    '{"cards": [{"term": "Plaintiff", "definition": "The person who initiates a lawsuit"}, {"term": "Defendant", "definition": "The person being sued or accused"}, {"term": "Discovery", "definition": "The pre-trial phase where parties exchange information"}]}'::jsonb,
    20
  ),
  (
    'Court Etiquette Quiz',
    'Test your knowledge of proper court behavior',
    'quiz',
    'court',
    '{"questions": [{"question": "Should you stand when the judge enters?", "options": ["Yes", "No"], "correct": 0}, {"question": "Can you interrupt while someone is speaking?", "options": ["Yes", "No"], "correct": 1}]}'::jsonb,
    15
  ),
  (
    'Stress Management Reflection',
    'Reflect on your stress management techniques',
    'reflection',
    'mental_health',
    '{"prompts": ["What situations cause you the most stress?", "What coping mechanisms work best for you?", "How can you prepare mentally for court?"]}'::jsonb,
    10
  ),
  (
    'Business Scenario Analysis',
    'Analyze business legal scenarios',
    'swipe',
    'business',
    '{"scenarios": [{"situation": "Partner wants to leave the business", "action": "Review partnership agreement"}, {"situation": "Customer breach of contract", "action": "Send formal notice"}]}'::jsonb,
    25
  ),
  (
    'Focus Challenge',
    'Complete focus exercises to improve concentration',
    'quiz',
    'focus',
    '{"exercises": [{"type": "breathing", "duration": 60}, {"type": "visualization", "duration": 120}]}'::jsonb,
    15
  )
ON CONFLICT DO NOTHING;

/*
  # Seed Sample Podcasts and Episodes

  1. Inserts
    - Sample podcasts across different categories
    - Sample episodes for each podcast
    
  2. Notes
    - All content is published and ready for clients to view
    - Uses placeholder URLs for audio files and images
*/

-- Insert sample podcasts
INSERT INTO podcasts (title, description, host_name, category, thumbnail_url, is_published)
VALUES 
  (
    'Legal Prep Essentials',
    'Everything you need to know to prepare for your court case. From understanding legal terminology to courtroom etiquette and what to expect during proceedings.',
    'Attorney Sarah Mitchell',
    'law',
    'https://images.pexels.com/photos/8111851/pexels-photo-8111851.jpeg?auto=compress&cs=tinysrgb&w=600',
    true
  ),
  (
    'Mental Wellness Through Legal Challenges',
    'Managing stress and maintaining mental health during legal proceedings. Expert advice from licensed therapists who specialize in helping clients navigate the emotional aspects of litigation.',
    'Dr. James Chen',
    'mental_health',
    'https://images.pexels.com/photos/4101143/pexels-photo-4101143.jpeg?auto=compress&cs=tinysrgb&w=600',
    true
  ),
  (
    'Business Strategy for Litigants',
    'How to manage your business and finances during litigation. Practical advice for entrepreneurs and business owners facing legal challenges.',
    'Rachel Torres',
    'business',
    'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600',
    true
  ),
  (
    'Courtroom Stories',
    'Real stories from clients who have successfully navigated the legal system. Learn from their experiences and gain confidence in your own case.',
    'Michael Roberts',
    'court',
    'https://images.pexels.com/photos/8111713/pexels-photo-8111713.jpeg?auto=compress&cs=tinysrgb&w=600',
    true
  )
ON CONFLICT DO NOTHING;

-- Get podcast IDs (using a DO block to handle the inserts)
DO $$
DECLARE
  legal_prep_id uuid;
  mental_wellness_id uuid;
  business_strategy_id uuid;
  courtroom_stories_id uuid;
BEGIN
  -- Get podcast IDs
  SELECT id INTO legal_prep_id FROM podcasts WHERE title = 'Legal Prep Essentials';
  SELECT id INTO mental_wellness_id FROM podcasts WHERE title = 'Mental Wellness Through Legal Challenges';
  SELECT id INTO business_strategy_id FROM podcasts WHERE title = 'Business Strategy for Litigants';
  SELECT id INTO courtroom_stories_id FROM podcasts WHERE title = 'Courtroom Stories';

  -- Insert episodes for Legal Prep Essentials
  IF legal_prep_id IS NOT NULL THEN
    INSERT INTO podcast_episodes (podcast_id, episode_number, title, description, audio_url, duration_minutes, is_published)
    VALUES 
      (
        legal_prep_id,
        1,
        'Understanding Your Case: The Basics',
        'Learn the fundamental aspects of your legal case, including key terminology and the roles of different court participants.',
        'https://example.com/audio/legal-prep-ep1.mp3',
        22,
        true
      ),
      (
        legal_prep_id,
        2,
        'Preparing Your Documentation',
        'What documents you need and how to organize them effectively for your legal team and court proceedings.',
        'https://example.com/audio/legal-prep-ep2.mp3',
        28,
        true
      ),
      (
        legal_prep_id,
        3,
        'Working with Your Attorney',
        'How to communicate effectively with your legal counsel and make the most of your attorney-client relationship.',
        'https://example.com/audio/legal-prep-ep3.mp3',
        25,
        true
      ),
      (
        legal_prep_id,
        4,
        'Courtroom Etiquette 101',
        'Essential dos and don''ts for courtroom behavior, from dress code to proper addressing of the judge.',
        'https://example.com/audio/legal-prep-ep4.mp3',
        20,
        true
      )
    ON CONFLICT DO NOTHING;
  END IF;

  -- Insert episodes for Mental Wellness
  IF mental_wellness_id IS NOT NULL THEN
    INSERT INTO podcast_episodes (podcast_id, episode_number, title, description, audio_url, duration_minutes, is_published)
    VALUES 
      (
        mental_wellness_id,
        1,
        'Managing Litigation Stress',
        'Practical techniques for handling the emotional toll of legal proceedings and maintaining your mental health.',
        'https://example.com/audio/mental-wellness-ep1.mp3',
        30,
        true
      ),
      (
        mental_wellness_id,
        2,
        'Sleep and Self-Care During Court Cases',
        'Why rest is crucial during litigation and strategies for maintaining healthy sleep patterns despite stress.',
        'https://example.com/audio/mental-wellness-ep2.mp3',
        26,
        true
      ),
      (
        mental_wellness_id,
        3,
        'Building Your Support System',
        'How to lean on family and friends effectively while protecting your case confidentiality.',
        'https://example.com/audio/mental-wellness-ep3.mp3',
        24,
        true
      )
    ON CONFLICT DO NOTHING;
  END IF;

  -- Insert episodes for Business Strategy
  IF business_strategy_id IS NOT NULL THEN
    INSERT INTO podcast_episodes (podcast_id, episode_number, title, description, audio_url, duration_minutes, is_published)
    VALUES 
      (
        business_strategy_id,
        1,
        'Maintaining Business Operations During Litigation',
        'Strategies for keeping your business running smoothly while managing legal challenges.',
        'https://example.com/audio/business-strategy-ep1.mp3',
        32,
        true
      ),
      (
        business_strategy_id,
        2,
        'Financial Planning for Legal Costs',
        'How to budget for legal expenses and manage cash flow during extended litigation.',
        'https://example.com/audio/business-strategy-ep2.mp3',
        28,
        true
      ),
      (
        business_strategy_id,
        3,
        'Communicating with Stakeholders',
        'Best practices for informing employees, investors, and partners about ongoing legal matters.',
        'https://example.com/audio/business-strategy-ep3.mp3',
        25,
        true
      )
    ON CONFLICT DO NOTHING;
  END IF;

  -- Insert episodes for Courtroom Stories
  IF courtroom_stories_id IS NOT NULL THEN
    INSERT INTO podcast_episodes (podcast_id, episode_number, title, description, audio_url, duration_minutes, is_published)
    VALUES 
      (
        courtroom_stories_id,
        1,
        'From Uncertainty to Victory: Maria''s Journey',
        'Maria shares her experience navigating a complex civil litigation case and how preparation made all the difference.',
        'https://example.com/audio/courtroom-stories-ep1.mp3',
        35,
        true
      ),
      (
        courtroom_stories_id,
        2,
        'Overcoming Fear: David''s First Court Appearance',
        'David discusses how he conquered his anxiety and successfully represented himself with proper preparation.',
        'https://example.com/audio/courtroom-stories-ep2.mp3',
        29,
        true
      ),
      (
        courtroom_stories_id,
        3,
        'The Power of Preparation: Lisa''s Experience',
        'Lisa explains how the preparation courses helped her feel confident and ready for her day in court.',
        'https://example.com/audio/courtroom-stories-ep3.mp3',
        31,
        true
      )
    ON CONFLICT DO NOTHING;
  END IF;
END $$;
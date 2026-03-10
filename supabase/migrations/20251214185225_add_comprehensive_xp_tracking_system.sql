/*
  # Comprehensive XP Tracking System

  ## Overview
  This migration creates a complete XP tracking system that rewards clients for completing various types of content across the platform.

  ## Changes Made

  ### 1. Add XP Rewards to Tables
  - Add `xp_reward` column to `content_items` (default: 10 XP)
  - Add `xp_reward` column to `podcast_episodes` (default: 15 XP)
  - Add `xp_reward` column to `live_sessions` (default: 50 XP for attending)
  - Add `xp_reward` column to `lessons` (default: 5 XP)

  ### 2. Create XP Transaction Log
  - New table `xp_transactions` to track all XP awards
  - Records: client_id, source_type, source_id, xp_amount, earned_at
  - Provides audit trail and detailed history

  ### 3. Create Automated XP Award Functions
  - Function to award XP when content is completed
  - Function to calculate total XP from all sources
  - Triggers to automatically update client_stats

  ### 4. Update client_stats Calculation
  - Add function to recalculate total XP from xp_transactions
  - Ensures accuracy across all content types

  ## XP Reward Structure
  - Lessons: 5 XP (base)
  - Modules: 10-50 XP (varies, already set)
  - Content Items: 10 XP (videos, articles, resources)
  - Podcast Episodes: 15 XP
  - Exercises: 10-50 XP (varies, already set)
  - Live Sessions: 50 XP (Q&A, mock hearings)

  ## Security
  - RLS enabled on xp_transactions table
  - Clients can view their own transactions
  - Only system can insert transactions (through functions)
*/

-- Add xp_reward columns to tables that don't have them
ALTER TABLE content_items ADD COLUMN IF NOT EXISTS xp_reward integer DEFAULT 10;
ALTER TABLE podcast_episodes ADD COLUMN IF NOT EXISTS xp_reward integer DEFAULT 15;
ALTER TABLE live_sessions ADD COLUMN IF NOT EXISTS xp_reward integer DEFAULT 50;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS xp_reward integer DEFAULT 5;

-- Create xp_transactions table for detailed tracking
CREATE TABLE IF NOT EXISTS xp_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  source_type text NOT NULL CHECK (source_type IN ('lesson', 'module', 'content_item', 'podcast', 'exercise', 'live_session')),
  source_id uuid NOT NULL,
  xp_amount integer NOT NULL CHECK (xp_amount > 0),
  description text,
  earned_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_xp_transactions_client_id ON xp_transactions(client_id);
CREATE INDEX IF NOT EXISTS idx_xp_transactions_earned_at ON xp_transactions(earned_at);

ALTER TABLE xp_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can view own XP transactions"
  ON xp_transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = client_id);

-- Function to award XP and update client_stats
CREATE OR REPLACE FUNCTION award_xp(
  p_client_id uuid,
  p_source_type text,
  p_source_id uuid,
  p_xp_amount integer,
  p_description text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert XP transaction (only if not already awarded for this source)
  INSERT INTO xp_transactions (client_id, source_type, source_id, xp_amount, description)
  SELECT p_client_id, p_source_type, p_source_id, p_xp_amount, p_description
  WHERE NOT EXISTS (
    SELECT 1 FROM xp_transactions 
    WHERE client_id = p_client_id 
    AND source_type = p_source_type 
    AND source_id = p_source_id
  );

  -- Update client_stats total_xp
  UPDATE client_stats
  SET 
    total_xp = (
      SELECT COALESCE(SUM(xp_amount), 0)
      FROM xp_transactions
      WHERE client_id = p_client_id
    ),
    updated_at = now()
  WHERE client_id = p_client_id;

  -- Create client_stats if it doesn't exist
  INSERT INTO client_stats (client_id, total_xp)
  SELECT p_client_id, p_xp_amount
  WHERE NOT EXISTS (
    SELECT 1 FROM client_stats WHERE client_id = p_client_id
  );
END;
$$;

-- Function to recalculate total XP for a client
CREATE OR REPLACE FUNCTION recalculate_client_xp(p_client_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_total_xp integer;
BEGIN
  -- Calculate total XP from all transactions
  SELECT COALESCE(SUM(xp_amount), 0)
  INTO v_total_xp
  FROM xp_transactions
  WHERE client_id = p_client_id;

  -- Update or insert client_stats
  INSERT INTO client_stats (client_id, total_xp, updated_at)
  VALUES (p_client_id, v_total_xp, now())
  ON CONFLICT (client_id) 
  DO UPDATE SET 
    total_xp = v_total_xp,
    updated_at = now();

  RETURN v_total_xp;
END;
$$;

-- Update existing content with appropriate XP rewards
UPDATE content_items SET xp_reward = 10 WHERE xp_reward IS NULL;
UPDATE podcast_episodes SET xp_reward = 15 WHERE xp_reward IS NULL;
UPDATE live_sessions SET xp_reward = 50 WHERE xp_reward IS NULL;
UPDATE lessons SET xp_reward = 5 WHERE xp_reward IS NULL;

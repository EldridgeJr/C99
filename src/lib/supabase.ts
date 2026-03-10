import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  full_name: string;
  avatar_url: string | null;
  user_type: 'client' | 'admin';
  created_at: string;
  updated_at: string;
};

export type Course = {
  id: string;
  title: string;
  description: string;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  estimated_hours: number;
  is_free: boolean;
  certificate_enabled: boolean;
  created_at: string;
  updated_at: string;
};

export type Module = {
  id: string;
  course_id: string;
  title: string;
  description: string;
  order_index: number;
  xp_reward: number;
  created_at: string;
};

export type UserProgress = {
  id: string;
  user_id: string;
  course_id: string;
  module_id: string | null;
  lesson_id: string | null;
  progress_percentage: number;
  completed: boolean;
  last_accessed: string;
  created_at: string;
};

export type UserXP = {
  id: string;
  user_id: string;
  category: string;
  total_xp: number;
  updated_at: string;
};

export type WeeklyGoal = {
  id: string;
  user_id: string;
  target_xp: number;
  current_xp: number;
  week_start: string;
  created_at: string;
};

export type LiveSession = {
  id: string;
  title: string;
  description: string;
  session_type: 'testimony' | 'court_procedures' | 'evidence' | 'cross_examination';
  scheduled_at: string;
  duration_minutes: number;
  max_participants: number;
  created_at: string;
};
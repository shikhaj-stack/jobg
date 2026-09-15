-- =========================================================================
<<<<<<< HEAD
-- J O B G — COMPLETE PRODUCTION RELATIONAL DATABASE SCHEMA (PostgreSQL / Supabase)
=======
-- JOBG PLATFORM DATABASE SCHEMA (Supabase PostgreSQL)
-- Phase 1: Production-Ready Normalized Architecture & RLS
>>>>>>> origin/main
-- =========================================================================

-- Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

<<<<<<< HEAD
-- 1. Users Table (Core Identity)
=======
-- =========================================================================
-- HELPER FUNCTIONS FOR AUTH & AUDIT
-- =========================================================================

-- Extracts the current user's Firebase UID or Supabase Auth ID from request context
CREATE OR REPLACE FUNCTION public.current_user_uid()
RETURNS TEXT AS $$
BEGIN
  RETURN COALESCE(
    auth.jwt() ->> 'sub',
    auth.jwt() ->> 'user_id',
    current_setting('request.jwt.claims', true)::json->>'sub',
    ''
  );
END;
$$ LANGUAGE plpgsql STABLE;

-- Ownership validator (allows matching owner or service_role administrative bypass)
CREATE OR REPLACE FUNCTION public.is_owner(owner_uid TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    owner_uid = public.current_user_uid()
    OR auth.role() = 'service_role'
  );
END;
$$ LANGUAGE plpgsql STABLE;

-- Trigger function for automated updated_at timestamp maintenance
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =========================================================================
-- 1. USERS (Core Account Entity)
-- =========================================================================
>>>>>>> origin/main
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firebase_uid TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  photo_url TEXT,
<<<<<<< HEAD
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. User Profiles Table (Candidate Profile & Preferences)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firebase_uid TEXT UNIQUE NOT NULL REFERENCES public.users(firebase_uid) ON DELETE CASCADE,
  display_name TEXT,
  target_role TEXT DEFAULT 'maang',     -- 'maang', 'webdev', 'web3'
  target_company TEXT DEFAULT 'Google (L5 Core Systems)',
  experience_level TEXT DEFAULT 'Mid-Level / Senior (3-6 YOE)',
  sprint_start_date TIMESTAMPTZ DEFAULT now(),
  sprint_duration_days INT DEFAULT 60,
  preferred_ide TEXT DEFAULT 'VS Code / Neovim',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Curriculum Tracks
CREATE TABLE IF NOT EXISTS public.curriculum_tracks (
  id TEXT PRIMARY KEY,                  -- 'maang', 'webdev', 'web3'
  name TEXT NOT NULL,
  tagline TEXT,
  badge TEXT,
  accent_color TEXT DEFAULT 'amber',
  total_modules INT DEFAULT 16,
  estimated_weeks INT DEFAULT 12,
  salary_range TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Curriculum Modules
CREATE TABLE IF NOT EXISTS public.curriculum_modules (
  id TEXT PRIMARY KEY,                  -- 'm-dsa-1', 'm-sys-1', etc.
  track_id TEXT NOT NULL REFERENCES public.curriculum_tracks(id) ON DELETE CASCADE,
  pillar_id TEXT NOT NULL,
  pillar_title TEXT NOT NULL,
  title TEXT NOT NULL,
  difficulty TEXT DEFAULT 'Medium',     -- 'Easy', 'Medium', 'Hard'
  est_hours INT DEFAULT 5,
  problems_count INT DEFAULT 10,
  summary TEXT,
  topics TEXT[] DEFAULT '{}',
  video_id TEXT,
  resources JSONB DEFAULT '[]',
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. User Progress (Module-level completion & analytics)
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firebase_uid TEXT NOT NULL REFERENCES public.users(firebase_uid) ON DELETE CASCADE,
  module_id TEXT NOT NULL,
  track TEXT NOT NULL,                  -- 'maang', 'webdev', 'web3'
  pillar TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  started_at TIMESTAMPTZ DEFAULT now(),
=======
  target_role TEXT DEFAULT 'maang',
  target_company TEXT DEFAULT 'Google, Meta, Apple',
  sprint_start_date TIMESTAMPTZ DEFAULT now(),
  sprint_duration_days INT DEFAULT 60,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =========================================================================
-- 2. USER PROFILES (Detailed Candidate Preferences & Settings)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  firebase_uid TEXT NOT NULL REFERENCES public.users(firebase_uid) ON DELETE CASCADE,
  display_name TEXT,
  photo_url TEXT,
  bio TEXT,
  github_handle TEXT,
  linkedin_url TEXT,
  target_role TEXT NOT NULL DEFAULT 'maang' CHECK (target_role IN ('maang', 'webdev', 'web3')),
  target_company TEXT DEFAULT 'Google, Meta, Apple',
  target_level TEXT DEFAULT 'L5 / Senior',
  sprint_start_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  sprint_duration_days INT NOT NULL DEFAULT 60 CHECK (sprint_duration_days > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_user_profiles_user_id UNIQUE(user_id),
  CONSTRAINT uq_user_profiles_firebase_uid UNIQUE(firebase_uid)
);

-- =========================================================================
-- 3. CURRICULUM TRACKS (Public Reference Data)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.curriculum_tracks (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tagline TEXT,
  badge TEXT,
  accent_color TEXT DEFAULT 'amber',
  estimated_weeks INT DEFAULT 12,
  salary_range TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =========================================================================
-- 4. CURRICULUM MODULES (Public Structured Learning Units)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.curriculum_modules (
  id TEXT PRIMARY KEY,
  track_id TEXT NOT NULL REFERENCES public.curriculum_tracks(id) ON DELETE CASCADE,
  pillar_id TEXT NOT NULL,
  pillar_title TEXT NOT NULL,
  pillar_number TEXT,
  title TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Beginner', 'Medium', 'Hard', 'Expert')),
  est_hours NUMERIC(4,1) DEFAULT 4.0,
  problems_count INT DEFAULT 0,
  summary TEXT NOT NULL DEFAULT '',
  topics JSONB NOT NULL DEFAULT '[]'::jsonb,
  resources JSONB NOT NULL DEFAULT '[]'::jsonb,
  video_id TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =========================================================================
-- 5. USER PROGRESS (Module Mastery State)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  firebase_uid TEXT NOT NULL REFERENCES public.users(firebase_uid) ON DELETE CASCADE,
  module_id TEXT NOT NULL REFERENCES public.curriculum_modules(id) ON DELETE CASCADE,
  track_id TEXT NOT NULL REFERENCES public.curriculum_tracks(id) ON DELETE CASCADE,
  pillar TEXT NOT NULL DEFAULT 'general',
  is_completed BOOLEAN NOT NULL DEFAULT false,
>>>>>>> origin/main
  completed_at TIMESTAMPTZ,
  time_spent_seconds INT DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_user_progress_module UNIQUE(firebase_uid, module_id)
);

<<<<<<< HEAD
-- 6. User Daily Streaks (Activity Logging)
CREATE TABLE IF NOT EXISTS public.user_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firebase_uid TEXT NOT NULL REFERENCES public.users(firebase_uid) ON DELETE CASCADE,
  activity_date DATE NOT NULL,
  activity_type TEXT DEFAULT 'module_completion', -- 'module_completion', 'note_synthesis', 'task_completion'
  activity_count INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(firebase_uid, activity_date)
);

-- 7. User Tasks (Sprint Checklist)
CREATE TABLE IF NOT EXISTS public.user_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firebase_uid TEXT NOT NULL REFERENCES public.users(firebase_uid) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT DEFAULT 'Prep',         -- 'DSA', 'System Design', 'Behavioral', 'Web3', 'General'
  completed BOOLEAN DEFAULT false,
  due_date TIMESTAMPTZ,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 8. User Notes (Active Recall Synthesizer)
CREATE TABLE IF NOT EXISTS public.user_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firebase_uid TEXT NOT NULL REFERENCES public.users(firebase_uid) ON DELETE CASCADE,
  session_id TEXT NOT NULL,             -- Stream ID or Module ID
  session_title TEXT,
  content TEXT NOT NULL DEFAULT '',
  word_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(firebase_uid, session_id)
);

-- 9. Saved Active Recall Items
CREATE TABLE IF NOT EXISTS public.saved_recall_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firebase_uid TEXT NOT NULL REFERENCES public.users(firebase_uid) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  response TEXT NOT NULL,
  category TEXT DEFAULT 'Algorithm Patterns',
  ease_factor NUMERIC(3,2) DEFAULT 2.5,
  interval_days INT DEFAULT 1,
  next_review_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 10. User Settings
CREATE TABLE IF NOT EXISTS public.user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firebase_uid TEXT UNIQUE NOT NULL REFERENCES public.users(firebase_uid) ON DELETE CASCADE,
  email_notifications BOOLEAN DEFAULT true,
  daily_reminder_hour INT DEFAULT 9,
  dark_mode BOOLEAN DEFAULT false,
  sound_effects BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 11. ATS Analysis History
CREATE TABLE IF NOT EXISTS public.ats_analysis_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firebase_uid TEXT NOT NULL REFERENCES public.users(firebase_uid) ON DELETE CASCADE,
  job_title TEXT NOT NULL,
  target_company TEXT,
  match_percentage INT NOT NULL,
  matched_keywords TEXT[] DEFAULT '{}',
  missing_keywords TEXT[] DEFAULT '{}',
  recommendations TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 12. AI Conversations
CREATE TABLE IF NOT EXISTS public.ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firebase_uid TEXT NOT NULL REFERENCES public.users(firebase_uid) ON DELETE CASCADE,
  title TEXT DEFAULT 'Career & Technical Guidance',
  mode TEXT DEFAULT 'interview',        -- 'interview', 'resume', 'architecture', 'behavioral'
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 13. AI Messages
CREATE TABLE IF NOT EXISTS public.ai_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
  firebase_uid TEXT NOT NULL REFERENCES public.users(firebase_uid) ON DELETE CASCADE,
  role TEXT NOT NULL,                   -- 'user', 'assistant', 'system'
  content TEXT NOT NULL,
  model_used TEXT DEFAULT 'litellm/claude-3-5-sonnet',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =========================================================================
-- DATABASE INDEXES (Performance & Scalability)
-- =========================================================================
CREATE INDEX IF NOT EXISTS idx_users_firebase_uid ON public.users(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_user_profiles_uid ON public.user_profiles(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_curriculum_modules_track ON public.curriculum_modules(track_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_uid_track ON public.user_progress(firebase_uid, track);
CREATE INDEX IF NOT EXISTS idx_user_progress_completed ON public.user_progress(firebase_uid, is_completed);
CREATE INDEX IF NOT EXISTS idx_user_streaks_uid_date ON public.user_streaks(firebase_uid, activity_date DESC);
CREATE INDEX IF NOT EXISTS idx_user_tasks_uid ON public.user_tasks(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_user_notes_uid ON public.user_notes(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_ats_history_uid ON public.ats_analysis_history(firebase_uid, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_messages_conv ON public.ai_messages(conversation_id, created_at ASC);
=======
-- =========================================================================
-- 6. USER STREAKS (Daily Study Momentum Log)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.user_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  firebase_uid TEXT NOT NULL REFERENCES public.users(firebase_uid) ON DELETE CASCADE,
  activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
  activity_count INT NOT NULL DEFAULT 1 CHECK (activity_count >= 1),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_user_streaks_activity_date UNIQUE(firebase_uid, activity_date)
);

-- =========================================================================
-- 7. USER TASKS (Sprint Preparation Action Items)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.user_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  firebase_uid TEXT NOT NULL REFERENCES public.users(firebase_uid) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Prep' CHECK (category IN ('DSA', 'System Design', 'Behavioral', 'Web3', 'Prep', 'General')),
  completed BOOLEAN NOT NULL DEFAULT false,
  due_date TIMESTAMPTZ,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =========================================================================
-- 8. USER NOTES (Active Recall Synthesized Markdown Notes)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.user_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  firebase_uid TEXT NOT NULL REFERENCES public.users(firebase_uid) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  session_title TEXT,
  content TEXT NOT NULL DEFAULT '',
  word_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_user_notes_session UNIQUE(firebase_uid, session_id)
);

-- =========================================================================
-- 9. SAVED RECALL ITEMS (Architectural Tradeoffs & Cheatsheets)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.saved_recall_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  firebase_uid TEXT NOT NULL REFERENCES public.users(firebase_uid) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('algorithm', 'architecture_pattern', 'tradeoff', 'cheat_sheet', 'interview_question')),
  title TEXT NOT NULL,
  key_concept TEXT NOT NULL,
  code_snippet TEXT,
  complexity_time TEXT,
  complexity_space TEXT,
  source_module_id TEXT REFERENCES public.curriculum_modules(id) ON DELETE SET NULL,
  source_session_id TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  last_reviewed_at TIMESTAMPTZ,
  next_review_at TIMESTAMPTZ,
  repetition_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =========================================================================
-- 10. USER SETTINGS (UI Preferences & Audio/Theme Configuration)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  firebase_uid TEXT NOT NULL REFERENCES public.users(firebase_uid) ON DELETE CASCADE,
  theme TEXT NOT NULL DEFAULT 'classic-warm' CHECK (theme IN ('classic-warm', 'light', 'dark', 'system')),
  email_notifications BOOLEAN NOT NULL DEFAULT true,
  daily_reminder_time TIME DEFAULT '09:00:00',
  audio_effects_enabled BOOLEAN NOT NULL DEFAULT true,
  compact_view BOOLEAN NOT NULL DEFAULT false,
  preferred_editor_mode TEXT NOT NULL DEFAULT 'markdown' CHECK (preferred_editor_mode IN ('markdown', 'plain')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_user_settings_firebase_uid UNIQUE(firebase_uid)
);

-- =========================================================================
-- 11. ATS ANALYSIS HISTORY (Resume Scoring & Keyword Screening)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.ats_analysis_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  firebase_uid TEXT NOT NULL REFERENCES public.users(firebase_uid) ON DELETE CASCADE,
  target_role TEXT NOT NULL,
  target_company TEXT,
  ats_score INT NOT NULL CHECK (ats_score >= 0 AND ats_score <= 100),
  readiness_tier TEXT NOT NULL,
  keyword_density_score INT CHECK (keyword_density_score >= 0 AND keyword_density_score <= 100),
  impact_quantification_score INT CHECK (impact_quantification_score >= 0 AND impact_quantification_score <= 100),
  matched_keywords TEXT[] NOT NULL DEFAULT '{}',
  missing_keywords TEXT[] NOT NULL DEFAULT '{}',
  strengths JSONB NOT NULL DEFAULT '[]'::jsonb,
  critical_suggestions JSONB NOT NULL DEFAULT '[]'::jsonb,
  raw_resume_snippet TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =========================================================================
-- 12. AI CONVERSATIONS (Mock Interview & Coaching Sessions)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  firebase_uid TEXT NOT NULL REFERENCES public.users(firebase_uid) ON DELETE CASCADE,
  conversation_type TEXT NOT NULL CHECK (conversation_type IN ('mock_interview', 'system_design_coach', 'resume_review', 'code_explainer', 'general_guidance')),
  title TEXT NOT NULL DEFAULT 'New Chamber Session',
  target_track_id TEXT REFERENCES public.curriculum_tracks(id) ON DELETE SET NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_archived BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =========================================================================
-- 13. AI MESSAGES (Individual Prompt & Response Log)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.ai_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  firebase_uid TEXT NOT NULL REFERENCES public.users(firebase_uid) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('system', 'user', 'assistant', 'function')),
  content TEXT NOT NULL,
  model_used TEXT,
  prompt_tokens INT,
  completion_tokens INT,
  feedback_rating INT CHECK (feedback_rating IN (1, -1)),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =========================================================================
-- AUTOMATED UPDATED_AT TRIGGERS
-- =========================================================================
DROP TRIGGER IF EXISTS tr_users_updated_at ON public.users;
CREATE TRIGGER tr_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER tr_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_curriculum_tracks_updated_at ON public.curriculum_tracks;
CREATE TRIGGER tr_curriculum_tracks_updated_at BEFORE UPDATE ON public.curriculum_tracks FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_curriculum_modules_updated_at ON public.curriculum_modules;
CREATE TRIGGER tr_curriculum_modules_updated_at BEFORE UPDATE ON public.curriculum_modules FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_user_progress_updated_at ON public.user_progress;
CREATE TRIGGER tr_user_progress_updated_at BEFORE UPDATE ON public.user_progress FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_user_tasks_updated_at ON public.user_tasks;
CREATE TRIGGER tr_user_tasks_updated_at BEFORE UPDATE ON public.user_tasks FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_user_notes_updated_at ON public.user_notes;
CREATE TRIGGER tr_user_notes_updated_at BEFORE UPDATE ON public.user_notes FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_saved_recall_items_updated_at ON public.saved_recall_items;
CREATE TRIGGER tr_saved_recall_items_updated_at BEFORE UPDATE ON public.saved_recall_items FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_user_settings_updated_at ON public.user_settings;
CREATE TRIGGER tr_user_settings_updated_at BEFORE UPDATE ON public.user_settings FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_ai_conversations_updated_at ON public.ai_conversations;
CREATE TRIGGER tr_ai_conversations_updated_at BEFORE UPDATE ON public.ai_conversations FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =========================================================================
-- OPTIMIZED INDEXES
-- =========================================================================
-- Users
CREATE INDEX IF NOT EXISTS idx_users_firebase_uid ON public.users(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users(created_at);

-- User Profiles
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_firebase_uid ON public.user_profiles(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_user_profiles_target_role ON public.user_profiles(target_role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_updated_at ON public.user_profiles(updated_at);

-- Curriculum
CREATE INDEX IF NOT EXISTS idx_curriculum_tracks_slug ON public.curriculum_tracks(slug);
CREATE INDEX IF NOT EXISTS idx_curriculum_tracks_sort ON public.curriculum_tracks(sort_order);
CREATE INDEX IF NOT EXISTS idx_curriculum_modules_track_id ON public.curriculum_modules(track_id);
CREATE INDEX IF NOT EXISTS idx_curriculum_modules_pillar_id ON public.curriculum_modules(pillar_id);
CREATE INDEX IF NOT EXISTS idx_curriculum_modules_sort ON public.curriculum_modules(sort_order);

-- User Progress
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_firebase_uid ON public.user_progress(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_user_progress_track_id ON public.user_progress(track_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_module_id ON public.user_progress(module_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_is_completed ON public.user_progress(is_completed);
CREATE INDEX IF NOT EXISTS idx_user_progress_created_at ON public.user_progress(created_at);
CREATE INDEX IF NOT EXISTS idx_user_progress_updated_at ON public.user_progress(updated_at);

-- User Streaks
CREATE INDEX IF NOT EXISTS idx_user_streaks_user_id ON public.user_streaks(user_id);
CREATE INDEX IF NOT EXISTS idx_user_streaks_firebase_uid ON public.user_streaks(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_user_streaks_activity_date ON public.user_streaks(activity_date DESC);

-- User Tasks
CREATE INDEX IF NOT EXISTS idx_user_tasks_user_id ON public.user_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_user_tasks_firebase_uid ON public.user_tasks(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_user_tasks_completed ON public.user_tasks(completed);
CREATE INDEX IF NOT EXISTS idx_user_tasks_created_at ON public.user_tasks(created_at);
CREATE INDEX IF NOT EXISTS idx_user_tasks_updated_at ON public.user_tasks(updated_at);

-- User Notes
CREATE INDEX IF NOT EXISTS idx_user_notes_user_id ON public.user_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_notes_firebase_uid ON public.user_notes(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_user_notes_session_id ON public.user_notes(session_id);
CREATE INDEX IF NOT EXISTS idx_user_notes_created_at ON public.user_notes(created_at);
CREATE INDEX IF NOT EXISTS idx_user_notes_updated_at ON public.user_notes(updated_at);

-- Saved Recall Items
CREATE INDEX IF NOT EXISTS idx_saved_recall_user_id ON public.saved_recall_items(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_recall_firebase_uid ON public.saved_recall_items(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_saved_recall_item_type ON public.saved_recall_items(item_type);
CREATE INDEX IF NOT EXISTS idx_saved_recall_next_review ON public.saved_recall_items(next_review_at);

-- User Settings
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON public.user_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_user_settings_firebase_uid ON public.user_settings(firebase_uid);

-- ATS Analysis History
CREATE INDEX IF NOT EXISTS idx_ats_history_user_id ON public.ats_analysis_history(user_id);
CREATE INDEX IF NOT EXISTS idx_ats_history_firebase_uid ON public.ats_analysis_history(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_ats_history_created_at ON public.ats_analysis_history(created_at DESC);

-- AI Conversations & Messages
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user_id ON public.ai_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_firebase_uid ON public.ai_conversations(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_track_id ON public.ai_conversations(target_track_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_created_at ON public.ai_conversations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_updated_at ON public.ai_conversations(updated_at);

CREATE INDEX IF NOT EXISTS idx_ai_messages_conversation_id ON public.ai_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_ai_messages_user_id ON public.ai_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_messages_firebase_uid ON public.ai_messages(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_ai_messages_created_at ON public.ai_messages(created_at);
>>>>>>> origin/main

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================
<<<<<<< HEAD
=======

-- Enable RLS across all 13 tables
>>>>>>> origin/main
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.curriculum_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.curriculum_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_recall_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ats_analysis_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;

<<<<<<< HEAD
-- Curriculum catalog is publicly readable by all authenticated / anonymous users
CREATE POLICY "Curriculum tracks are publicly readable" ON public.curriculum_tracks FOR SELECT USING (true);
CREATE POLICY "Curriculum modules are publicly readable" ON public.curriculum_modules FOR SELECT USING (true);

-- User-owned tables strict RLS (User A cannot access User B data)
CREATE POLICY "Users can view own record" ON public.users FOR SELECT USING (auth.jwt() ->> 'sub' = firebase_uid OR auth.uid()::text = firebase_uid);
CREATE POLICY "Users can update own record" ON public.users FOR UPDATE USING (auth.jwt() ->> 'sub' = firebase_uid OR auth.uid()::text = firebase_uid);
CREATE POLICY "Users can insert own record" ON public.users FOR INSERT WITH CHECK (auth.jwt() ->> 'sub' = firebase_uid OR auth.uid()::text = firebase_uid);

CREATE POLICY "Users can manage own profile" ON public.user_profiles FOR ALL USING (auth.jwt() ->> 'sub' = firebase_uid OR auth.uid()::text = firebase_uid) WITH CHECK (auth.jwt() ->> 'sub' = firebase_uid OR auth.uid()::text = firebase_uid);

CREATE POLICY "Users can manage own progress" ON public.user_progress FOR ALL USING (auth.jwt() ->> 'sub' = firebase_uid OR auth.uid()::text = firebase_uid) WITH CHECK (auth.jwt() ->> 'sub' = firebase_uid OR auth.uid()::text = firebase_uid);

CREATE POLICY "Users can manage own streaks" ON public.user_streaks FOR ALL USING (auth.jwt() ->> 'sub' = firebase_uid OR auth.uid()::text = firebase_uid) WITH CHECK (auth.jwt() ->> 'sub' = firebase_uid OR auth.uid()::text = firebase_uid);

CREATE POLICY "Users can manage own tasks" ON public.user_tasks FOR ALL USING (auth.jwt() ->> 'sub' = firebase_uid OR auth.uid()::text = firebase_uid) WITH CHECK (auth.jwt() ->> 'sub' = firebase_uid OR auth.uid()::text = firebase_uid);

CREATE POLICY "Users can manage own notes" ON public.user_notes FOR ALL USING (auth.jwt() ->> 'sub' = firebase_uid OR auth.uid()::text = firebase_uid) WITH CHECK (auth.jwt() ->> 'sub' = firebase_uid OR auth.uid()::text = firebase_uid);

CREATE POLICY "Users can manage recall items" ON public.saved_recall_items FOR ALL USING (auth.jwt() ->> 'sub' = firebase_uid OR auth.uid()::text = firebase_uid) WITH CHECK (auth.jwt() ->> 'sub' = firebase_uid OR auth.uid()::text = firebase_uid);

CREATE POLICY "Users can manage settings" ON public.user_settings FOR ALL USING (auth.jwt() ->> 'sub' = firebase_uid OR auth.uid()::text = firebase_uid) WITH CHECK (auth.jwt() ->> 'sub' = firebase_uid OR auth.uid()::text = firebase_uid);

CREATE POLICY "Users can manage ATS history" ON public.ats_analysis_history FOR ALL USING (auth.jwt() ->> 'sub' = firebase_uid OR auth.uid()::text = firebase_uid) WITH CHECK (auth.jwt() ->> 'sub' = firebase_uid OR auth.uid()::text = firebase_uid);

CREATE POLICY "Users can manage AI conversations" ON public.ai_conversations FOR ALL USING (auth.jwt() ->> 'sub' = firebase_uid OR auth.uid()::text = firebase_uid) WITH CHECK (auth.jwt() ->> 'sub' = firebase_uid OR auth.uid()::text = firebase_uid);

CREATE POLICY "Users can manage AI messages" ON public.ai_messages FOR ALL USING (auth.jwt() ->> 'sub' = firebase_uid OR auth.uid()::text = firebase_uid) WITH CHECK (auth.jwt() ->> 'sub' = firebase_uid OR auth.uid()::text = firebase_uid);
=======
-- -------------------------------------------------------------------------
-- Public Reference Tables: Curriculum Tracks & Modules (Public Read, Admin Write)
-- -------------------------------------------------------------------------
CREATE POLICY "Public can view active curriculum tracks"
  ON public.curriculum_tracks FOR SELECT
  USING (is_active = true OR auth.role() = 'service_role');

CREATE POLICY "Only service_role can manage curriculum tracks"
  ON public.curriculum_tracks FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Public can view curriculum modules"
  ON public.curriculum_modules FOR SELECT
  USING (true);

CREATE POLICY "Only service_role can manage curriculum modules"
  ON public.curriculum_modules FOR ALL
  USING (auth.role() = 'service_role');

-- -------------------------------------------------------------------------
-- User Entity: Users Table
-- -------------------------------------------------------------------------
CREATE POLICY "Users can select own record"
  ON public.users FOR SELECT
  USING (public.is_owner(firebase_uid));

CREATE POLICY "Users can insert own record"
  ON public.users FOR INSERT
  WITH CHECK (public.is_owner(firebase_uid));

CREATE POLICY "Users can update own record"
  ON public.users FOR UPDATE
  USING (public.is_owner(firebase_uid))
  WITH CHECK (public.is_owner(firebase_uid));

CREATE POLICY "Users can delete own record"
  ON public.users FOR DELETE
  USING (public.is_owner(firebase_uid));

-- -------------------------------------------------------------------------
-- User Profiles
-- -------------------------------------------------------------------------
CREATE POLICY "Users can select own profile"
  ON public.user_profiles FOR SELECT
  USING (public.is_owner(firebase_uid));

CREATE POLICY "Users can insert own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (public.is_owner(firebase_uid));

CREATE POLICY "Users can update own profile"
  ON public.user_profiles FOR UPDATE
  USING (public.is_owner(firebase_uid))
  WITH CHECK (public.is_owner(firebase_uid));

CREATE POLICY "Users can delete own profile"
  ON public.user_profiles FOR DELETE
  USING (public.is_owner(firebase_uid));

-- -------------------------------------------------------------------------
-- User Progress
-- -------------------------------------------------------------------------
CREATE POLICY "Users can select own progress"
  ON public.user_progress FOR SELECT
  USING (public.is_owner(firebase_uid));

CREATE POLICY "Users can insert own progress"
  ON public.user_progress FOR INSERT
  WITH CHECK (public.is_owner(firebase_uid));

CREATE POLICY "Users can update own progress"
  ON public.user_progress FOR UPDATE
  USING (public.is_owner(firebase_uid))
  WITH CHECK (public.is_owner(firebase_uid));

CREATE POLICY "Users can delete own progress"
  ON public.user_progress FOR DELETE
  USING (public.is_owner(firebase_uid));

-- -------------------------------------------------------------------------
-- User Streaks
-- -------------------------------------------------------------------------
CREATE POLICY "Users can select own streaks"
  ON public.user_streaks FOR SELECT
  USING (public.is_owner(firebase_uid));

CREATE POLICY "Users can insert own streaks"
  ON public.user_streaks FOR INSERT
  WITH CHECK (public.is_owner(firebase_uid));

CREATE POLICY "Users can update own streaks"
  ON public.user_streaks FOR UPDATE
  USING (public.is_owner(firebase_uid))
  WITH CHECK (public.is_owner(firebase_uid));

CREATE POLICY "Users can delete own streaks"
  ON public.user_streaks FOR DELETE
  USING (public.is_owner(firebase_uid));

-- -------------------------------------------------------------------------
-- User Tasks
-- -------------------------------------------------------------------------
CREATE POLICY "Users can select own tasks"
  ON public.user_tasks FOR SELECT
  USING (public.is_owner(firebase_uid));

CREATE POLICY "Users can insert own tasks"
  ON public.user_tasks FOR INSERT
  WITH CHECK (public.is_owner(firebase_uid));

CREATE POLICY "Users can update own tasks"
  ON public.user_tasks FOR UPDATE
  USING (public.is_owner(firebase_uid))
  WITH CHECK (public.is_owner(firebase_uid));

CREATE POLICY "Users can delete own tasks"
  ON public.user_tasks FOR DELETE
  USING (public.is_owner(firebase_uid));

-- -------------------------------------------------------------------------
-- User Notes
-- -------------------------------------------------------------------------
CREATE POLICY "Users can select own notes"
  ON public.user_notes FOR SELECT
  USING (public.is_owner(firebase_uid));

CREATE POLICY "Users can insert own notes"
  ON public.user_notes FOR INSERT
  WITH CHECK (public.is_owner(firebase_uid));

CREATE POLICY "Users can update own notes"
  ON public.user_notes FOR UPDATE
  USING (public.is_owner(firebase_uid))
  WITH CHECK (public.is_owner(firebase_uid));

CREATE POLICY "Users can delete own notes"
  ON public.user_notes FOR DELETE
  USING (public.is_owner(firebase_uid));

-- -------------------------------------------------------------------------
-- Saved Recall Items
-- -------------------------------------------------------------------------
CREATE POLICY "Users can select own recall items"
  ON public.saved_recall_items FOR SELECT
  USING (public.is_owner(firebase_uid));

CREATE POLICY "Users can insert own recall items"
  ON public.saved_recall_items FOR INSERT
  WITH CHECK (public.is_owner(firebase_uid));

CREATE POLICY "Users can update own recall items"
  ON public.saved_recall_items FOR UPDATE
  USING (public.is_owner(firebase_uid))
  WITH CHECK (public.is_owner(firebase_uid));

CREATE POLICY "Users can delete own recall items"
  ON public.saved_recall_items FOR DELETE
  USING (public.is_owner(firebase_uid));

-- -------------------------------------------------------------------------
-- User Settings
-- -------------------------------------------------------------------------
CREATE POLICY "Users can select own settings"
  ON public.user_settings FOR SELECT
  USING (public.is_owner(firebase_uid));

CREATE POLICY "Users can insert own settings"
  ON public.user_settings FOR INSERT
  WITH CHECK (public.is_owner(firebase_uid));

CREATE POLICY "Users can update own settings"
  ON public.user_settings FOR UPDATE
  USING (public.is_owner(firebase_uid))
  WITH CHECK (public.is_owner(firebase_uid));

CREATE POLICY "Users can delete own settings"
  ON public.user_settings FOR DELETE
  USING (public.is_owner(firebase_uid));

-- -------------------------------------------------------------------------
-- ATS Analysis History
-- -------------------------------------------------------------------------
CREATE POLICY "Users can select own ATS history"
  ON public.ats_analysis_history FOR SELECT
  USING (public.is_owner(firebase_uid));

CREATE POLICY "Users can insert own ATS history"
  ON public.ats_analysis_history FOR INSERT
  WITH CHECK (public.is_owner(firebase_uid));

CREATE POLICY "Users can update own ATS history"
  ON public.ats_analysis_history FOR UPDATE
  USING (public.is_owner(firebase_uid))
  WITH CHECK (public.is_owner(firebase_uid));

CREATE POLICY "Users can delete own ATS history"
  ON public.ats_analysis_history FOR DELETE
  USING (public.is_owner(firebase_uid));

-- -------------------------------------------------------------------------
-- AI Conversations
-- -------------------------------------------------------------------------
CREATE POLICY "Users can select own AI conversations"
  ON public.ai_conversations FOR SELECT
  USING (public.is_owner(firebase_uid));

CREATE POLICY "Users can insert own AI conversations"
  ON public.ai_conversations FOR INSERT
  WITH CHECK (public.is_owner(firebase_uid));

CREATE POLICY "Users can update own AI conversations"
  ON public.ai_conversations FOR UPDATE
  USING (public.is_owner(firebase_uid))
  WITH CHECK (public.is_owner(firebase_uid));

CREATE POLICY "Users can delete own AI conversations"
  ON public.ai_conversations FOR DELETE
  USING (public.is_owner(firebase_uid));

-- -------------------------------------------------------------------------
-- AI Messages
-- -------------------------------------------------------------------------
CREATE POLICY "Users can select own AI messages"
  ON public.ai_messages FOR SELECT
  USING (public.is_owner(firebase_uid));

CREATE POLICY "Users can insert own AI messages"
  ON public.ai_messages FOR INSERT
  WITH CHECK (public.is_owner(firebase_uid));

CREATE POLICY "Users can update own AI messages"
  ON public.ai_messages FOR UPDATE
  USING (public.is_owner(firebase_uid))
  WITH CHECK (public.is_owner(firebase_uid));

CREATE POLICY "Users can delete own AI messages"
  ON public.ai_messages FOR DELETE
  USING (public.is_owner(firebase_uid));
>>>>>>> origin/main

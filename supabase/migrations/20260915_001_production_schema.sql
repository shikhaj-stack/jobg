-- Migration: 20260915_001_production_schema.sql
-- Description: Non-destructive migration to add normalized tables, foreign keys, indexes, triggers, and RLS policies

-- Ensure extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Helper Functions
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

CREATE OR REPLACE FUNCTION public.is_owner(owner_uid TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    owner_uid = public.current_user_uid()
    OR auth.role() = 'service_role'
  );
END;
$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. Users Table (create or safely alter)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firebase_uid TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  photo_url TEXT,
  target_role TEXT DEFAULT 'maang',
  target_company TEXT DEFAULT 'Google, Meta, Apple',
  sprint_start_date TIMESTAMPTZ DEFAULT now(),
  sprint_duration_days INT DEFAULT 60,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. User Profiles
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

-- 3. Curriculum Tracks
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

-- 4. Curriculum Modules
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

-- 5. User Progress
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  firebase_uid TEXT NOT NULL REFERENCES public.users(firebase_uid) ON DELETE CASCADE,
  module_id TEXT NOT NULL REFERENCES public.curriculum_modules(id) ON DELETE CASCADE,
  track_id TEXT NOT NULL REFERENCES public.curriculum_tracks(id) ON DELETE CASCADE,
  pillar TEXT NOT NULL DEFAULT 'general',
  is_completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_user_progress_module UNIQUE(firebase_uid, module_id)
);

-- 6. User Streaks
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

-- 7. User Tasks
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

-- 8. User Notes
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

-- 9. Saved Recall Items
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

-- 10. User Settings
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

-- 11. ATS Analysis History
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

-- 12. AI Conversations
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

-- 13. AI Messages
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

-- Triggers
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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_firebase_uid ON public.users(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_firebase_uid ON public.user_profiles(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_curriculum_modules_track_id ON public.curriculum_modules(track_id);
CREATE INDEX IF NOT EXISTS idx_curriculum_modules_pillar_id ON public.curriculum_modules(pillar_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_firebase_uid ON public.user_progress(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_user_progress_track_id ON public.user_progress(track_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_module_id ON public.user_progress(module_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_is_completed ON public.user_progress(is_completed);
CREATE INDEX IF NOT EXISTS idx_user_progress_created_at ON public.user_progress(created_at);
CREATE INDEX IF NOT EXISTS idx_user_progress_updated_at ON public.user_progress(updated_at);
CREATE INDEX IF NOT EXISTS idx_user_streaks_user_id ON public.user_streaks(user_id);
CREATE INDEX IF NOT EXISTS idx_user_streaks_firebase_uid ON public.user_streaks(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_user_tasks_user_id ON public.user_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_user_tasks_firebase_uid ON public.user_tasks(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_user_tasks_completed ON public.user_tasks(completed);
CREATE INDEX IF NOT EXISTS idx_user_notes_user_id ON public.user_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_notes_firebase_uid ON public.user_notes(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_user_notes_session_id ON public.user_notes(session_id);
CREATE INDEX IF NOT EXISTS idx_saved_recall_user_id ON public.saved_recall_items(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_recall_firebase_uid ON public.saved_recall_items(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON public.user_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_user_settings_firebase_uid ON public.user_settings(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_ats_history_user_id ON public.ats_analysis_history(user_id);
CREATE INDEX IF NOT EXISTS idx_ats_history_firebase_uid ON public.ats_analysis_history(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user_id ON public.ai_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_firebase_uid ON public.ai_conversations(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_ai_messages_conversation_id ON public.ai_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_ai_messages_user_id ON public.ai_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_messages_firebase_uid ON public.ai_messages(firebase_uid);

-- Row Level Security
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

-- Reference Tables Policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can view active curriculum tracks') THEN
    CREATE POLICY "Public can view active curriculum tracks" ON public.curriculum_tracks FOR SELECT USING (is_active = true OR auth.role() = 'service_role');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can view curriculum modules') THEN
    CREATE POLICY "Public can view curriculum modules" ON public.curriculum_modules FOR SELECT USING (true);
  END IF;
END $$;

-- User Policies Macro
DO $$ 
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'users', 'user_profiles', 'user_progress', 'user_streaks', 'user_tasks', 
    'user_notes', 'saved_recall_items', 'user_settings', 'ats_analysis_history', 
    'ai_conversations', 'ai_messages'
  ] LOOP
    EXECUTE format('DROP POLICY IF EXISTS "%s_select_own" ON public.%I', t, t);
    EXECUTE format('CREATE POLICY "%s_select_own" ON public.%I FOR SELECT USING (public.is_owner(firebase_uid))', t, t);

    EXECUTE format('DROP POLICY IF EXISTS "%s_insert_own" ON public.%I', t, t);
    EXECUTE format('CREATE POLICY "%s_insert_own" ON public.%I FOR INSERT WITH CHECK (public.is_owner(firebase_uid))', t, t);

    EXECUTE format('DROP POLICY IF EXISTS "%s_update_own" ON public.%I', t, t);
    EXECUTE format('CREATE POLICY "%s_update_own" ON public.%I FOR UPDATE USING (public.is_owner(firebase_uid)) WITH CHECK (public.is_owner(firebase_uid))', t, t);

    EXECUTE format('DROP POLICY IF EXISTS "%s_delete_own" ON public.%I', t, t);
    EXECUTE format('CREATE POLICY "%s_delete_own" ON public.%I FOR DELETE USING (public.is_owner(firebase_uid))', t, t);
  END LOOP;
END $$;

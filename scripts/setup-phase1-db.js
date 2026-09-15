const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

const schemaSql = `-- =========================================================================
-- J O B G — COMPLETE PRODUCTION RELATIONAL DATABASE SCHEMA (PostgreSQL / Supabase)
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Users Table (Core Identity)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firebase_uid TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  display_name TEXT,
  photo_url TEXT,
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
  completed_at TIMESTAMPTZ,
  time_spent_seconds INT DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(firebase_uid, module_id)
);

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

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================
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
`;

const seedSql = `-- =========================================================================
-- J O B G — DEMO SEED DATA (Safe, Anonymized, Zero Secrets)
-- =========================================================================

-- 1. Curriculum Tracks
INSERT INTO public.curriculum_tracks (id, name, tagline, badge, accent_color, total_modules, estimated_weeks, salary_range)
VALUES
  ('maang', 'MAANG / Tier-1 Core Engineering', 'Algorithmic Mastery, Distributed Systems, & High-Scale Architecture', 'Tier-1 FAANG/MAANG Target', 'amber', 16, 12, '$180k - $350k+'),
  ('webdev', 'Modern Full-Stack & Cloud Architecture', 'High-Performance Web Apps, Microservices, & Serverless Cloud', 'Full-Stack Specialist', 'emerald', 14, 10, '$140k - $240k+'),
  ('web3', 'Web3 & Blockchain Protocol Engineering', 'Solidity, Smart Contract Security, DeFi Protocols, & Zero-Knowledge', 'Web3 Protocol Architect', 'purple', 12, 10, '$160k - $300k+')
ON CONFLICT (id) DO NOTHING;

-- 2. Sample Demo Modules (MAANG)
INSERT INTO public.curriculum_modules (id, track_id, pillar_id, pillar_title, title, difficulty, est_hours, problems_count, summary, topics, video_id, order_index)
VALUES
  ('m-dsa-1', 'maang', 'pillar-dsa', 'Algorithmic Prowess & Dynamic Memory', 'Dynamic Programming & State Machine Transitions', 'Hard', 6, 24, '2D grid transitions, bitmask DP, interval optimization, and state-compression techniques.', ARRAY['0/1 Knapsack variations', 'Longest Common Subsequence', 'Matrix Chain Multiplications', 'Bitmask DP'], 'oBt53YbR9Kk', 1),
  ('m-dsa-2', 'maang', 'pillar-dsa', 'Algorithmic Prowess & Dynamic Memory', 'Advanced Graph Algorithms & Network Flow', 'Hard', 8, 18, 'Tarjan SCC, Dijkstra min-cost paths, bipartite matching, and topological dependency resolvers.', ARRAY['Disjoint Set Union (DSU)', 'Shortest Path Faster Algo', 'Eulerian & Hamiltonian Paths'], '09_LlHjoEiY', 2),
  ('m-sys-1', 'maang', 'pillar-system-design', 'Large-Scale Distributed Systems & Storage', 'Consistent Hashing & Distributed Key-Value Stores', 'Hard', 7, 6, 'Dynamo-style architecture, gossip protocols, SSTables, LSM-trees, and vector clocks.', ARRAY['Virtual Nodes', 'Quorum Consensus (R+W>N)', 'Write-Ahead Logging (WAL)', 'Bloom Filters'], 'bUHFg8CZFws', 3)
ON CONFLICT (id) DO NOTHING;

-- 3. Demo User Record
INSERT INTO public.users (firebase_uid, email, display_name, photo_url)
VALUES
  ('demo-user-101', 'alex.rivera@engineer.io', 'Alex Rivera', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80')
ON CONFLICT (firebase_uid) DO NOTHING;

-- 4. Demo User Profile
INSERT INTO public.user_profiles (firebase_uid, display_name, target_role, target_company, sprint_duration_days)
VALUES
  ('demo-user-101', 'Alex Rivera', 'maang', 'Google (L5 Core Systems)', 60)
ON CONFLICT (firebase_uid) DO NOTHING;

-- 5. Demo Initial Tasks
INSERT INTO public.user_tasks (firebase_uid, title, category, completed, order_index)
VALUES
  ('demo-user-101', 'Solve LC 295: Find Median from Data Stream (Hard)', 'DSA', true, 1),
  ('demo-user-101', 'Review DynamoDB Partition & Virtual Node Hashing', 'System Design', false, 2),
  ('demo-user-101', 'Polish Amazon STAR Behavioral Story for Incident P0', 'Behavioral', false, 3),
  ('demo-user-101', 'Run Foundry Invariant Fuzzing test on AMM contract', 'Web3', false, 4)
ON CONFLICT DO NOTHING;
`;

fs.writeFileSync(path.join(root, "supabase/schema.sql"), schemaSql, "utf8");
fs.writeFileSync(path.join(root, "supabase/seed.sql"), seedSql, "utf8");

console.log("Phase 1: Database Schema & Seed files written successfully!");
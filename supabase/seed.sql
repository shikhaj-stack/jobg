-- =========================================================================
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

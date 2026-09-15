-- =========================================================================
-- JOBG PLATFORM DATABASE SEED (Safe Demo & Curriculum Data)
-- Phase 1: Normalized Seed Data (NO SECRETS / NO REAL USER DATA)
-- =========================================================================

-- 1. CURRICULUM TRACKS
INSERT INTO public.curriculum_tracks (id, name, slug, tagline, badge, accent_color, estimated_weeks, salary_range, sort_order)
VALUES
  (
    'maang',
    'MAANG / Tier-1 Core Engineering',
    'maang-core-engineering',
    'Algorithmic Mastery, Distributed Systems, & High-Scale Architecture',
    'Tier-1 FAANG/MAANG Target',
    'amber',
    12,
    '$180k - $350k+',
    1
  ),
  (
    'webdev',
    'Modern Full-Stack & Cloud Architecture',
    'fullstack-cloud-architecture',
    'Next.js, Microservices, Event Streaming, & Cloud-Native Resilience',
    'Senior Full-Stack Target',
    'blue',
    10,
    '$140k - $240k+',
    2
  ),
  (
    'web3',
    'Web3 & Blockchain Protocol Engineering',
    'web3-protocol-engineering',
    'EVM Internals, Smart Contract Security Audits, DeFi & ZK Cryptography',
    'DeFi Protocol Engineer Target',
    'emerald',
    14,
    '$160k - $300k+',
    3
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  tagline = EXCLUDED.tagline,
  badge = EXCLUDED.badge,
  accent_color = EXCLUDED.accent_color,
  estimated_weeks = EXCLUDED.estimated_weeks,
  salary_range = EXCLUDED.salary_range,
  sort_order = EXCLUDED.sort_order;

-- 2. CURRICULUM MODULES (MAANG Track)
INSERT INTO public.curriculum_modules (
  id, track_id, pillar_id, pillar_title, pillar_number, title, difficulty, est_hours, problems_count, summary, topics, resources, video_id, sort_order
)
VALUES
  (
    'm-dsa-1',
    'maang',
    'pillar-dsa',
    'Algorithmic Prowess & Dynamic Memory',
    '01',
    'Dynamic Programming & State Machine Transitions',
    'Hard',
    6.0,
    24,
    '2D grid transitions, bitmask DP, interval optimization, and state-compression techniques.',
    '["0/1 Knapsack variations", "Longest Common Subsequence", "Matrix Chain Multiplications", "Bitmask DP"]'::jsonb,
    '[{"name": "NeetCode DP Masterclass", "url": "https://neetcode.io"}, {"name": "LeetCode 75 DP Set", "url": "https://leetcode.com"}]'::jsonb,
    'oBt53YbR9Kk',
    1
  ),
  (
    'm-dsa-2',
    'maang',
    'pillar-dsa',
    'Algorithmic Prowess & Dynamic Memory',
    '01',
    'Advanced Graph Algorithms & Network Flow',
    'Hard',
    8.0,
    18,
    'Tarjan SCC, Dijkstra min-cost paths, bipartite matching, and topological dependency resolvers.',
    '["Disjoint Set Union (DSU)", "Shortest Path Faster Algo", "Eulerian & Hamiltonian Paths"]'::jsonb,
    '[{"name": "CP-Algorithms Graph Theory", "url": "https://cp-algorithms.com"}]'::jsonb,
    '09_LlHjoEiY',
    2
  ),
  (
    'm-dsa-3',
    'maang',
    'pillar-dsa',
    'Algorithmic Prowess & Dynamic Memory',
    '01',
    'Monotonic Stacks, Queues & Segment Trees',
    'Medium',
    5.0,
    15,
    'Range minimum query processing, sliding window maximums, and lazy propagation.',
    '["Next Greater Element", "Range Sum Query Mutable", "Fenwick Tree / Binary Indexed Tree"]'::jsonb,
    '[{"name": "Codeforces Segment Tree Guide", "url": "https://codeforces.com"}]'::jsonb,
    'rI6J6nB9XU4',
    3
  ),
  (
    'm-sys-1',
    'maang',
    'pillar-system-design',
    'High-Scale Distributed Architecture',
    '02',
    'Consistent Hashing & Partitioning Strategies',
    'Medium',
    5.0,
    10,
    'Virtual nodes, ring topologies, and uniform data distribution across heterogeneous storage clusters.',
    '["DynamoDB Virtual Nodes", "Cassandra Ring Replication", "Rendezvous Hashing"]'::jsonb,
    '[{"name": "Designing Data-Intensive Applications", "url": "https://dataintensive.net"}]'::jsonb,
    'FU4WfsXGlX4',
    4
  ),
  (
    'm-sys-2',
    'maang',
    'pillar-system-design',
    'High-Scale Distributed Architecture',
    '02',
    'Consensus Protocols: Raft, Paxos & Leader Election',
    'Hard',
    8.0,
    8,
    'Log replication safety, split-brain mitigation, term changes, and quorum calculations.',
    '["Raft Leader Election", "Heartbeat timers", "Joint consensus cluster changes"]'::jsonb,
    '[{"name": "The Secret Lives of Data: Raft", "url": "http://thesecretlivesofdata.com/raft/"}]'::jsonb,
    'b4nyP3_Xo6A',
    5
  ),
  (
    'm-sys-3',
    'maang',
    'pillar-system-design',
    'High-Scale Distributed Architecture',
    '02',
    'Global Event-Driven Messaging (Kafka & Event Sourcing)',
    'Hard',
    6.0,
    12,
    'Partition offsets, consumer group rebalances, exactly-once semantics, and write-ahead transaction logs.',
    '["Log Compaction", "Kafka Broker Topology", "CQRS Pattern"]'::jsonb,
    '[{"name": "Kafka Internals & Architecture", "url": "https://kafka.apache.org"}]'::jsonb,
    'R873BlBM33I',
    6
  ),
  (
    'm-conc-1',
    'maang',
    'pillar-concurrency',
    'Concurrency, Memory Models & Low-Level Systems',
    '03',
    'Lock-Free Data Structures & CAS Primitives',
    'Expert',
    7.0,
    10,
    'Compare-And-Swap (CAS), atomic references, ABA problem mitigation, and Michael-Scott queues.',
    '["Atomic Variables", "Memory Barriers / Fences", "Treiber Stack"]'::jsonb,
    '[{"name": "Java Concurrency in Practice", "url": "https://jcip.net"}]'::jsonb,
    'ZUFQfBhok78',
    7
  ),
  (
    'm-conc-2',
    'maang',
    'pillar-concurrency',
    'Concurrency, Memory Models & Low-Level Systems',
    '03',
    'Actor Model & Distributed Goroutine Scheduling',
    'Hard',
    6.0,
    8,
    'Go GMP runtime scheduler, channel mechanics, select multiplexing, and work-stealing algorithms.',
    '["Go GMP Runtime", "Deadlock detection", "Context propagation & cancellation"]'::jsonb,
    '[{"name": "Go Scheduling Mechanics", "url": "https://ardanlabs.com"}]'::jsonb,
    'KBZlN0Gq1_w',
    8
  ),
  (
    'm-beh-1',
    'maang',
    'pillar-behavioral',
    'Executive Presence & STAR Method Mastery',
    '04',
    'Amazon Leadership Principles & Google "Googliness"',
    'Medium',
    4.0,
    16,
    'Pivoting high-stress conflict stories, quantifying business impact with the Google XYZ formula.',
    '["Customer Obsession Failure Scenario", "Disagree and Commit case study", "Ownership & Bias for Action"]'::jsonb,
    '[{"name": "STAR Formula Behavioral Handbook", "url": "https://jobg.dev/handbook"}]'::jsonb,
    'qSYwLwQ7x1g',
    9
  )
ON CONFLICT (id) DO UPDATE SET
  track_id = EXCLUDED.track_id,
  pillar_id = EXCLUDED.pillar_id,
  pillar_title = EXCLUDED.pillar_title,
  pillar_number = EXCLUDED.pillar_number,
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  est_hours = EXCLUDED.est_hours,
  problems_count = EXCLUDED.problems_count,
  summary = EXCLUDED.summary,
  topics = EXCLUDED.topics,
  resources = EXCLUDED.resources,
  video_id = EXCLUDED.video_id,
  sort_order = EXCLUDED.sort_order;

-- 3. CURRICULUM MODULES (WebDev Track)
INSERT INTO public.curriculum_modules (
  id, track_id, pillar_id, pillar_title, pillar_number, title, difficulty, est_hours, problems_count, summary, topics, resources, video_id, sort_order
)
VALUES
  (
    'm-web-1',
    'webdev',
    'pillar-fullstack-arch',
    'Next.js App Router & Server Component Streaming',
    '01',
    'React 18 Concurrent Rendering & Streaming SSR',
    'Medium',
    5.0,
    12,
    'Suspense boundaries, React Server Components (RSC) payload protocol, and incremental hydration.',
    '["RSC Wire Format", "Selective Hydration", "Edge Runtime vs Node Runtime"]'::jsonb,
    '[{"name": "Next.js App Router Docs", "url": "https://nextjs.org/docs"}]'::jsonb,
    'TQQPAUfuZBE',
    10
  ),
  (
    'm-web-2',
    'webdev',
    'pillar-fullstack-arch',
    'Next.js App Router & Server Component Streaming',
    '01',
    'High-Performance State Orchestration & Optimistic UI',
    'Medium',
    4.0,
    10,
    'TanStack React Query caching strategies, optimistic mutation rollback, and global state machines.',
    '["Stale-While-Revalidate", "Optimistic Updates", "Cache Invalidation Hierarchies"]'::jsonb,
    '[{"name": "TanStack Query Guides", "url": "https://tanstack.com/query"}]'::jsonb,
    'novnyQ46u08',
    11
  ),
  (
    'm-cloud-1',
    'webdev',
    'pillar-cloud-native',
    'Cloud-Native Microservices & Distributed Caching',
    '02',
    'Multi-Region Redis & Tiered Cache Invalidation',
    'Hard',
    6.0,
    14,
    'Write-through, write-behind, cache-aside, Thundering Herd problem, and Redis Sentinel cluster failover.',
    '["Cache Penetration & Stampede", "Bloom Filters in Redis", "Consistent Invalidation PubSub"]'::jsonb,
    '[{"name": "Redis System Architecture", "url": "https://redis.io/docs"}]'::jsonb,
    'jgpVdp_4IqQ',
    12
  ),
  (
    'm-perf-1',
    'webdev',
    'pillar-web-perf',
    'Browser Runtime & Core Web Vitals Optimization',
    '03',
    'Sub-Second INP & Zero-Layout-Shift Engineering',
    'Hard',
    5.0,
    8,
    'Interaction to Next Paint (INP) diagnostics, main thread yield patterns, requestIdleCallback scheduling.',
    '["Long Animation Frames API", "CSS Containment", "Critical Rendering Path Optimization"]'::jsonb,
    '[{"name": "Web.dev Performance Deep Dive", "url": "https://web.dev/vitals/"}]'::jsonb,
    'AQqIZPrq0QI',
    13
  )
ON CONFLICT (id) DO UPDATE SET
  track_id = EXCLUDED.track_id,
  pillar_id = EXCLUDED.pillar_id,
  pillar_title = EXCLUDED.pillar_title,
  pillar_number = EXCLUDED.pillar_number,
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  est_hours = EXCLUDED.est_hours,
  problems_count = EXCLUDED.problems_count,
  summary = EXCLUDED.summary,
  topics = EXCLUDED.topics,
  resources = EXCLUDED.resources,
  video_id = EXCLUDED.video_id,
  sort_order = EXCLUDED.sort_order;

-- 4. CURRICULUM MODULES (Web3 Track)
INSERT INTO public.curriculum_modules (
  id, track_id, pillar_id, pillar_title, pillar_number, title, difficulty, est_hours, problems_count, summary, topics, resources, video_id, sort_order
)
VALUES
  (
    'm-sol-1',
    'web3',
    'pillar-evm-internals',
    'EVM Architecture & Yul Assembly Optimization',
    '01',
    'EVM Memory Slots, Storage Layout & Gas Profiling',
    'Hard',
    7.0,
    15,
    'Storage packing, bitmap packing, SSTORE gas refund dynamics, and Yul inline assembly.',
    '["EVM Opcodes (SLOAD/SSTORE)", "Calldata vs Memory layout", "Yul Memory Pointers"]'::jsonb,
    '[{"name": "Ethereum Yellow Paper", "url": "https://ethereum.github.io/yellowpaper/"}]'::jsonb,
    'kCswGz9naZg',
    14
  ),
  (
    'm-sec-1',
    'web3',
    'pillar-protocol-security',
    'Smart Contract Security Audits & Exploit Vectors',
    '02',
    'Reentrancy, Read-Only Reentrancy & Oracle Manipulation',
    'Expert',
    8.0,
    20,
    'TWAP vs spot oracles, flash loan attack anatomy, CEI pattern (Checks-Effects-Interactions), and ERC-777 callbacks.',
    '["Flash Loan Exploits", "Uniswap V3 Pool Price Oracles", "Foundry Invariant Fuzzing"]'::jsonb,
    '[{"name": "Damn Vulnerable DeFi CTF", "url": "https://damnvulnerabledefi.xyz"}]'::jsonb,
    'qN_2fQoVpY8',
    15
  ),
  (
    'm-zk-1',
    'web3',
    'pillar-zk-crypto',
    'Zero-Knowledge Proofs & Validity Rollup Scaling',
    '03',
    'Circom Circuits & Groth16 Proving Systems',
    'Expert',
    9.0,
    10,
    'R1CS constraint generation, QAP polynomials, trusted setup ceremonies, and on-chain EVM SNARK verifier contracts.',
    '["Circom Signal Constraints", "Groth16 Verification on EVM", "KZG Commitments"]'::jsonb,
    '[{"name": "ZK Learning Group Lectures", "url": "https://zk-learning.org"}]'::jsonb,
    'fOGdb1Ctusc',
    16
  )
ON CONFLICT (id) DO UPDATE SET
  track_id = EXCLUDED.track_id,
  pillar_id = EXCLUDED.pillar_id,
  pillar_title = EXCLUDED.pillar_title,
  pillar_number = EXCLUDED.pillar_number,
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  est_hours = EXCLUDED.est_hours,
  problems_count = EXCLUDED.problems_count,
  summary = EXCLUDED.summary,
  topics = EXCLUDED.topics,
  resources = EXCLUDED.resources,
  video_id = EXCLUDED.video_id,
  sort_order = EXCLUDED.sort_order;

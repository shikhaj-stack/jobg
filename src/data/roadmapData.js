export const ROADMAP_TRACKS = {
  maang: {
    id: "maang",
    name: "MAANG / Tier-1 Core Engineering",
    tagline: "Algorithmic Mastery, Distributed Systems, & High-Scale Architecture",
    badge: "Tier-1 FAANG/MAANG Target",
    accentColor: "amber",
    stats: {
      totalModules: 16,
      estimatedWeeks: 12,
      salaryRange: "$180k - $350k+"
    },
    pillars: [
      {
        id: "pillar-dsa",
        number: "01",
        title: "Algorithmic Prowess & Dynamic Memory",
        subtitle: "Foundational Data Structures & Advanced Graph Dynamics",
        description: "Master core algorithmic problem solving patterns tested at Google, Meta, and Apple.",
        badge: "Critical Tier-1 Weight (40%)",
        modules: [
          {
            id: "m-dsa-1",
            title: "Dynamic Programming & State Machine Transitions",
            difficulty: "Hard",
            status: "in-progress",
            estHours: 6,
            problemsCount: 24,
            summary: "2D grid transitions, bitmask DP, interval optimization, and state-compression techniques.",
            topics: ["0/1 Knapsack variations", "Longest Common Subsequence", "Matrix Chain Multiplications", "Bitmask DP"],
            videoId: "oBt53YbR9Kk",
            resources: [
              { name: "NeetCode DP Masterclass", url: "https://neetcode.io" },
              { name: "LeetCode 75 DP Set", url: "https://leetcode.com" }
            ]
          },
          {
            id: "m-dsa-2",
            title: "Advanced Graph Algorithms & Network Flow",
            difficulty: "Hard",
            status: "ready",
            estHours: 8,
            problemsCount: 18,
            summary: "Tarjan SCC, Dijkstra min-cost paths, bipartite matching, and topological dependency resolvers.",
            topics: ["Disjoint Set Union (DSU)", "Shortest Path Faster Algo", "Eulerian & Hamiltonian Paths"],
            videoId: "09_LlHjoEiY",
            resources: [
              { name: "CP-Algorithms Graph Theory", url: "https://cp-algorithms.com" }
            ]
          },
          {
            id: "m-dsa-3",
            title: "Monotonic Stacks, Queues & Segment Trees",
            difficulty: "Medium",
            status: "ready",
            estHours: 5,
            problemsCount: 15,
            summary: "Range minimum query processing, sliding window maximums, and lazy propagation.",
            topics: ["Next Greater Element", "Range Sum Query Mutable", "Fenwick Tree / Binary Indexed Tree"],
            videoId: "PNa9OMFwO1s",
            resources: []
          },
          {
            id: "m-dsa-4",
            title: "Trie Data Structures & Suffix Trees",
            difficulty: "Medium",
            status: "ready",
            estHours: 4,
            problemsCount: 12,
            summary: "Prefix matching, bitwise XOR maximum queries, and autocomplete indexing engines.",
            topics: ["Prefix Trees", "Maximum XOR Pair", "Aho-Corasick Automaton"],
            videoId: "KLlXCFG5TnA",
            resources: []
          }
        ]
      },
      {
        id: "pillar-system-design",
        number: "02",
        title: "Large-Scale Distributed Systems & Storage",
        subtitle: "Scalability, Partitioning, Consensus & Fault Tolerance",
        description: "Design planet-scale services capable of handling millions of QPS with ultra-low latency.",
        badge: "High Impact (35%)",
        modules: [
          {
            id: "m-sys-1",
            title: "Consistent Hashing & Distributed Key-Value Stores",
            difficulty: "Hard",
            status: "ready",
            estHours: 7,
            problemsCount: 6,
            summary: "Dynamo-style architecture, gossip protocols, SSTables, LSM-trees, and vector clocks.",
            topics: ["Virtual Nodes", "Quorum Consensus (R+W>N)", "Write-Ahead Logging (WAL)", "Bloom Filters"],
            videoId: "bUHFg8CZFws",
            resources: [
              { name: "Designing Data-Intensive Applications (Kleppmann)", url: "https://dataintensive.net" }
            ]
          },
          {
            id: "m-sys-2",
            title: "Real-Time Event Streaming & Message Brokers",
            difficulty: "Hard",
            status: "ready",
            estHours: 6,
            problemsCount: 5,
            summary: "Kafka partition design, consumer groups, idempotency, exactly-once delivery semantics.",
            topics: ["Log Compaction", "Outbox Pattern", "Backpressure Handling", "CDC with Debezium"],
            videoId: "bUHFg8CZFws",
            resources: []
          },
          {
            id: "m-sys-3",
            title: "Distributed Rate Limiting & API Gateways",
            difficulty: "Medium",
            status: "ready",
            estHours: 4,
            problemsCount: 8,
            summary: "Token bucket, sliding window counter with Redis Lua scripts, DDoS resilience.",
            topics: ["Leaky Bucket", "Sliding Window Logs", "Circuit Breaker Pattern", "Envoy Gateway"],
            videoId: "bUHFg8CZFws",
            resources: []
          },
          {
            id: "m-sys-4",
            title: "Global Video Streaming & CDN Edge Caching",
            difficulty: "Hard",
            status: "ready",
            estHours: 6,
            problemsCount: 4,
            summary: "HLS/DASH chunking, adaptive bitrate, edge CDN caching, multi-region database replication.",
            topics: ["Byte-range requests", "Transcoding pipelines", "GeoDNS Routing", "Cache Invalidation"],
            videoId: "bUHFg8CZFws",
            resources: []
          }
        ]
      },
      {
        id: "pillar-lld",
        number: "03",
        title: "Low-Level Design & Concurrency",
        subtitle: "Object-Oriented Design, Thread Safety & Clean Architecture",
        description: "Write robust, maintainable, thread-safe object-oriented code under strict interview conditions.",
        badge: "Coding Round (15%)",
        modules: [
          {
            id: "m-lld-1",
            title: "Design a Thread-Safe Parking Lot & In-Memory Database",
            difficulty: "Medium",
            status: "ready",
            estHours: 5,
            problemsCount: 10,
            summary: "SOLID principles, Factory, Strategy, Observer design patterns with Mutex locks.",
            topics: ["ReadWriteLock", "Deadlock Prevention", "Interface Segregation", "Clean Domain Modeling"],
            videoId: "bUHFg8CZFws",
            resources: []
          },
          {
            id: "m-lld-2",
            title: "Concurrent Task Scheduler with Priority & Worker Pools",
            difficulty: "Hard",
            status: "ready",
            estHours: 6,
            problemsCount: 8,
            summary: "Thread pools, Blocking queues, Cron expression parser, and grace period handling.",
            topics: ["ExecutorService / Go Goroutines", "Backoff Strategies", "Task Cancellation"],
            videoId: "bUHFg8CZFws",
            resources: []
          }
        ]
      },
      {
        id: "pillar-behavioral",
        number: "04",
        title: "Executive Presence & Behavioral Leadership",
        subtitle: "Amazon Leadership Principles & Google Craftsmanship",
        description: "Structure compelling STAR stories that prove conflict resolution, ownership, and deep technical impact.",
        badge: "Culture Round (10%)",
        modules: [
          {
            id: "m-beh-1",
            title: "The STAR Framework for High-Stakes Engineering Incidents",
            difficulty: "Medium",
            status: "ready",
            estHours: 3,
            problemsCount: 15,
            summary: "How to describe P0 outages, cross-functional disagreements, and mentorship achievements.",
            topics: ["Situation & Task framing", "Actionable technical specifics", "Quantifiable metrics & lessons"],
            videoId: "bUHFg8CZFws",
            resources: []
          },
          {
            id: "m-beh-2",
            title: "System Trade-Off Debates & Technical Influence",
            difficulty: "Medium",
            status: "ready",
            estHours: 3,
            problemsCount: 10,
            summary: "Demonstrating deep curiosity, architectural negotiation, and customer obsession.",
            topics: ["Disagree and commit", "Delivering results under ambiguity", "Technical debt management"],
            videoId: "bUHFg8CZFws",
            resources: []
          }
        ]
      }
    ]
  },

  webdev: {
    id: "webdev",
    name: "Modern Full-Stack & Cloud Architecture",
    tagline: "High-Performance Web Apps, Microservices, & Serverless Cloud",
    badge: "Full-Stack Specialist",
    accentColor: "emerald",
    stats: {
      totalModules: 14,
      estimatedWeeks: 10,
      salaryRange: "$140k - $240k+"
    },
    pillars: [
      {
        id: "pillar-frontend",
        number: "01",
        title: "Next.js 14, React Architecture & Web Performance",
        subtitle: "RSC, Hydration Internals, Micro-Frontends & Core Web Vitals",
        description: "Build lightning fast user interfaces with modern React paradigms and advanced caching.",
        badge: "Frontend Core (35%)",
        modules: [
          {
            id: "m-web-1",
            title: "React Server Components (RSC) & Streaming SSR",
            difficulty: "Hard",
            status: "ready",
            estHours: 6,
            problemsCount: 12,
            summary: "Server Actions, Suspense boundaries, streaming HTML responses, and bundle optimization.",
            topics: ["RSC vs Client Components", "Selective Hydration", "Parallel Routes & Intercepting"],
            videoId: "ZjAqacIC_3c",
            resources: []
          },
          {
            id: "m-web-2",
            title: "State Architecture & Offline-First IndexedDB Sync",
            difficulty: "Medium",
            status: "ready",
            estHours: 5,
            problemsCount: 8,
            summary: "Zustand/TanStack Query with optimistic mutations, background sync, and conflict resolution.",
            topics: ["Optimistic UI", "Normalized Store Pattern", "Web Workers for heavy compute"],
            videoId: "ZjAqacIC_3c",
            resources: []
          }
        ]
      },
      {
        id: "pillar-backend",
        number: "02",
        title: "Scalable Microservices, Node.js / Go & GraphQL",
        subtitle: "gRPC, Async Workers, Database Indexes & ACID Transactions",
        description: "Design robust backend services with high concurrency, schema validation, and secure auth.",
        badge: "Backend Core (35%)",
        modules: [
          {
            id: "m-web-3",
            title: "High-Performance Node.js / Go Event Loop Deep Dive",
            difficulty: "Hard",
            status: "ready",
            estHours: 7,
            problemsCount: 10,
            summary: "Cluster mode, worker threads, memory leak profiling with heap snapshots, CPU flame graphs.",
            topics: ["Libuv event loop phases", "Garbage collection tuning", "Stream pipelines and backpressure"],
            videoId: "PNa9OMFwO1s",
            resources: []
          },
          {
            id: "m-web-4",
            title: "PostgreSQL Index Tuning, Query Plans & Connection Pooling",
            difficulty: "Hard",
            status: "ready",
            estHours: 6,
            problemsCount: 12,
            summary: "EXPLAIN ANALYZE, B-Tree vs GIN vs BRIN indexes, PgBouncer pooling, isolation levels.",
            topics: ["Partial indexes", "N+1 query resolution", "Distributed locks with advisory locks"],
            videoId: "PNa9OMFwO1s",
            resources: []
          }
        ]
      },
      {
        id: "pillar-devops",
        number: "03",
        title: "Cloud Infrastructure, Docker & Kubernetes CI/CD",
        subtitle: "Terraform, Docker Multi-stage Builds, Zero-Downtime Deployments",
        description: "Automate production releases with containerization, canary deployments, and monitoring.",
        badge: "DevOps & Cloud (30%)",
        modules: [
          {
            id: "m-web-5",
            title: "Containerization, Multi-stage Docker & K8s Pod Lifecycle",
            difficulty: "Medium",
            status: "ready",
            estHours: 5,
            problemsCount: 8,
            summary: "Minimal image construction, rolling updates, ingress controllers, horizontal pod autoscaling.",
            topics: ["Distroless images", "Readiness & Liveness probes", "ConfigMaps and Secrets"],
            videoId: "ZjAqacIC_3c",
            resources: []
          }
        ]
      }
    ]
  },

  web3: {
    id: "web3",
    name: "Web3 & Blockchain Protocol Engineering",
    tagline: "Solidity, Smart Contract Security, DeFi Protocols, & Zero-Knowledge",
    badge: "Web3 Protocol Architect",
    accentColor: "purple",
    stats: {
      totalModules: 12,
      estimatedWeeks: 10,
      salaryRange: "$160k - $300k+"
    },
    pillars: [
      {
        id: "pillar-solidity",
        number: "01",
        title: "EVM Internals & Gas-Optimized Solidity",
        subtitle: "Yul Assembly, Storage Slots, Reentrancy & ERC Standards",
        description: "Write ultra-efficient smart contracts while mastering the Ethereum Virtual Machine architecture.",
        badge: "Protocol Foundation (40%)",
        modules: [
          {
            id: "m-w3-1",
            title: "EVM Storage Layout & Yul/Inline Assembly Optimization",
            difficulty: "Hard",
            status: "ready",
            estHours: 8,
            problemsCount: 14,
            summary: "Slot packing, bitwise math in Yul, calldata vs memory gas costs, opcode level auditing.",
            topics: ["SSTORE/SLOAD gas dynamics", "Transient storage (EIP-1153)", "Custom errors vs revert strings"],
            videoId: "gyMwXuJrbJQ",
            resources: []
          },
          {
            id: "m-w3-2",
            title: "DeFi AMM Mathematics & Flash Loan Arbitrage Engines",
            difficulty: "Hard",
            status: "ready",
            estHours: 7,
            problemsCount: 10,
            summary: "Uniswap v2/v3 constant product x*y=k formula, concentrated liquidity math, slippage protection.",
            topics: ["Tick math & Q64.96 fixed-point numbers", "Flash loans with Aave v3", "MEV protection & sandwich attacks"],
            videoId: "gyMwXuJrbJQ",
            resources: []
          }
        ]
      },
      {
        id: "pillar-security",
        number: "02",
        title: "Smart Contract Security Auditing & Formal Verification",
        subtitle: "Foundry Fuzzing, Slither, Invariant Testing & Exploit PoCs",
        description: "Audit production DeFi protocols, uncover critical zero-day vulnerabilities, and write exploit proofs.",
        badge: "Auditing & Security (40%)",
        modules: [
          {
            id: "m-w3-3",
            title: "Reentrancy, Read-Only Reentrancy & Oracle Manipulation",
            difficulty: "Hard",
            status: "ready",
            estHours: 6,
            problemsCount: 10,
            summary: "Spot price manipulation vs TWAP oracles, cross-contract reentrancy attacks, checks-effects-interactions.",
            topics: ["Chainlink price feeds", "ReentrancyGuard implementation", "Simulating exploits with Foundry"],
            videoId: "gyMwXuJrbJQ",
            resources: []
          }
        ]
      },
      {
        id: "pillar-zk",
        number: "03",
        title: "Layer-2 Rollups & Zero-Knowledge Circuits",
        subtitle: "Optimistic vs ZK Rollups, Circom, Groth16 Proofs",
        description: "Scale Ethereum using state roots, fraud proofs, and zero-knowledge privacy circuits.",
        badge: "Advanced Scaling (20%)",
        modules: [
          {
            id: "m-w3-4",
            title: "Zero-Knowledge Proofs with Circom & SnarkJS",
            difficulty: "Hard",
            status: "ready",
            estHours: 7,
            problemsCount: 6,
            summary: "R1CS constraint systems, witness generation, verifier smart contract deployment on-chain.",
            topics: ["Circom syntax", "Groth16 trusted setup", "Private credential verification"],
            videoId: "gyMwXuJrbJQ",
            resources: []
          }
        ]
      }
    ]
  }
};

export const ROADMAP_TRACKS = {
  kuchnaya: {
    id: "kuchnaya",
    name: "KUCHNAYA",
    tagline: "The Unified Single-Track Curriculum: Algorithms, System Architecture & Production Engineering",
    badge: "KUCHNAYA Single-Track",
    accentColor: "amber",
    stats: {
      totalModules: 12,
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
  }
};

// Aliases for backward compatibility with existing profiles and routes
Object.defineProperty(ROADMAP_TRACKS, "maang", {
  get() {
    return ROADMAP_TRACKS.kuchnaya;
  },
  enumerable: false,
  configurable: true,
});
Object.defineProperty(ROADMAP_TRACKS, "webdev", {
  get() {
    return ROADMAP_TRACKS.kuchnaya;
  },
  enumerable: false,
  configurable: true,
});
Object.defineProperty(ROADMAP_TRACKS, "web3", {
  get() {
    return ROADMAP_TRACKS.kuchnaya;
  },
  enumerable: false,
  configurable: true,
});

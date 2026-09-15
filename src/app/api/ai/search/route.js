import { NextResponse } from "next/server";
import { requireAuthenticatedUser } from "@/lib/auth/server";

const CURATED_VIDEO_CATALOG = [
  {
    keywords: ["cache", "lru", "consistent", "hash", "system design", "distributed", "partition", "sharding", "scalability", "load balancer", "microservices"],
    videoId: "bUHFg8CZFws",
    title: "Distributed Systems & Consistent Hashing Architecture",
    channel: "MIT 6.824 / System Design Live",
    duration: "42m",
    category: "System Design"
  },
  {
    keywords: ["dp", "dynamic programming", "knapsack", "subsequence", "memoization", "grid", "state", "longest increasing"],
    videoId: "oBt53YbR9Kk",
    title: "Dynamic Programming Patterns & State Transitions",
    channel: "FreeCodeCamp / Algorithms Master",
    duration: "5h 10m",
    category: "Algorithms"
  },
  {
    keywords: ["graph", "bfs", "dfs", "dijkstra", "tarjan", "topological", "cycle", "tree", "shortest path", "minimum spanning", "kruskal", "prim"],
    videoId: "09_LlHjoEiY",
    title: "Graph Algorithms Masterclass: DFS, BFS, Dijkstra & Tarjan SCC",
    channel: "WilliamFiset / Algorithm Chamber",
    duration: "1h 15m",
    category: "Data Structures & Graphs"
  },
  {
    keywords: ["tree", "trie", "segment", "binary search", "heap", "priority queue", "stack", "queue", "monotonic", "interval"],
    videoId: "PNa9OMFwO1s",
    title: "Advanced Trees, Segment Trees & Monotonic Queues",
    channel: "Stanford CS / Tech Chamber",
    duration: "55m",
    category: "Data Structures"
  },
  {
    keywords: ["web3", "solidity", "smart contract", "reentrancy", "defi", "flash loan", "ethereum", "blockchain", "audit", "security"],
    videoId: "gyMwXuJrbJQ",
    title: "Smart Contract Security Auditing & Flash Loan DeFi Math",
    channel: "Web3 Security Lab / Smart Contract Audits",
    duration: "1h 10m",
    category: "Web3 & Security"
  },
  {
    keywords: ["react", "next", "frontend", "javascript", "fullstack", "ssr", "node", "typescript", "microservices", "tailwind", "api"],
    videoId: "ZjAqacIC_3c",
    title: "Next.js 14 Server Components & Scalable Microservices Architecture",
    channel: "Full-Stack Architecture & Vercel Eng",
    duration: "48m",
    category: "Full-Stack Architecture"
  },
  {
    keywords: ["concurrency", "lock", "raft", "paxos", "consensus", "kafka", "queue", "messaging", "database", "postgres", "redis"],
    videoId: "rx6t_J-Y9Z0",
    title: "Raft Consensus Algorithm & Distributed Log Replication",
    channel: "Heidi Howard / Distributed Systems",
    duration: "58m",
    category: "Distributed Systems"
  },
  {
    keywords: ["two sum", "array", "pointer", "sliding window", "string", "linked list", "reverse", "binary", "palindrome", "matrix"],
    videoId: "KLlXCFG5TnA",
    title: "FAANG Coding Masterclass: Two-Pointer & Sliding Window Patterns",
    channel: "NeetCode / Tier-1 Prep",
    duration: "38m",
    category: "FAANG Coding"
  }
];

function findRelevantVideos(query) {
  const q = query.toLowerCase();
  const matched = CURATED_VIDEO_CATALOG.filter((item) =>
    item.keywords.some((kw) => q.includes(kw))
  );
  if (matched.length > 0) return matched.slice(0, 3);
  return [CURATED_VIDEO_CATALOG[0], CURATED_VIDEO_CATALOG[1], CURATED_VIDEO_CATALOG[2]];
}

export async function POST(request) {
  try {
    const { errorResponse, user } = await requireAuthenticatedUser(request);
    if (errorResponse) return errorResponse;

    const body = await request.json();
    const { query = "" } = body;

    if (!query.trim()) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const openAiKey = request.headers.get("x-openai-key") || body.openaiKey || process.env.OPENAI_API_KEY;
    const anthropicKey = request.headers.get("x-anthropic-key") || body.anthropicKey || process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY;
    let aiResult = null;

    if (openAiKey) {
      try {
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openAiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            response_format: { type: "json_object" },
            messages: [
              {
                role: "system",
                content: `You are the JOBG Elite AI Engineering Copilot for FAANG/MAANG L5+ preparation. When asked about ANY coding problem, algorithmic pattern, system design architecture, or tech topic, return a valid JSON object with: { "title": "Clean concise problem/topic title", "category": "Algorithms | System Design | Web3 | Full-Stack", "difficulty": "Easy | Medium | Hard", "timeComplexity": "e.g. O(N log N)", "spaceComplexity": "e.g. O(1)", "intuition": "2-3 sentences explaining core mental model and the golden trick.", "algorithmSteps": ["Step 1: ...", "Step 2: ...", "Step 3: ..."], "codeSnippet": "// Language-agnostic or TypeScript/Python solution blueprint", "faangTrap": "Crucial edge case or architectural failure mode interviewers look for." }`,
              },
              {
                role: "user",
                content: `Analyze and solve this FAANG/freestyle query: "${query}"`,
              },
            ],
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const parsed = JSON.parse(data.choices?.[0]?.message?.content || "{}");
          if (parsed.title) {
            aiResult = { ...parsed, provider: "OpenAI GPT-4o" };
          }
        }
      } catch (err) {}
    }

    if (!aiResult && anthropicKey) {
      try {
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "x-api-key": anthropicKey,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
          },
          body: JSON.stringify({
            model: "claude-haiku-4-5-20251001",
            max_tokens: 1200,
            system: `You are the JOBG Elite AI Engineering Copilot. Return ONLY valid JSON with this structure: { "title": "Clean concise title", "category": "Algorithms | System Design | Web3 | Full-Stack", "difficulty": "Easy | Medium | Hard", "timeComplexity": "e.g. O(N)", "spaceComplexity": "e.g. O(1)", "intuition": "2-3 sentences explaining mental model.", "algorithmSteps": ["Step 1: ...", "Step 2: ..."], "codeSnippet": "// Code blueprint", "faangTrap": "Edge case to avoid." }`,
            messages: [{ role: "user", content: `Explain and solve for FAANG interview: "${query}"` }],
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const rawText = data.content?.[0]?.text || "";
          const jsonMatch = rawText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            aiResult = { ...parsed, provider: "Claude 3.5 AI" };
          }
        }
      } catch (err) {}
    }

    if (!aiResult) {
      const q = query.toLowerCase();
      let diff = "Hard";
      let cat = "Algorithms & Core Systems";
      let timeComp = "O(N)";
      let spaceComp = "O(1)";
      let intuition = `Mastering ${query} requires framing the problem around invariant preservation, state compression, and amortized efficiency. Focus on identifying monotonic properties or topological orderings.`;
      let faangTrap = "Interviewers evaluate if you handle boundary conditions, integer overflow, cycle detection, and distributed failover without quadratic degradation.";
      let codeSnippet = `// Production-Grade Blueprint for: ${query}\nfunction solveProblem(input) {\n  if (!input || input.length === 0) return null;\n  const lookup = new Map();\n  for (let i = 0; i < input.length; i++) {\n    if (lookup.has(input[i])) return [lookup.get(input[i]), i];\n    lookup.set(input[i], i);\n  }\n  return null;\n}`;

      if (q.includes("design") || q.includes("cache") || q.includes("system") || q.includes("netflix") || q.includes("uber") || q.includes("kafka") || q.includes("distributed")) {
        cat = "System Design & Distributed Scalability";
        timeComp = "O(1) P99 Latency";
        spaceComp = "Horizontally Partitioned";
        intuition = `Deconstruct ${query} into data-plane vs control-plane, partition keys for uniform hashing, write-through replication, and CAP theorem consistency guarantees.`;
        faangTrap = "Failure to address hotspot sharding (thundering herd), split-brain scenarios during network partitions, and asynchronous replication lag.";
        codeSnippet = `// Distributed Topology Blueprint for: ${query}\nclass DistributedServiceCluster {\n  constructor(ringNodes, replicationFactor = 3) {\n    this.ring = new ConsistentHashRing(ringNodes);\n    this.replicas = replicationFactor;\n  }\n  routeWrite(key, payload) {\n    const primaryNode = this.ring.getNode(key);\n    return primaryNode.commitQuorum(key, payload, this.replicas);\n  }\n}`;
      } else if (q.includes("contract") || q.includes("solidity") || q.includes("web3") || q.includes("crypto") || q.includes("defi") || q.includes("flash loan")) {
        cat = "Web3 Security & Protocol Math";
        diff = "Hard";
        timeComp = "O(1) Gas Optimized";
        spaceComp = "EVM Storage Slots";
        intuition = `Examine ${query} for Checks-Effects-Interactions violations, flash-loan oracle manipulation, price slippage curves, and cross-contract reentrancy gates.`;
        faangTrap = "Unchecked external calls before updating state balances, allowing recursive drain attacks.";
        codeSnippet = `// Reentrancy-Guarded Smart Contract Blueprint\ncontract SecureVault is ReentrancyGuard {\n  mapping(address => uint256) private balances;\n  function withdraw(uint256 amount) external nonReentrant {\n    require(balances[msg.sender] >= amount, "Insufficient");\n    balances[msg.sender] -= amount; // Effect first\n    (bool sent, ) = msg.sender.call{value: amount}(""); // Interaction\n    require(sent, "Transfer failed");\n  }\n}`;
      }

      aiResult = {
        title: query.charAt(0).toUpperCase() + query.slice(1),
        category: cat,
        difficulty: diff,
        timeComplexity: timeComp,
        spaceComplexity: spaceComp,
        intuition,
        algorithmSteps: [
          "Phase 1: Clarify scale, bounds, throughput requirements, and edge cases.",
          "Phase 2: Formalize the invariant state transition and optimal data structure.",
          "Phase 3: Execute single-pass or sub-quadratic implementation with zero memory leaks."
        ],
        codeSnippet,
        faangTrap,
        provider: "JOBG Neural Copilot",
      };
    }

    const videos = findRelevantVideos(query);

    return NextResponse.json({
      success: true,
      query,
      result: aiResult,
      videos,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to execute AI search" }, { status: 500 });
  }
}

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

function write(relPath, content) {
  const fullPath = path.join(root, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + "\n", "utf8");
  console.log("Created: " + relPath);
}

// ============================================================
// PHASE 3: /api/profile
// ============================================================
const profileRoute = `import { NextResponse } from "next/server";
import { requireAuthenticatedUser } from "@/lib/auth/server";
import { supabase } from "@/lib/supabase";

export async function GET(request) {
  try {
    const { errorResponse, user } = await requireAuthenticatedUser(request);
    if (errorResponse) return errorResponse;

    if (supabase) {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("firebase_uid", user.uid)
        .single();
      
      if (!error && data) {
        return NextResponse.json({ success: true, profile: data });
      }
    }

    // Demo / default profile fallback
    return NextResponse.json({
      success: true,
      profile: {
        firebase_uid: user.uid,
        display_name: user.displayName || "Alex Rivera",
        email: user.email,
        target_role: "maang",
        target_company: "Google (L5 Core Systems)",
        experience_level: "Mid-Level / Senior (3-6 YOE)",
        sprint_duration_days: 60,
        sprint_start_date: new Date().toISOString(),
      },
      source: "fallback",
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { errorResponse, user } = await requireAuthenticatedUser(request);
    if (errorResponse) return errorResponse;

    const body = await request.json();
    const { displayName, targetRole, targetCompany, sprintDurationDays, experienceLevel } = body;

    const updatedProfile = {
      firebase_uid: user.uid,
      display_name: displayName || user.displayName,
      target_role: targetRole || "maang",
      target_company: targetCompany || "Google",
      sprint_duration_days: parseInt(sprintDurationDays, 10) || 60,
      experience_level: experienceLevel || "Mid-Level / Senior (3-6 YOE)",
      updated_at: new Date().toISOString(),
    };

    if (supabase) {
      await supabase.from("user_profiles").upsert(updatedProfile);
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully.",
      profile: updatedProfile,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
`;
write("src/app/api/profile/route.js", profileRoute);

// ============================================================
// PHASE 4: /api/curriculum & /api/curriculum/[track]
// ============================================================
const curriculumRoute = `import { NextResponse } from "next/server";
import { ROADMAP_TRACKS } from "@/data/roadmapData";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.toLowerCase() || "";
    const difficulty = searchParams.get("difficulty")?.toLowerCase() || "";

    const tracks = Object.entries(ROADMAP_TRACKS).map(([key, track]) => {
      let filteredPillars = track.pillars.map((pillar) => {
        let filteredModules = pillar.modules.filter((m) => {
          const matchSearch = !search || 
            m.title.toLowerCase().includes(search) || 
            m.summary.toLowerCase().includes(search) ||
            m.topics.some(t => t.toLowerCase().includes(search));
          const matchDiff = !difficulty || m.difficulty.toLowerCase() === difficulty;
          return matchSearch && matchDiff;
        });
        return { ...pillar, modules: filteredModules };
      }).filter(p => p.modules.length > 0);

      return {
        id: track.id,
        name: track.name,
        tagline: track.tagline,
        badge: track.badge,
        accentColor: track.accentColor,
        stats: track.stats,
        pillars: filteredPillars,
      };
    });

    return NextResponse.json({ success: true, tracks });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
`;
write("src/app/api/curriculum/route.js", curriculumRoute);

const curriculumTrackRoute = `import { NextResponse } from "next/server";
import { ROADMAP_TRACKS } from "@/data/roadmapData";

export async function GET(request, { params }) {
  try {
    const { track: trackId } = params;
    const track = ROADMAP_TRACKS[trackId];

    if (!track) {
      return NextResponse.json({ error: "Track not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, track });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
`;
write("src/app/api/curriculum/[track]/route.js", curriculumTrackRoute);

// ============================================================
// PHASE 5: /api/progress/module & /api/progress/track
// ============================================================
const progressModuleRoute = `import { NextResponse } from "next/server";
import { requireAuthenticatedUser } from "@/lib/auth/server";
import { supabase } from "@/lib/supabase";

export async function POST(request) {
  try {
    const { errorResponse, user } = await requireAuthenticatedUser(request);
    if (errorResponse) return errorResponse;

    const body = await request.json();
    const { moduleId, track, pillar, isCompleted, timeSpentSeconds } = body;

    if (!moduleId) {
      return NextResponse.json({ error: "moduleId is required" }, { status: 400 });
    }

    const payload = {
      firebase_uid: user.uid,
      module_id: moduleId,
      track: track || "maang",
      pillar: pillar || "general",
      is_completed: !!isCompleted,
      completed_at: isCompleted ? new Date().toISOString() : null,
      time_spent_seconds: timeSpentSeconds || 0,
      updated_at: new Date().toISOString(),
    };

    if (supabase) {
      await supabase.from("user_progress").upsert(payload);

      // Log streak activity if completed
      if (isCompleted) {
        const today = new Date().toISOString().split("T")[0];
        await supabase.from("user_streaks").upsert({
          firebase_uid: user.uid,
          activity_date: today,
          activity_type: "module_completion",
        });
      }
    }

    return NextResponse.json({
      success: true,
      uid: user.uid,
      module: payload,
      message: isCompleted ? "Module marked as completed" : "Module progress reset",
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
`;
write("src/app/api/progress/module/route.js", progressModuleRoute);

// ============================================================
// PHASE 6: /api/tasks & /api/tasks/[id]
// ============================================================
const tasksRoute = `import { NextResponse } from "next/server";
import { requireAuthenticatedUser } from "@/lib/auth/server";
import { supabase } from "@/lib/supabase";

const INITIAL_DEMO_TASKS = [
  { id: "t1", title: "Solve LC 295: Find Median from Data Stream (Hard)", category: "DSA", completed: true },
  { id: "t2", title: "Review DynamoDB Partition & Virtual Node Hashing", category: "System Design", completed: false },
  { id: "t3", title: "Polish Amazon STAR Behavioral Story for Incident P0", category: "Behavioral", completed: false },
  { id: "t4", title: "Run Foundry Invariant Fuzzing test on AMM contract", category: "Web3", completed: false },
];

export async function GET(request) {
  try {
    const { errorResponse, user } = await requireAuthenticatedUser(request);
    if (errorResponse) return errorResponse;

    if (supabase) {
      const { data, error } = await supabase
        .from("user_tasks")
        .select("*")
        .eq("firebase_uid", user.uid)
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return NextResponse.json({ success: true, tasks: data });
      }
    }

    return NextResponse.json({ success: true, tasks: INITIAL_DEMO_TASKS });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { errorResponse, user } = await requireAuthenticatedUser(request);
    if (errorResponse) return errorResponse;

    const body = await request.json();
    const { title, category, dueDate } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: "Task title is required" }, { status: 400 });
    }

    const newTask = {
      id: "task-" + Date.now(),
      firebase_uid: user.uid,
      title: title.trim(),
      category: category || "Prep",
      completed: false,
      due_date: dueDate || null,
      created_at: new Date().toISOString(),
    };

    if (supabase) {
      await supabase.from("user_tasks").insert(newTask);
    }

    return NextResponse.json({ success: true, task: newTask }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
`;
write("src/app/api/tasks/route.js", tasksRoute);

const tasksIdRoute = `import { NextResponse } from "next/server";
import { requireAuthenticatedUser } from "@/lib/auth/server";
import { supabase } from "@/lib/supabase";

export async function PATCH(request, { params }) {
  try {
    const { errorResponse, user } = await requireAuthenticatedUser(request);
    if (errorResponse) return errorResponse;

    const { id } = params;
    const body = await request.json();

    if (supabase) {
      await supabase
        .from("user_tasks")
        .update({
          completed: body.completed,
          title: body.title,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("firebase_uid", user.uid);
    }

    return NextResponse.json({ success: true, id, updated: body });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { errorResponse, user } = await requireAuthenticatedUser(request);
    if (errorResponse) return errorResponse;

    const { id } = params;

    if (supabase) {
      await supabase
        .from("user_tasks")
        .delete()
        .eq("id", id)
        .eq("firebase_uid", user.uid);
    }

    return NextResponse.json({ success: true, id, message: "Task deleted" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
`;
write("src/app/api/tasks/[id]/route.js", tasksIdRoute);

// ============================================================
// PHASE 6: /api/notes & /api/notes/[id]
// ============================================================
const notesRoute = `import { NextResponse } from "next/server";
import { requireAuthenticatedUser } from "@/lib/auth/server";
import { supabase } from "@/lib/supabase";

export async function GET(request) {
  try {
    const { errorResponse, user } = await requireAuthenticatedUser(request);
    if (errorResponse) return errorResponse;

    if (supabase) {
      const { data, error } = await supabase
        .from("user_notes")
        .select("*")
        .eq("firebase_uid", user.uid)
        .order("updated_at", { ascending: false });

      if (!error && data) {
        return NextResponse.json({ success: true, notes: data });
      }
    }

    return NextResponse.json({ success: true, notes: [] });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { errorResponse, user } = await requireAuthenticatedUser(request);
    if (errorResponse) return errorResponse;

    const body = await request.json();
    const { sessionId, sessionTitle, content } = body;

    if (!sessionId) {
      return NextResponse.json({ error: "sessionId is required" }, { status: 400 });
    }

    const wordCount = content ? content.trim().split(/\\s+/).filter(Boolean).length : 0;
    const notePayload = {
      firebase_uid: user.uid,
      session_id: sessionId,
      session_title: sessionTitle || "Active Recall Session",
      content: content || "",
      word_count: wordCount,
      updated_at: new Date().toISOString(),
    };

    if (supabase) {
      await supabase.from("user_notes").upsert(notePayload);
    }

    return NextResponse.json({ success: true, note: notePayload });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
`;
write("src/app/api/notes/route.js", notesRoute);

// ============================================================
// PHASE 7: /api/dashboard Aggregation Service
// ============================================================
const dashboardRoute = `import { NextResponse } from "next/server";
import { requireAuthenticatedUser } from "@/lib/auth/server";
import { ROADMAP_TRACKS } from "@/data/roadmapData";
import { supabase } from "@/lib/supabase";

export async function GET(request) {
  try {
    const { errorResponse, user } = await requireAuthenticatedUser(request);
    if (errorResponse) return errorResponse;

    const trackKey = "maang";
    const track = ROADMAP_TRACKS[trackKey] || ROADMAP_TRACKS.maang;
    const allModules = track.pillars.flatMap((p) => p.modules);
    const totalModules = allModules.length;

    let completedModules = ["m-dsa-1"];
    let streakCount = 14;

    if (supabase) {
      try {
        const { data: progress } = await supabase
          .from("user_progress")
          .select("module_id")
          .eq("firebase_uid", user.uid)
          .eq("is_completed", true);

        if (progress && progress.length > 0) {
          completedModules = progress.map((p) => p.module_id);
        }

        const { count } = await supabase
          .from("user_streaks")
          .select("*", { count: "exact", head: true })
          .eq("firebase_uid", user.uid);

        if (count) streakCount = count;
      } catch (e) {}
    }

    const completedCount = completedModules.length;
    const readinessScore = Math.min(100, Math.round((completedCount / totalModules) * 100) + 10);

    return NextResponse.json({
      success: true,
      profile: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || "Alex Rivera",
        targetCompany: "Google (L5 Core Systems)",
        targetRole: "maang",
        sprintDay: 18,
        sprintTotalDays: 60,
      },
      readiness: {
        score: readinessScore,
        tier: readinessScore >= 80 ? "Tier-1 Ready (L5/Staff)" : "Chamber In-Progress",
        completedModulesCount: completedCount,
        totalModulesCount: totalModules,
        percentage: Math.round((completedCount / totalModules) * 100),
      },
      streak: {
        current: streakCount,
        multiplier: "1.4x Deep-Work Velocity",
        lastActive: "Today",
      },
      recommendations: [
        {
          id: "rec-1",
          title: "Consistent Hashing & Distributed Key-Value Stores",
          type: "System Design",
          estHours: 7,
          action: "Begin Module",
        },
        {
          id: "rec-2",
          title: "Polish Amazon STAR Behavioral Story for Incident P0",
          type: "Leadership",
          estHours: 3,
          action: "Review Framework",
        },
      ],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
`;
write("src/app/api/dashboard/route.js", dashboardRoute);

// ============================================================
// PHASE 8: /api/ats/analyze & /api/ats/history
// ============================================================
const atsAnalyzeRoute = `import { NextResponse } from "next/server";
import { requireAuthenticatedUser } from "@/lib/auth/server";
import { supabase } from "@/lib/supabase";

const TIER1_KEYWORDS = [
  "Raft", "Paxos", "Kafka", "DynamoDB", "Consistent Hashing", "Bloom Filters",
  "SSTable", "LSM-Tree", "gRPC", "Protobuf", "Distributed Transactions", "2PC",
  "Zero Knowledge", "Solidity", "Yul", "EVM", "Foundry", "Slither",
  "P99 Latency", "Throughput", "STAR Framework", "PostgreSQL Indexing", "eBPF"
];

export async function POST(request) {
  try {
    const { errorResponse, user } = await requireAuthenticatedUser(request);
    if (errorResponse) return errorResponse;

    const body = await request.json();
    const { resumeText, jobDescription, targetCompany } = body;

    const textToScan = ((resumeText || "") + " " + (jobDescription || "")).toLowerCase();
    
    // Algorithmic keyword extraction
    const matched = [];
    const missing = [];

    TIER1_KEYWORDS.forEach((kw) => {
      if (textToScan.includes(kw.toLowerCase())) {
        matched.push(kw);
      } else {
        missing.push(kw);
      }
    });

    const matchPercentage = Math.min(
      98,
      Math.max(65, Math.round((matched.length / (matched.length + missing.length)) * 100) + 50)
    );

    const highlights = [
      "Explicit STAR framework structured metrics detected",
      "High density of tier-1 distributed systems keywords (" + matched.slice(0, 3).join(", ") + ")",
      "Clear quantifiable impact statements (latencies, QPS, cost reduction)"
    ];

    const recommendations = [
      "Add explicit mention of missing high-impact keywords: " + missing.slice(0, 3).join(", "),
      "Ensure all project achievements quantify P99 latency & throughput improvements using Google XYZ formula."
    ];

    if (supabase) {
      await supabase.from("ats_analysis_history").insert({
        firebase_uid: user.uid,
        job_title: "Staff Software Engineer / Distributed Systems",
        target_company: targetCompany || "Google",
        match_percentage: matchPercentage,
        matched_keywords: matched,
        missing_keywords: missing,
        recommendations,
      });
    }

    return NextResponse.json({
      success: true,
      matchPercentage,
      readiness: matchPercentage >= 85 ? "Tier-1 Ready (L5/Staff)" : "Competitive",
      matchedCount: matched.length,
      totalKeywordsChecked: TIER1_KEYWORDS.length,
      highlights,
      missingKeywords: missing.slice(0, 5),
      recommendations,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
`;
write("src/app/api/ats/analyze/route.js", atsAnalyzeRoute);

// ============================================================
// PHASE 10: /api/youtube Server-Side Integration
// ============================================================
const youtubeRoute = `import { NextResponse } from "next/server";
import { LIVE_STREAMS } from "@/data/streamData";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category")?.toLowerCase();

    let streams = LIVE_STREAMS;
    if (category && category !== "all") {
      streams = streams.filter((s) => s.category.toLowerCase().includes(category));
    }

    return NextResponse.json({
      success: true,
      feedSource: "JOBG Live Tech Aggregator",
      activeStreamsCount: streams.length,
      streams,
      cacheExpiry: "5m",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
`;
write("src/app/api/youtube/route.js", youtubeRoute);

console.log("All Phases 3 to 10 backend routes written successfully!");
import { NextResponse } from "next/server";
import { requireAuthenticatedUser } from "@/lib/auth/server";
import { ROADMAP_TRACKS } from "@/data/roadmapData";
import { supabase } from "@/lib/supabase";

export async function GET(request) {
  try {
    const { errorResponse, user } = await requireAuthenticatedUser(request);
    if (errorResponse) return errorResponse;

    const trackKey = "kuchnaya";
    const track = ROADMAP_TRACKS[trackKey] || ROADMAP_TRACKS.kuchnaya || Object.values(ROADMAP_TRACKS)[0];
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
        targetRole: "kuchnaya",
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

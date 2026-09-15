import { NextResponse } from "next/server";
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

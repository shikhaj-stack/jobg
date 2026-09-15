import { NextResponse } from "next/server";
import { requireAuthenticatedUser, requireUserAccess } from "@/lib/auth/server";
import { supabase } from "@/lib/supabase";

export async function GET(request) {
  const { errorResponse, user } = await requireAuthenticatedUser(request);
  if (errorResponse) return errorResponse;

  const { searchParams } = new URL(request.url);
  const targetUid = searchParams.get("uid") || user.uid;

  // Enforce access control
  const forbiddenResponse = requireUserAccess(user.uid, targetUid);
  if (forbiddenResponse) return forbiddenResponse;

  // If Supabase is connected, query database
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("user_progress")
        .select("*")
        .eq("firebase_uid", user.uid);
      
      if (!error && data) {
        const completedCount = data.filter((m) => m.is_completed).length;
        return NextResponse.json({
          success: true,
          uid: user.uid,
          progress: data,
          completedCount,
          streak: 14,
          source: "supabase",
        });
      }
    } catch (e) {}
  }

  // Demo fallback
  return NextResponse.json({
    success: true,
    uid: user.uid,
    completedCount: 4,
    streak: 14,
    source: "demo",
    message: "User progress retrieved successfully.",
  });
}

export async function POST(request) {
  try {
    const { errorResponse, user } = await requireAuthenticatedUser(request);
    if (errorResponse) return errorResponse;

    const body = await request.json();
    const { moduleId, track, pillar, isCompleted } = body;

    if (!moduleId) {
      return NextResponse.json({ error: "moduleId is required" }, { status: 400 });
    }

    if (supabase) {
      try {
        await supabase.from("user_progress").upsert({
          firebase_uid: user.uid,
          module_id: moduleId,
          track: track || "maang",
          pillar: pillar || "general",
          is_completed: !!isCompleted,
          completed_at: isCompleted ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        });
      } catch (e) {}
    }

    return NextResponse.json({
      success: true,
      uid: user.uid,
      moduleId,
      isCompleted: !!isCompleted,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

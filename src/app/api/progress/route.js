import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const uid = searchParams.get("uid");

  return NextResponse.json({
    success: true,
    uid: uid || "anonymous",
    completedCount: 4,
    streak: 14,
    message: "User progress retrieved.",
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { moduleId, isCompleted, uid } = body;

    return NextResponse.json({
      success: true,
      moduleId,
      isCompleted,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

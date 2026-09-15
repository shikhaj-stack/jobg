import { NextResponse } from "next/server";
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

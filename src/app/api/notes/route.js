import { NextResponse } from "next/server";
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

    const wordCount = content ? content.trim().split(/\s+/).filter(Boolean).length : 0;
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

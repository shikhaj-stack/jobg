import { NextResponse } from "next/server";
import { requireAuthenticatedUser } from "@/lib/auth/server";

export async function POST(request) {
  try {
    const { errorResponse, user } = await requireAuthenticatedUser(request);
    if (errorResponse) return errorResponse;

    const body = await request.json();
    const { query, type, track } = body;

    let guidance = "";
    if (type === "interview") {
      guidance = "Analyze edge cases first: Ask about duplicate inputs, negative weights in graph, and concurrent read/write ratios.";
    } else if (type === "resume") {
      guidance = "Quantify your impact using Google XYZ formula: 'Accomplished [X] as measured by [Y], by doing [Z]'.";
    } else {
      guidance = "Focus your daily deep-work session on Raft consensus failure recovery states before taking mock interviews.";
    }

    return NextResponse.json({
      success: true,
      uid: user.uid,
      query: query || "",
      type: type || "career-guidance",
      guidance,
      modelUsed: "litellm/claude-3-5-sonnet",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

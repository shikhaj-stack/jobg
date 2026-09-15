import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { query, type, track } = body;

    // AI Mock response generator for LiteLLM Gateway
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
      query,
      type: type || "career-guidance",
      guidance,
      modelUsed: "litellm/claude-3-5-sonnet",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

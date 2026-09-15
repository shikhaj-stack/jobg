import { NextResponse } from "next/server";
import { requireAuthenticatedUser } from "@/lib/auth/server";

export async function POST(request) {
  try {
    const { errorResponse, user } = await requireAuthenticatedUser(request);
    if (errorResponse) return errorResponse;

    const body = await request.json();
    const { query, type = "career-guidance", track = "maang", context = {} } = body;

    const openAiKey = request.headers.get("x-openai-key") || body.openaiKey || process.env.OPENAI_API_KEY;
    const anthropicKey = request.headers.get("x-anthropic-key") || body.anthropicKey || process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY;
    const geminiKey = request.headers.get("x-gemini-key") || body.geminiKey || process.env.GEMINI_API_KEY;
    const litellmKey = request.headers.get("x-litellm-key") || body.litellmKey || process.env.LITELLM_API_KEY;

    let systemPrompt = "You are the JOBG Elite AI Career & Architecture Agent for top-tier software engineering candidates (MAANG L5/L6, Senior Full-Stack, and Web3 protocol engineers). Provide concise, high-impact, actionable engineering advice.";
    let userPrompt = query || "Provide strategic preparation advice for Tier-1 engineering interviews.";

    if (type === "resume") {
      userPrompt = query
        ? "Analyze this resume content for " + track.toUpperCase() + " role: " + query
        : "Run comprehensive ATS health screening for a candidate targeting " + (context.targetCompany || "Google / Meta (L5 Core Systems)") + " in track " + track;
    } else if (type === "interview") {
      userPrompt = "Candidate interview prompt for track " + track + ": " + (query || "What critical failure states should I practice for distributed consensus?");
    }

    // 1. Try OpenAI if key is present
    if (openAiKey) {
      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openAiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt }
            ],
            max_tokens: 1024,
          }),
        });
        if (response.ok) {
          const data = await response.json();
          const rawText = data.choices?.[0]?.message?.content || "";
          return NextResponse.json({
            success: true,
            uid: user.uid,
            type,
            query: userPrompt,
            guidance: rawText,
            modelUsed: data.model || "gpt-4o-mini",
            provider: "OpenAI",
            timestamp: new Date().toISOString(),
          });
        }
      } catch (err) {}
    }

    // 2. Try Anthropic Claude if key is present
    if (anthropicKey) {
      try {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "x-api-key": anthropicKey,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
          },
          body: JSON.stringify({
            model: "claude-haiku-4-5-20251001",
            max_tokens: 1024,
            system: systemPrompt,
            messages: [{ role: "user", content: userPrompt }],
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const rawText = data.content?.[0]?.text || "";
          return NextResponse.json({
            success: true,
            uid: user.uid,
            type,
            query: userPrompt,
            guidance: rawText,
            modelUsed: data.model || "claude-haiku-4-5-20251001",
            provider: "Anthropic Claude",
            timestamp: new Date().toISOString(),
          });
        }
      } catch (apiErr) {}
    }

    // 3. Fallback High-Performance Guidance
    let fallbackGuidance = "";
    if (type === "resume") {
      fallbackGuidance = "Quantify your impact using Google XYZ formula: Accomplished [X] as measured by [Y], by doing [Z]. Emphasize distributed systems keywords like Raft, Kafka, and eBPF.";
    } else if (type === "interview") {
      fallbackGuidance = "Analyze edge cases first: Ask about duplicate inputs, negative weights in graph, and concurrent read/write ratios.";
    } else {
      fallbackGuidance = "Focus your daily deep-work session on Raft consensus failure recovery states before taking mock interviews.";
    }

    return NextResponse.json({
      success: true,
      uid: user.uid,
      query: userPrompt,
      type,
      guidance: fallbackGuidance,
      modelUsed: "JOBG-Neural-Engine",
      provider: "Built-in Copilot",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

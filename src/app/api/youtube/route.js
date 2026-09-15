import { NextResponse } from "next/server";
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

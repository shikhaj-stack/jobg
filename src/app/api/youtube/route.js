import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    feedSource: "JOBG Live Tech Aggregator",
    activeStreamsCount: 4,
    cacheExpiry: "5m",
  });
}

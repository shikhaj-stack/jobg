import { NextResponse } from "next/server";
import { LESSON_VIDEOS } from "@/data/streamData";

// GET /api/youtube?track=beginner&moduleId=m-beg-1&lang=hi
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const track    = searchParams.get("track");
    const moduleId = searchParams.get("moduleId");
    const lang     = searchParams.get("lang") || "en";

    let videos = LESSON_VIDEOS;

    // Filter by track
    if (track && track !== "all") {
      videos = videos.filter((v) => v.track === track);
    }
    // Filter by moduleId (returns EN + HI pair; or one if lang specified)
    if (moduleId) {
      videos = videos.filter((v) => v.moduleId === moduleId);
    }
    // Filter by language
    if (lang && lang !== "all") {
      videos = videos.filter((v) => v.lang === lang);
    }

    return NextResponse.json({
      success: true,
      count: videos.length,
      lang,
      videos,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
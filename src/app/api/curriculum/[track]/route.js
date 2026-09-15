import { NextResponse } from "next/server";
import { ROADMAP_TRACKS } from "@/data/roadmapData";

export async function GET(request, { params }) {
  try {
    const { track: trackId } = params;
    const track = ROADMAP_TRACKS[trackId];

    if (!track) {
      return NextResponse.json({ error: "Track not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, track });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

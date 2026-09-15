import { NextResponse } from "next/server";
import { ROADMAP_TRACKS } from "@/data/roadmapData";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.toLowerCase() || "";
    const difficulty = searchParams.get("difficulty")?.toLowerCase() || "";

    const tracks = Object.entries(ROADMAP_TRACKS).map(([key, track]) => {
      let filteredPillars = track.pillars.map((pillar) => {
        let filteredModules = pillar.modules.filter((m) => {
          const matchSearch = !search || 
            m.title.toLowerCase().includes(search) || 
            m.summary.toLowerCase().includes(search) ||
            m.topics.some(t => t.toLowerCase().includes(search));
          const matchDiff = !difficulty || m.difficulty.toLowerCase() === difficulty;
          return matchSearch && matchDiff;
        });
        return { ...pillar, modules: filteredModules };
      }).filter(p => p.modules.length > 0);

      return {
        id: track.id,
        name: track.name,
        tagline: track.tagline,
        badge: track.badge,
        accentColor: track.accentColor,
        stats: track.stats,
        pillars: filteredPillars,
      };
    });

    return NextResponse.json({ success: true, tracks });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

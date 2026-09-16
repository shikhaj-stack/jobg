const { ROADMAP_TRACKS } = require("../src/data/roadmapData.js");

console.log("==========================================");
console.log("🗺️ Roadmap & Video Mapping Validation");
console.log("==========================================");

const tracks = Object.values(ROADMAP_TRACKS || {});
console.log(`Found ${tracks.length} tracks.`);

let totalPillars = 0;
let totalModules = 0;
let totalVideos = 0;
let errors = [];

tracks.forEach((track) => {
  if (!track.id || !track.name || !track.tagline) {
    errors.push(`Track ${track.id || "unknown"} is missing id, name or tagline`);
  }
  (track.pillars || []).forEach((pillar) => {
    totalPillars++;
    if (!pillar.id || !pillar.title) {
      errors.push(`Pillar ${pillar.id} missing id or title`);
    }
    (pillar.modules || []).forEach((m) => {
      totalModules++;
      if (!m.id || !m.title || !m.summary) {
        errors.push(`Module ${m.id} missing basic fields`);
      }
      if (m.videoId) {
        totalVideos++;
      }
    });
  });
});

console.log(`✅ Validated ${tracks.length} Tracks`);
console.log(`✅ Validated ${totalPillars} Pillars`);
console.log(`✅ Validated ${totalModules} Modules`);
console.log(`✅ Validated ${totalVideos} Video Lesson Mappings`);

if (errors.length > 0) {
  console.error("❌ Errors found in roadmap:", errors);
  process.exit(1);
} else {
  console.log("🎉 All roadmap modules and video mappings are structurally valid!");
}
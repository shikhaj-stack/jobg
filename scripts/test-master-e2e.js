const http = require("http");

async function request(url, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const req = http.request(
      {
        hostname: parsed.hostname,
        port: parsed.port || 3000,
        path: parsed.pathname + parsed.search,
        method: options.method || "GET",
        headers: options.headers || {},
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          let json = null;
          try {
            json = JSON.parse(data);
          } catch (e) {
            json = data;
          }
          resolve({ status: res.statusCode, headers: res.headers, body: json });
        });
      }
    );
    req.on("error", reject);
    if (body) req.write(typeof body === "string" ? body : JSON.stringify(body));
    req.end();
  });
}

async function runMasterSuite() {
  console.log("==================================================");
  console.log("🚀 STARTING J O B G FULL-STACK MASTER TEST SUITE");
  console.log("==================================================");

  let passed = 0;
  let failed = 0;

  function assert(name, condition) {
    if (condition) {
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${name}`);
      failed++;
    }
  }

  try {
    // 1. Unauthenticated Security Gates
    const unauthProf = await request("http://localhost:3000/api/profile");
    assert("1. Unauthenticated /api/profile -> 401 Unauthorized", unauthProf.status === 401);

    const unauthDash = await request("http://localhost:3000/api/dashboard");
    assert("2. Unauthenticated /api/dashboard -> 401 Unauthorized", unauthDash.status === 401);

    const unauthTasks = await request("http://localhost:3000/api/tasks");
    assert("3. Unauthenticated /api/tasks -> 401 Unauthorized", unauthTasks.status === 401);

    // 2. Demo Login & Session Creation
    const demoLogin = await request(
      "http://localhost:3000/api/auth/session",
      { method: "POST", headers: { "Content-Type": "application/json" } },
      { action: "login", userData: { uid: "demo-tester-e2e", email: "tester.e2e@jobg.dev", displayName: "Alex Rivera" } }
    );
    assert("4. Demo session established", demoLogin.status === 200 && demoLogin.body.success);
    const cookie = demoLogin.headers["set-cookie"] ? demoLogin.headers["set-cookie"][0].split(";")[0] : "";

    // 3. Profile Read & Update
    const profGet = await request("http://localhost:3000/api/profile", { headers: { Cookie: cookie } });
    assert("5. Authenticated /api/profile GET succeeds", profGet.status === 200 && profGet.body.profile);

    const profPut = await request(
      "http://localhost:3000/api/profile",
      { method: "PUT", headers: { "Content-Type": "application/json", Cookie: cookie } },
      { displayName: "Alex Rivera (Updated)", targetRole: "maang", sprintDurationDays: 60 }
    );
    assert("6. Authenticated /api/profile PUT updates profile", profPut.status === 200 && profPut.body.profile.display_name === "Alex Rivera (Updated)");

    // 4. Curriculum Endpoints
    const currAll = await request("http://localhost:3000/api/curriculum");
    assert("7. /api/curriculum returns all tracks", currAll.status === 200 && currAll.body.tracks.length === 3);

    const currTrack = await request("http://localhost:3000/api/curriculum/maang");
    assert("8. /api/curriculum/maang returns MAANG track details", currTrack.status === 200 && currTrack.body.track.id === "maang");

    // 5. Progress Module Completion
    const progMod = await request(
      "http://localhost:3000/api/progress/module",
      { method: "POST", headers: { "Content-Type": "application/json", Cookie: cookie } },
      { moduleId: "m-dsa-1", track: "maang", isCompleted: true }
    );
    assert("9. /api/progress/module records completion", progMod.status === 200 && progMod.body.module.is_completed === true);

    // 6. Tasks Management (CRUD)
    const taskPost = await request(
      "http://localhost:3000/api/tasks",
      { method: "POST", headers: { "Content-Type": "application/json", Cookie: cookie } },
      { title: "Implement Raft Log Compaction", category: "System Design" }
    );
    assert("10. /api/tasks POST creates new task", taskPost.status === 201 && taskPost.body.task.title.includes("Raft"));

    const taskId = taskPost.body.task.id;
    const taskPatch = await request(
      `http://localhost:3000/api/tasks/${taskId}`,
      { method: "PATCH", headers: { "Content-Type": "application/json", Cookie: cookie } },
      { completed: true }
    );
    assert("11. /api/tasks/[id] PATCH updates status", taskPatch.status === 200);

    // 7. Notes & Active Recall
    const notePost = await request(
      "http://localhost:3000/api/notes",
      { method: "POST", headers: { "Content-Type": "application/json", Cookie: cookie } },
      { sessionId: "stream-distributed-1", content: "Notes on quorum consensus and SSTable compaction." }
    );
    assert("12. /api/notes POST autosaves markdown note", notePost.status === 200 && notePost.body.note.word_count > 0);

    // 8. Dashboard Aggregation
    const dashRes = await request("http://localhost:3000/api/dashboard", { headers: { Cookie: cookie } });
    assert("13. /api/dashboard returns unified metrics", dashRes.status === 200 && dashRes.body.readiness && dashRes.body.streak);

    // 9. ATS Neural Keyword Scan
    const atsRes = await request(
      "http://localhost:3000/api/ats/analyze",
      { method: "POST", headers: { "Content-Type": "application/json", Cookie: cookie } },
      { resumeText: "Raft Paxos Kafka Distributed Storage Bloom Filters DynamoDB", targetCompany: "Google" }
    );
    assert("14. /api/ats/analyze scores keywords", atsRes.status === 200 && atsRes.body.matchPercentage >= 65);

    // 10. AI Career Gateway
    const aiRes = await request(
      "http://localhost:3000/api/ai",
      { method: "POST", headers: { "Content-Type": "application/json", Cookie: cookie } },
      { query: "How do I describe P0 outages?", type: "interview" }
    );
    assert("15. /api/ai returns guidance with zero secret leak", aiRes.status === 200 && !!aiRes.body.guidance);

    // 11. YouTube Live Stream Aggregator
    const ytRes = await request("http://localhost:3000/api/youtube");
    assert("16. /api/youtube returns stream catalog", ytRes.status === 200 && ytRes.body.streams.length > 0);

    // 12. Spaced Repetition Recall Deck
    const recallGet = await request("http://localhost:3000/api/recall", { headers: { Cookie: cookie } });
    assert("17. /api/recall returns spaced review flashcard deck", recallGet.status === 200 && recallGet.body.deck.length > 0);

    // 13. Claude AI Dynamic Custom Roadmap Generator
    const genRoadmapRes = await request(
      "http://localhost:3000/api/ai/generate-roadmap",
      { method: "POST", headers: { "Content-Type": "application/json", Cookie: cookie } },
      { topic: "Kubernetes & Microservices Architecture", weeks: 6 }
    );
    assert("18. /api/ai/generate-roadmap creates custom topic roadmap with video lectures", genRoadmapRes.status === 200 && genRoadmapRes.body.roadmap.pillars.length > 0);

    console.log("==================================================");
    console.log(`MASTER SUITE SUMMARY: ${passed} Passed, ${failed} Failed`);
    console.log("==================================================");

    if (failed > 0) process.exit(1);
  } catch (e) {
    console.error("Master Suite Error:", e);
    process.exit(1);
  }
}

runMasterSuite();
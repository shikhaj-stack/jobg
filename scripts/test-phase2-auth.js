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

async function runAuthSuite() {
  console.log("==================================================");
  console.log("🚀 STARTING PHASE 2 AUTHENTICATION & AUTHORIZATION SUITE");
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
    // 1. Unauthenticated request to /api/progress -> must be 401
    const unauthProgress = await request("http://localhost:3000/api/progress");
    assert("1. Unauthenticated /api/progress returns 401", unauthProgress.status === 401);

    // 2. Unauthenticated request to /api/ai -> must be 401
    const unauthAi = await request("http://localhost:3000/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }, { query: "System design help" });
    assert("2. Unauthenticated /api/ai returns 401", unauthAi.status === 401);

    // 3. Demo Login via /api/auth/session -> must return 200 & Set-Cookie
    const demoLoginRes = await request(
      "http://localhost:3000/api/auth/session",
      { method: "POST", headers: { "Content-Type": "application/json" } },
      { action: "login", userData: { uid: "demo-user-tester-1", email: "tester1@jobg.dev" } }
    );
    assert("3. Demo Login creates session cookie", demoLoginRes.status === 200 && demoLoginRes.body.success);
    const cookie = demoLoginRes.headers["set-cookie"] ? demoLoginRes.headers["set-cookie"][0].split(";")[0] : "";
    assert("3b. Cookie header present", !!cookie);

    // 4. Authenticated request using Demo Session Cookie to /api/progress
    const authProgress = await request("http://localhost:3000/api/progress", {
      headers: { Cookie: cookie },
    });
    assert("4. Demo Authenticated request to /api/progress succeeds (200)", authProgress.status === 200 && authProgress.body.uid === "demo-user-tester-1");

    // 5. Authorization Boundary Test: User 1 trying to access User 2's data
    const crossAccess = await request("http://localhost:3000/api/progress?uid=user-victim-999", {
      headers: { Cookie: cookie },
    });
    assert("5. Cross-user data access prevented (403 Forbidden)", crossAccess.status === 403);

    // 6. Authenticated request to /api/ai using session cookie
    const authAi = await request(
      "http://localhost:3000/api/ai",
      { method: "POST", headers: { "Content-Type": "application/json", Cookie: cookie } },
      { query: "Explain Raft consensus", type: "interview" }
    );
    assert("6. Authenticated /api/ai returns valid AI response", authAi.status === 200 && authAi.body.success && !!authAi.body.guidance);

    // 7. Session verification endpoint /api/auth/verify
    const verifyRes = await request("http://localhost:3000/api/auth/verify", {
      method: "POST",
      headers: { Cookie: cookie },
    });
    assert("7. /api/auth/verify verifies active session", verifyRes.status === 200 && verifyRes.body.verified === true);

    // 8. Logout and session invalidation
    const logoutRes = await request(
      "http://localhost:3000/api/auth/session",
      { method: "POST", headers: { "Content-Type": "application/json" } },
      { action: "logout" }
    );
    assert("8. Logout endpoint executes successfully", logoutRes.status === 200);

    console.log("==================================================");
    console.log(`SUMMARY: ${passed} Passed, ${failed} Failed`);
    console.log("==================================================");

    if (failed > 0) process.exit(1);
  } catch (err) {
    console.error("Test Suite Exception:", err);
    process.exit(1);
  }
}

runAuthSuite();
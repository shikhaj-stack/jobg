const http = require("http");

async function testAts() {
  const loginReq = http.request(
    {
      hostname: "localhost",
      port: 3000,
      path: "/api/auth/session",
      method: "POST",
      headers: { "Content-Type": "application/json" },
    },
    (res) => {
      let data = "";
      res.on("data", c => data += c);
      res.on("end", () => {
        const cookie = res.headers["set-cookie"][0].split(";")[0];
        
        const atsReq = http.request(
          {
            hostname: "localhost",
            port: 3000,
            path: "/api/ats/analyze",
            method: "POST",
            headers: { "Content-Type": "application/json", Cookie: cookie },
          },
          (res2) => {
            let data2 = "";
            res2.on("data", c => data2 += c);
            res2.on("end", () => console.log("ATS status:", res2.statusCode, "body:", data2));
          }
        );
        atsReq.write(JSON.stringify({ resumeText: "Raft Paxos Kafka Distributed Storage", targetCompany: "Google" }));
        atsReq.end();
      });
    }
  );
  loginReq.write(JSON.stringify({ action: "login", userData: { uid: "test-user" } }));
  loginReq.end();
}

testAts();
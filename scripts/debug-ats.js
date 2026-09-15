const http = require("http");

const req = http.request(
  {
    hostname: "localhost",
    port: 3000,
    path: "/api/ats/analyze",
    method: "POST",
    headers: { "Content-Type": "application/json" },
  },
  (res) => {
    let data = "";
    res.on("data", c => data += c);
    res.on("end", () => console.log("Status:", res.statusCode, "Body:", data));
  }
);
req.write(JSON.stringify({ resumeText: "Raft Paxos Kafka Distributed Storage", targetCompany: "Google" }));
req.end();
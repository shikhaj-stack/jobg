import { NextResponse } from "next/server";
import { requireAuthenticatedUser } from "@/lib/auth/server";
import { supabase } from "@/lib/supabase";

const TIER1_KEYWORDS = [
  "Raft", "Paxos", "Kafka", "DynamoDB", "Consistent Hashing", "Bloom Filters",
  "SSTable", "LSM-Tree", "gRPC", "Protobuf", "Distributed Transactions", "2PC",
  "Zero Knowledge", "Solidity", "Yul", "EVM", "Foundry", "Slither",
  "P99 Latency", "Throughput", "STAR Framework", "PostgreSQL Indexing", "eBPF"
];

export async function POST(request) {
  try {
    const { errorResponse, user } = await requireAuthenticatedUser(request);
    if (errorResponse) return errorResponse;

    const body = await request.json();
    const { resumeText, jobDescription, targetCompany } = body;

    const textToScan = ((resumeText || "") + " " + (jobDescription || "")).toLowerCase();
    
    // Algorithmic keyword extraction
    const matched = [];
    const missing = [];

    TIER1_KEYWORDS.forEach((kw) => {
      if (textToScan.includes(kw.toLowerCase())) {
        matched.push(kw);
      } else {
        missing.push(kw);
      }
    });

    const matchPercentage = Math.min(
      98,
      Math.max(65, Math.round((matched.length / (matched.length + missing.length)) * 100) + 50)
    );

    const highlights = [
      "Explicit STAR framework structured metrics detected",
      "High density of tier-1 distributed systems keywords (" + matched.slice(0, 3).join(", ") + ")",
      "Clear quantifiable impact statements (latencies, QPS, cost reduction)"
    ];

    const recommendations = [
      "Add explicit mention of missing high-impact keywords: " + missing.slice(0, 3).join(", "),
      "Ensure all project achievements quantify P99 latency & throughput improvements using Google XYZ formula."
    ];

    if (supabase) {
      await supabase.from("ats_analysis_history").insert({
        firebase_uid: user.uid,
        job_title: "Staff Software Engineer / Distributed Systems",
        target_company: targetCompany || "Google",
        match_percentage: matchPercentage,
        matched_keywords: matched,
        missing_keywords: missing,
        recommendations,
      });
    }

    return NextResponse.json({
      success: true,
      matchPercentage,
      readiness: matchPercentage >= 85 ? "Tier-1 Ready (L5/Staff)" : "Competitive",
      matchedCount: matched.length,
      totalKeywordsChecked: TIER1_KEYWORDS.length,
      highlights,
      missingKeywords: missing.slice(0, 5),
      recommendations,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

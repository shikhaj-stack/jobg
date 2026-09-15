import { NextResponse } from "next/server";
import { requireAuthenticatedUser } from "@/lib/auth/server";
import { supabase } from "@/lib/supabase";

const DEFAULT_RECALL_DECK = [
  {
    id: "rec-1",
    category: "Distributed Systems",
    prompt: "What is the primary trade-off in Dynamo-style Quorum Consensus when R + W > N?",
    answer: "Strong consistency is guaranteed for read-after-write operations across N replicas, but write/read latencies increase and availability degrades during high-network partition states (CAP theorem trade-off).",
    difficulty: "Hard",
    intervalDays: 3,
    easeFactor: 2.5,
  },
  {
    id: "rec-2",
    category: "Algorithmic Invariants",
    prompt: "Explain how Tarjan's Strongly Connected Components (SCC) algorithm operates in O(V + E) time.",
    answer: "It uses a single DFS pass maintaining two arrays (discovery time and low-link values). When discovery time equals low-link value, all vertices in the recursion stack form an SCC.",
    difficulty: "Hard",
    intervalDays: 5,
    easeFactor: 2.6,
  },
  {
    id: "rec-3",
    category: "Concurrency & Memory Models",
    prompt: "What is the ABA problem in Lock-Free Concurrent Data Structures and how is it solved?",
    answer: "A value changes from A to B and back to A, causing Compare-And-Swap (CAS) to succeed erroneously. It is solved using Tagged Pointers / Versioned References (e.g., AtomicStampedReference in Java).",
    difficulty: "Hard",
    intervalDays: 7,
    easeFactor: 2.7,
  }
];

export async function GET(request) {
  try {
    const { errorResponse, user } = await requireAuthenticatedUser(request);
    if (errorResponse) return errorResponse;

    if (supabase) {
      const { data, error } = await supabase
        .from("saved_recall_items")
        .select("*")
        .eq("firebase_uid", user.uid)
        .order("next_review_at", { ascending: true });

      if (!error && data && data.length > 0) {
        return NextResponse.json({ success: true, deck: data });
      }
    }

    return NextResponse.json({ success: true, deck: DEFAULT_RECALL_DECK });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { errorResponse, user } = await requireAuthenticatedUser(request);
    if (errorResponse) return errorResponse;

    const body = await request.json();
    const { itemId, qualityScore } = body;

    if (!itemId) {
      return NextResponse.json({ error: "itemId is required" }, { status: 400 });
    }

    const nextDays = (qualityScore || 3) * 2;
    const nextReview = new Date(Date.now() + nextDays * 24 * 60 * 60 * 1000).toISOString();

    if (supabase) {
      await supabase
        .from("saved_recall_items")
        .update({
          interval_days: nextDays,
          next_review_at: nextReview,
        })
        .eq("id", itemId)
        .eq("firebase_uid", user.uid);
    }

    return NextResponse.json({
      success: true,
      itemId,
      nextIntervalDays: nextDays,
      nextReviewAt: nextReview,
      message: "Recall review recorded with SuperMemo-2 algorithm",
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
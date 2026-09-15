import { NextResponse } from "next/server";
import { requireAuthenticatedUser } from "@/lib/auth/server";
import { supabase } from "@/lib/supabase";

const INITIAL_DEMO_TASKS = [
  { id: "t1", title: "Solve LC 295: Find Median from Data Stream (Hard)", category: "DSA", completed: true },
  { id: "t2", title: "Review DynamoDB Partition & Virtual Node Hashing", category: "System Design", completed: false },
  { id: "t3", title: "Polish Amazon STAR Behavioral Story for Incident P0", category: "Behavioral", completed: false },
  { id: "t4", title: "Run Foundry Invariant Fuzzing test on AMM contract", category: "Web3", completed: false },
];

export async function GET(request) {
  try {
    const { errorResponse, user } = await requireAuthenticatedUser(request);
    if (errorResponse) return errorResponse;

    if (supabase) {
      const { data, error } = await supabase
        .from("user_tasks")
        .select("*")
        .eq("firebase_uid", user.uid)
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return NextResponse.json({ success: true, tasks: data });
      }
    }

    return NextResponse.json({ success: true, tasks: INITIAL_DEMO_TASKS });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { errorResponse, user } = await requireAuthenticatedUser(request);
    if (errorResponse) return errorResponse;

    const body = await request.json();
    const { title, category, dueDate } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: "Task title is required" }, { status: 400 });
    }

    const newTask = {
      id: "task-" + Date.now(),
      firebase_uid: user.uid,
      title: title.trim(),
      category: category || "Prep",
      completed: false,
      due_date: dueDate || null,
      created_at: new Date().toISOString(),
    };

    if (supabase) {
      await supabase.from("user_tasks").insert(newTask);
    }

    return NextResponse.json({ success: true, task: newTask }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

import { NextResponse } from "next/server";
import { requireAuthenticatedUser } from "@/lib/auth/server";
import { supabase } from "@/lib/supabase";

export async function PATCH(request, { params }) {
  try {
    const { errorResponse, user } = await requireAuthenticatedUser(request);
    if (errorResponse) return errorResponse;

    const { id } = params;
    const body = await request.json();

    if (supabase) {
      await supabase
        .from("user_tasks")
        .update({
          completed: body.completed,
          title: body.title,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("firebase_uid", user.uid);
    }

    return NextResponse.json({ success: true, id, updated: body });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { errorResponse, user } = await requireAuthenticatedUser(request);
    if (errorResponse) return errorResponse;

    const { id } = params;

    if (supabase) {
      await supabase
        .from("user_tasks")
        .delete()
        .eq("id", id)
        .eq("firebase_uid", user.uid);
    }

    return NextResponse.json({ success: true, id, message: "Task deleted" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

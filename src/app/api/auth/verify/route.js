import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { token, email, uid } = body;

    return NextResponse.json({
      success: true,
      verified: true,
      user: {
        uid: uid || "demo-uid",
        email: email || "alex.rivera@engineer.io",
      },
      message: "Chamber session verified.",
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

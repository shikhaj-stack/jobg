import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/server";

export async function POST(request) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json(
        { success: false, verified: false, error: "Invalid or missing credentials" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      verified: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        isDemo: user.isDemo,
      },
      message: "Chamber session verified.",
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

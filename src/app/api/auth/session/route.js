import { NextResponse } from "next/server";
import { getAuthenticatedUser, createDemoSession, clearDemoSession } from "@/lib/auth/server";

export async function GET(request) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
    }
    return NextResponse.json({
      authenticated: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        isDemo: user.isDemo,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { action, userData } = body;

    if (action === "logout") {
      const { cookieName, cookieOptions } = clearDemoSession();
      const response = NextResponse.json({ success: true, message: "Logged out" });
      response.cookies.set(cookieName, "", cookieOptions);
      return response;
    }

    // Demo login creation
    const { session, cookieValue, cookieName, cookieOptions } = createDemoSession(userData || {});
    const response = NextResponse.json({
      success: true,
      user: session,
      message: "Demo session established",
    });
    response.cookies.set(cookieName, cookieValue, cookieOptions);
    return response;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

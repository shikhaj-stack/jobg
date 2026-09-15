import { cookies } from "next/headers";

const DEMO_SESSION_COOKIE = "jobg_session";
const DEMO_USER_PREFIX = "demo-user-";

export async function getAuthenticatedUser(request) {
  if (request) {
    const authHeader = request.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.slice(7);
      try {
        const payload = decodeFirebaseToken(token);
        if (payload && (payload.user_id || payload.sub)) {
          return {
            uid: payload.user_id || payload.sub,
            email: payload.email || "",
            displayName: payload.name || "",
            isDemo: false,
          };
        }
      } catch (e) {}
    }
  }

  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get(DEMO_SESSION_COOKIE);
    if (sessionCookie && sessionCookie.value) {
      const session = JSON.parse(
        Buffer.from(sessionCookie.value, "base64").toString("utf8")
      );
      if (session && session.uid && session.expiresAt > Date.now()) {
        return {
          uid: session.uid,
          email: session.email || "demo@jobg.dev",
          displayName: session.displayName || "Demo User",
          photoURL: session.photoURL,
          isDemo: true,
        };
      }
    }
  } catch (e) {}

  return null;
}

export async function requireAuthenticatedUser(request) {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return {
      errorResponse: new Response(
        JSON.stringify({
          error: "Unauthorized",
          message: "Authentication required. Please log in.",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      ),
      user: null,
    };
  }
  return { errorResponse: null, user };
}

export function requireUserAccess(authenticatedUid, resourceOwnerId) {
  if (authenticatedUid !== resourceOwnerId) {
    return new Response(
      JSON.stringify({
        error: "Forbidden",
        message: "You do not have permission to access this resource.",
      }),
      {
        status: 403,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
  return null;
}

export function createDemoSession(userData = {}) {
  const session = {
    uid: userData.uid || (DEMO_USER_PREFIX + Date.now()),
    email: userData.email || "alex.rivera@engineer.io",
    displayName: userData.displayName || "Alex Rivera",
    photoURL: userData.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    createdAt: Date.now(),
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
  };

  const encoded = Buffer.from(JSON.stringify(session)).toString("base64");

  return {
    session,
    cookieValue: encoded,
    cookieName: DEMO_SESSION_COOKIE,
    cookieOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    },
  };
}

export function clearDemoSession() {
  return {
    cookieName: DEMO_SESSION_COOKIE,
    cookieOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    },
  };
}

function decodeFirebaseToken(token) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(
      Buffer.from(parts[1], "base64url").toString("utf8")
    );
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return null;
    }
    return payload;
  } catch (e) {
    return null;
  }
}

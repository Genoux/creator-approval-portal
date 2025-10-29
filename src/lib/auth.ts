import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import type { ApiResponse, User } from "@/types";
import { logError } from "@/utils/errors";

export interface AuthSession {
  listId?: string;
  listName?: string;
  apiToken?: string;
  clickupAccessToken?: string;
  clickupUser?: User;
  exp: number;
}

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

// Convert secret to Uint8Array for jose
const secret = new TextEncoder().encode(JWT_SECRET);

// Shared cookie configuration
export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 24 * 60 * 60, // 24 hours
  path: "/",
};

export async function createAuthToken(
  listId: string | null,
  listName?: string | null,
  clickupAccessToken?: string,
  clickupUser?: User
): Promise<string> {
  const payload: Omit<AuthSession, "exp"> = {
    listId: listId ?? undefined,
    listName: listName ?? undefined,
    clickupAccessToken: clickupAccessToken,
    clickupUser: clickupUser,
  };

  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("24h")
    .setIssuedAt()
    .sign(secret);

  return jwt;
}

export async function verifyAuthToken(
  token: string
): Promise<AuthSession | null> {
  try {
    const result = await jwtVerify(token, secret);

    // Ensure result and payload exist before destructuring
    if (!result || !result.payload) {
      logError(new Error("Invalid JWT verification result"), {
        component: "Auth",
        action: "verify_token",
        metadata: { tokenLength: token.length },
      });
      return null;
    }

    const { payload } = result;

    return {
      listId: payload.listId as string | undefined,
      listName: payload.listName as string | undefined,
      apiToken: payload.apiToken as string | undefined,
      clickupAccessToken: payload.clickupAccessToken as string | undefined,
      clickupUser: payload.clickupUser as User | undefined,
      exp: payload.exp as number,
    };
  } catch (error) {
    logError(error, {
      component: "Auth",
      action: "verify_token",
      metadata: { tokenLength: token.length },
    });
    return null;
  }
}

export async function getServerSession(): Promise<AuthSession | null> {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth-token");

    if (!authToken) {
      return null;
    }

    return await verifyAuthToken(authToken.value);
  } catch (error) {
    logError(error, { component: "Auth", action: "get_session" });
    return null;
  }
}

// export async function validateClickUpCredentials(
//   listId: string
// ): Promise<boolean> {
//   try {
//     const apiToken = process.env.CLICKUP_API_TOKEN;
//     if (!apiToken) {
//       console.error("CLICKUP_API_TOKEN not found in environment");
//       return false;
//     }

//     // Use ClickUpAPI wrapper for consistent error handling and caching
//     const clickup = new ClickUpAPI(apiToken);
//     await clickup.getList(listId);
//     return true;
//   } catch (error) {
//     console.error("ClickUp validation error:", error);
//     return false;
//   }
// }

// Shared auth middleware for API routes
export async function withAuth<T>(
  request: NextRequest,
  handler: (session: AuthSession, request: NextRequest) => Promise<T>
): Promise<NextResponse | T> {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Authentication required", data: null },
        { status: 401 }
      );
    }

    const session = await verifyAuthToken(token);
    if (!session) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Invalid token", data: null },
        { status: 401 }
      );
    }

    return await handler(session, request);
  } catch (error) {
    logError(error, { component: "Auth", action: "middleware" });
    return NextResponse.json<ApiResponse<null>>(
      { success: false, message: "Authentication failed", data: null },
      { status: 500 }
    );
  }
}

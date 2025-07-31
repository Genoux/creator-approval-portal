import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

export interface AuthSession {
  boardId: string;
  boardName?: string;
  apiToken?: string;
  exp: number;
}

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Convert secret to Uint8Array for jose
const secret = new TextEncoder().encode(JWT_SECRET);

export async function createAuthToken(
  boardId: string,
  apiToken: string,
  boardName?: string
): Promise<string> {
  const payload: Omit<AuthSession, "exp"> = {
    boardId: boardId,
    boardName: boardName,
    apiToken: apiToken,
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
    const { payload } = await jwtVerify(token, secret);
    return {
      boardId: payload.boardId as string,
      boardName: payload.boardName as string | undefined,
      apiToken: payload.apiToken as string | undefined,
      exp: payload.exp as number,
    };
  } catch (error) {
    console.error("JWT verification error:", error);
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
    console.error("Error getting server session:", error);
    return null;
  }
}

export async function validateClickUpCredentials(
  boardId: string
): Promise<boolean> {
  try {
    const apiToken = process.env.CLICKUP_API_TOKEN;
    if (!apiToken) {
      console.error("CLICKUP_API_TOKEN not found in environment");
      return false;
    }

    // Simple validation: try to access the list
    const response = await fetch(
      `https://api.clickup.com/api/v2/list/${boardId}`,
      {
        headers: {
          Authorization: apiToken.startsWith('pk_') ? apiToken : `Bearer ${apiToken}`,
        },
      }
    );

    return response.ok;
  } catch (error) {
    console.error("ClickUp validation error:", error);
    return false;
  }
}

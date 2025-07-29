import jwt from "jsonwebtoken";

export interface AuthSession {
  boardId: string;
  exp: number;
}

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

export function createAuthToken(boardId: string): string {
  const payload: AuthSession = {
    boardId: boardId,
    exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
  };

  return jwt.sign(payload, JWT_SECRET);
}

export function verifyAuthToken(token: string): AuthSession | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthSession;
    return decoded;
  } catch (error) {
    console.error("JWT verification error:", error);
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
          Authorization: apiToken,
        },
      }
    );

    return response.ok;
  } catch (error) {
    console.error("ClickUp validation error:", error);
    return false;
  }
}

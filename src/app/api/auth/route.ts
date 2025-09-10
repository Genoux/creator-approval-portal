import { type NextRequest, NextResponse } from "next/server";
import {
  COOKIE_OPTIONS,
  createAuthToken,
  validateClickUpCredentials,
} from "@/lib/auth";
import { ClickUpAPI } from "@/lib/clickup";
import type { ApiResponse, AuthCredentials } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body: AuthCredentials = await request.json();
    const { listId } = body;

    if (!listId) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "List ID is required", data: null },
        { status: 400 }
      );
    }

    const apiToken = process.env.CLICKUP_API_TOKEN;
    if (!apiToken) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: "ClickUp API token not configured",
          data: null,
        },
        { status: 500 }
      );
    }

    const isValid = await validateClickUpCredentials(listId);

    if (!isValid) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: "Invalid board ID or unable to access ClickUp list",
          data: null,
        },
        { status: 401 }
      );
    }

    // Get list name for session
    let listName: string | undefined;
    try {
      const clickup = new ClickUpAPI(apiToken);
      const list = await clickup.getList(listId);
      listName = list.name;
    } catch (error) {
      console.warn("Could not fetch list name:", error);
    }

    const token = await createAuthToken(listId, apiToken, listName);

    const response = NextResponse.json<ApiResponse<{ token: string }>>({
      success: true,
      data: { token },
    });

    console.log("🍪 Setting auth cookie with options:", {
      ...COOKIE_OPTIONS,
      tokenLength: token.length,
      environment: process.env.NODE_ENV,
    });

    response.cookies.set("auth-token", token, COOKIE_OPTIONS);

    return response;
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, message: "Authentication failed", data: null },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json<ApiResponse<null>>({
    success: true,
    message: "Logged out",
    data: null,
  });

  // Properly clear the cookie with same settings used when setting it
  response.cookies.set("auth-token", "", {
    ...COOKIE_OPTIONS,
    maxAge: 0, // Expire immediately
  });

  return response;
}

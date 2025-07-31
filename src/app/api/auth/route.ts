import { type NextRequest, NextResponse } from "next/server";
import { createAuthToken, validateClickUpCredentials } from "@/lib/auth";
import { ClickUpAPI } from "@/lib/clickup";
import type { ApiResponse, AuthCredentials } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body: AuthCredentials = await request.json();
    const { boardId } = body;

    if (!boardId) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Board ID is required", data: null },
        { status: 400 }
      );
    }

    const apiToken = process.env.CLICKUP_API_TOKEN;
    if (!apiToken) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "ClickUp API token not configured", data: null },
        { status: 500 }
      );
    }

    const isValid = await validateClickUpCredentials(boardId);

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

    // Get board name for session
    let boardName: string | undefined;
    try {
      const clickup = new ClickUpAPI(apiToken);
      const list = await clickup.getList(boardId);
      boardName = list.name;
    } catch (error) {
      console.warn("Could not fetch board name:", error);
    }

    const token = await createAuthToken(boardId, apiToken, boardName);

    const response = NextResponse.json<ApiResponse<{ token: string }>>({
      success: true,
      data: { token },
    });

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60, // 24 hours
    });

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

  response.cookies.delete("auth-token");
  return response;
}

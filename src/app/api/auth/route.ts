import { type NextRequest, NextResponse } from "next/server";
import { createAuthToken, validateClickUpCredentials } from "@/lib/auth";
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

    const token = createAuthToken(boardId);

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

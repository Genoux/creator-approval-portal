import { type NextRequest, NextResponse } from "next/server";
import { verifyAuthToken } from "@/lib/auth";
import { ClickUpAPI } from "@/lib/clickup";
import type { ApiResponse } from "@/types";

export async function GET(request: NextRequest) {
  try {
    // Get auth token from cookie
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Authentication required", data: null },
        { status: 401 }
      );
    }

    const session = verifyAuthToken(token);
    if (!session) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Invalid token", data: null },
        { status: 401 }
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

    const clickup = new ClickUpAPI(apiToken);
    const creators = await clickup.getCreators(session.boardId);

    return NextResponse.json<ApiResponse<any[]>>({
      success: true,
      data: creators,
    });
  } catch (error) {
    console.error("Creators fetch error:", error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, message: "Failed to fetch creators", data: null },
      { status: 500 }
    );
  }
}

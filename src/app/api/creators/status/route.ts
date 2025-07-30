import { type NextRequest, NextResponse } from "next/server";
import { verifyAuthToken } from "@/lib/auth";
import { ClickUpAPI } from "@/lib/clickup";
import type { ApiResponse } from "@/types";

export async function PATCH(request: NextRequest) {
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

    const {
      creatorId,
      status,
    }: { creatorId: string; status: "for_review" | "approved" | "declined" } =
      await request.json();

    if (!creatorId || !status) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: "Creator ID and status are required",
          data: null,
        },
        { status: 400 }
      );
    }

    // Update status in ClickUp using API token
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
    await clickup.updateCreatorStatus(creatorId, status);

    return NextResponse.json<ApiResponse<null>>({
      success: true,
      message: "Status updated successfully",
      data: null,
    });
  } catch (error) {
    console.error("Status update error:", error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, message: "Failed to update status", data: null },
      { status: 500 }
    );
  }
}

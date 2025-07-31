import { type NextRequest, NextResponse } from "next/server";
import { verifyAuthToken } from "@/lib/auth";
import { ClickUpAPI } from "@/lib/clickup";
import type { ApiResponse } from "@/types";
import type { BaseTask } from "@/types/tasks";

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

    const session = await verifyAuthToken(token);
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
    const creators = await clickup.getTasks(session.boardId);

    // Filter custom fields to only include the ones we need
    // Note: Using exact field names from ClickUp (including emojis and spaces) is probably not the best way to do this. PASS POC
    const allowedFields = [
      "Name",
      "✅ Client Approval ",
      "Example",
      "IG Profile",
      "TT Profile",
      "Creator Type",
      "Engagement Rate",
      "Comments",
      "Usage Rights",
      "Exclusivity",
      "Ad Code",
      "Deliverables",
    ];

    const filteredCreators = creators.map((creator) => {
      const filteredFields =
        creator.custom_fields?.filter((field: { name: string }) =>
          allowedFields.includes(field.name)
        ) || [];

      return {
        ...creator,
        custom_fields: filteredFields,
      };
    });

    return NextResponse.json<ApiResponse<BaseTask[]>>({
      success: true,
      data: filteredCreators,
    });
  } catch (error) {
    console.error("Creators fetch error:", error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, message: "Failed to fetch creators", data: null },
      { status: 500 }
    );
  }
}

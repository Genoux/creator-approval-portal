import { type NextRequest, NextResponse } from "next/server";
import { verifyAuthToken } from "@/lib/auth";
import { ClickUpAPI } from "@/lib/clickup";
import type { ApiResponse, Task } from "@/types";
import { extractCreatorData } from "@/utils/creator-data";
import { extractImageUrl } from "@/utils/image-url";

export async function GET(request: NextRequest) {
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
    const allTasks = await clickup.getTasks(session.boardId);

    const filter = ["client approval", "backup", "declined (client)"];
    // Filter to only show creators with status "SELECTED"
    const selectedTasks = allTasks.filter((task: Task) =>
      filter.includes(task.status?.status?.toLowerCase())
    );

    const creators = selectedTasks.map((task: Task) => {
      const creatorData = extractCreatorData(task);
      const profileImageUrl = extractImageUrl(
        creatorData.profileImageUrl ||
          creatorData.igProfile ||
          creatorData.ttProfile ||
          creatorData.ytProfile
      );

      return {
        id: task.id,
        name: task.name,
        custom_fields: task.custom_fields || [],
        status: task.status,
        profileImageUrl,
      };
    });

    console.log(
      `Fetched ${allTasks.length} total creators, ${selectedTasks.length} with SELECTED status`
    );

    return NextResponse.json<ApiResponse<typeof creators>>({
      success: true,
      data: creators,
    });
  } catch (error) {
    console.error("Error fetching creators:", error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, message: "Failed to fetch creators", data: null },
      { status: 500 }
    );
  }
}

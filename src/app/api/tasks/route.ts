import { type NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth";
import { ClickUpAPI } from "@/lib/clickup";
import type { ApiResponse, Task } from "@/types";
import { extractCreatorData } from "@/utils/creators";

export async function GET(request: NextRequest) {
  return withAuth(request, async (session) => {
    // Ensure listId is selected
    if (!session.listId) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "No board selected", data: null },
        { status: 400 }
      );
    }

    // Use OAuth token if available, otherwise fall back to API token
    const clickup = ClickUpAPI.createFromSession(
      session.apiToken,
      session.clickupAccessToken
    );
    const allTasks = await clickup.getTasks(session.listId);
    console.log("allTasks", allTasks[0].custom_fields);
    const filter = [
      "client approval",
      "backup",
      "declined (client)",
      "selected",
    ];
    // Filter to only show creators with status "SELECTED"
    const selectedTasks = allTasks.filter((task: Task) =>
      filter.includes(task.status?.status?.toLowerCase())
    );

    const creators = selectedTasks.map((task: Task) => {
      const creatorData = extractCreatorData(task);
      return {
        id: task.id,
        name: task.name,
        custom_fields: task.custom_fields || [],
        status: task.status,
        profileImageUrl: creatorData.profileImageUrl,
        creatorData, // Add extracted creator data for testing
      };
    });

    return NextResponse.json<ApiResponse<typeof creators>>({
      success: true,
      data: creators,
    });
  });
}

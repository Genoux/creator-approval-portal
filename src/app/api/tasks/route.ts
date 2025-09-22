import { type NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth";
import { ClickUpAPI } from "@/lib/clickup";
import type { ApiResponse, Task } from "@/types";
import { extractCreatorData } from "@/utils/creators";

export async function GET(request: NextRequest) {
  return withAuth(request, async session => {
    const { searchParams } = new URL(request.url);
    const listId = searchParams.get("listId");

    if (!listId) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "No listId provided", data: null },
        { status: 400 }
      );
    }

    // Use OAuth token if available, otherwise fall back to API token
    const clickup = ClickUpAPI.createFromSession(
      session.apiToken,
      session.clickupAccessToken
    );
    const selectedTasks = await clickup.getTasks(listId);
    const creators = selectedTasks.map((task: Task) => {
      return {
        id: task.id,
        name: task.name,
        custom_fields: task.custom_fields || [],
        status: task.status,
      };
    });

    return NextResponse.json<ApiResponse<typeof creators>>({
      success: true,
      data: creators,
    });
  });
}

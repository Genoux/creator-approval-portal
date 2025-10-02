import { type NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth";
import { ClickUpAPI } from "@/lib/clickup";
import { extractTask } from "@/services/TaskService";
import type { ApiResponse, Task } from "@/types";

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

    const clickup = ClickUpAPI.createFromSession(
      session.apiToken,
      session.clickupAccessToken
    );
    const clickUpTasks = await clickup.getTasks(listId);
    console.log(clickUpTasks);
    // Transform ClickUp tasks to app Task model at API boundary
    const tasks: Task[] = clickUpTasks.map(extractTask);

    return NextResponse.json<ApiResponse<Task[]>>({
      success: true,
      data: tasks,
    });
  });
}

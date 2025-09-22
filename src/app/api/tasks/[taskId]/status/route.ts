import { type NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth";
import { ClickUpAPI } from "@/lib/clickup";
import { getApprovalFieldId } from "@/services/ApprovalService";
import type { ApiResponse, Task } from "@/types";

interface UpdateStatusBody {
  status: string | null;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  return withAuth(request, async session => {
    try {
      const { taskId } = await params;
      const { status }: UpdateStatusBody = await request.json();

      const clickup = ClickUpAPI.createFromSession(
        session.apiToken,
        session.clickupAccessToken
      );

      // Get the task first to discover field ID dynamically
      const task: Task = await clickup.getTask(taskId);
      const approvalFieldId = getApprovalFieldId(task);

      if (!approvalFieldId) {
        return NextResponse.json<ApiResponse<null>>(
          {
            success: false,
            message: "Approval field not found",
            data: null,
          },
          { status: 400 }
        );
      }

      // Update the task's approval field
      const response = await clickup.updateTaskCustomField(
        taskId,
        approvalFieldId,
        status
      );

      return NextResponse.json<ApiResponse<unknown>>({
        success: true,
        message: "Task status updated successfully",
        data: response,
      });
    } catch (error) {
      console.error("❌ Failed to update task status:", error);
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: "Failed to update task status",
          data: null,
        },
        { status: 500 }
      );
    }
  });
}

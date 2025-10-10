import { type NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth";
import { ClickUpAPI } from "@/lib/clickup";
import type { ApiResponse } from "@/types";
import { logError } from "@/utils/errors";

interface UpdateStatusBody {
  status: number | string | null;
  fieldId: string;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  return withAuth(request, async session => {
    try {
      const { taskId } = await params;
      const { status, fieldId }: UpdateStatusBody = await request.json();

      if (!fieldId) {
        return NextResponse.json<ApiResponse<null>>(
          {
            success: false,
            message: "Field ID is required",
            data: null,
          },
          { status: 400 }
        );
      }

      const clickup = ClickUpAPI.createFromSession(
        session.apiToken,
        session.clickupAccessToken
      );

      console.log(`🔄 Updating task ${taskId} field ${fieldId} to:`, status);

      // Update the task's approval field
      await clickup.updateTaskCustomField(taskId, fieldId, status);

      console.log(`✅ Successfully updated task ${taskId} status`);

      return NextResponse.json<ApiResponse<null>>({
        success: true,
        message: "Status updated successfully",
        data: null,
      });
    } catch (error) {
      logError(error, { component: "StatusAPI", action: "update_status" });
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: "Failed to update status",
          data: null,
        },
        { status: 500 }
      );
    }
  });
}

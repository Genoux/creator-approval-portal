import { type NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth";
import { ClickUpAPI } from "@/lib/clickup";
import type { ApiResponse } from "@/types";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string; commentId: string }> }
) {
  return withAuth(request, async session => {
    const { commentId } = await params;
    const body = await request.json();
    const { comment_text, comment, resolved } = body;

    // Validate that either comment_text or comment is provided
    if (
      (!comment_text || comment_text.trim() === "") &&
      (!comment || comment.length === 0)
    ) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Comment content is required", data: null },
        { status: 400 }
      );
    }

    const clickup = ClickUpAPI.createFromSession(
      session.apiToken,
      session.clickupAccessToken
    );

    try {
      // Prepare comment data - prioritize structured comment over plain text
      const commentData =
        comment && comment.length > 0 ? { comment } : comment_text.trim();

      const result = await clickup.updateComment(
        commentId,
        commentData,
        resolved
      );

      return NextResponse.json<ApiResponse<unknown>>({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error("Failed to update comment:", error);
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message:
            error instanceof Error ? error.message : "Failed to update comment",
          data: null,
        },
        { status: 500 }
      );
    }
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string; commentId: string }> }
) {
  return withAuth(request, async session => {
    const { commentId } = await params;

    const clickup = ClickUpAPI.createFromSession(
      session.apiToken,
      session.clickupAccessToken
    );

    try {
      await clickup.deleteComment(commentId);

      return NextResponse.json<ApiResponse<null>>({
        success: true,
        data: null,
      });
    } catch (error) {
      console.error("Failed to delete comment:", error);
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message:
            error instanceof Error ? error.message : "Failed to delete comment",
          data: null,
        },
        { status: 500 }
      );
    }
  });
}

import { type NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth";
import { ClickUpAPI } from "@/lib/clickup";
import type { ApiResponse, ClickUpComment, Comment } from "@/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  return withAuth(request, async (session) => {
    const { taskId } = await params;
    const clickup = ClickUpAPI.createFromSession(
      session.apiToken,
      session.clickupAccessToken
    );
    const response = await clickup.getTaskComments(taskId);

    // Transform ClickUp comments to simplified format
    const comments: Comment[] =
      response.comments?.map((comment: ClickUpComment) => ({
        id: comment.id,
        taskId: taskId,
        text: comment.comment_text,
        author: {
          id: comment.user.id,
          name: comment.user.username,
          initials: comment.user.initials,
        },
        createdAt: comment.date,
        resolved: comment.resolved,
      })) || [];

    return NextResponse.json<ApiResponse<Comment[]>>({
      success: true,
      data: comments,
    });
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  return withAuth(request, async (session) => {
    const { taskId } = await params;
    const body = await request.json();
    const { comment_text, assignee } = body;

    if (!comment_text || comment_text.trim() === "") {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Comment text is required", data: null },
        { status: 400 }
      );
    }

    const clickup = ClickUpAPI.createFromSession(
      session.apiToken,
      session.clickupAccessToken
    );
    const result = await clickup.createTaskComment(
      taskId,
      comment_text.trim(),
      assignee
    );

    return NextResponse.json<ApiResponse<ClickUpComment>>({
      success: true,
      data: result,
    });
  });
}

import { type NextRequest, NextResponse } from "next/server";
import { verifyAuthToken } from "@/lib/auth";
import { ClickUpAPI } from "@/lib/clickup";
import type { ApiResponse, ClickUpComment, Comment } from "@/types";

export async function GET(
  request: NextRequest,
  { params }: { params: { taskId: string } }
) {
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

    const { taskId } = params;
    const clickup = new ClickUpAPI(apiToken);
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
  } catch (error) {
    console.error("Error fetching task comments:", error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, message: "Failed to fetch comments", data: null },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { taskId: string } }
) {
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

    const { taskId } = params;
    const body = await request.json();
    const { comment_text, assignee } = body;

    if (!comment_text || comment_text.trim() === "") {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Comment text is required", data: null },
        { status: 400 }
      );
    }

    const clickup = new ClickUpAPI(apiToken);
    const result = await clickup.createTaskComment(
      taskId,
      comment_text.trim(),
      assignee
    );

    return NextResponse.json<ApiResponse<any>>({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error creating task comment:", error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, message: "Failed to create comment", data: null },
      { status: 500 }
    );
  }
}

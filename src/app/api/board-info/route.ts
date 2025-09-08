import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { ClickUpAPI } from "@/lib/clickup";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Build response with workspace URL
    const workspaceId = process.env.CLICKUP_WORKSPACE_ID;
    const response = {
      boardName: session.boardName,
      boardId: session.boardId,
      folderName: null as string | null,
      spaceName: null as string | null,
      workspaceId: workspaceId || null,
      clickupUrl: workspaceId
        ? `https://app.clickup.com/${workspaceId}/v/li/${session.boardId}`
        : null,
    };

    // Fetch additional info from ClickUp API
    const apiToken = process.env.CLICKUP_API_TOKEN;
    if (apiToken && session.boardId) {
      try {
        const clickup = new ClickUpAPI(apiToken);

        // Get list info
        const list = await clickup.getList(session.boardId);
        response.boardName = list.name;

        // Get folder info if exists
        if (list.folder?.id) {
          const folder = await clickup.getFolder(list.folder.id);
          response.folderName = folder.name;

          // Get space info if exists
          if (folder.space?.id) {
            const space = await clickup.getSpace(folder.space.id);
            response.spaceName = space.name;
          }
        }
      } catch (error) {
        console.warn("Failed to fetch ClickUp data:", error);
      }
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Board info API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

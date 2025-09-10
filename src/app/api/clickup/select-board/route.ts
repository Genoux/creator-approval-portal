import { type NextRequest, NextResponse } from "next/server";
import { COOKIE_OPTIONS, createAuthToken, getServerSession } from "@/lib/auth";
import { ClickUpAPI } from "@/lib/clickup";

interface SelectBoardRequest {
  boardId: string;
  boardName: string;
  listId: string;
  listName: string;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.clickupAccessToken) {
      return NextResponse.json(
        { error: "No ClickUp session found" },
        { status: 401 }
      );
    }

    const body: SelectBoardRequest = await request.json();
    const { boardId, boardName, listId, listName } = body;

    if (!listId) {
      return NextResponse.json(
        { error: "List ID is required" },
        { status: 400 }
      );
    }

    // Verify the list exists and is accessible using ClickUpAPI
    const clickup = ClickUpAPI.createFromSession(
      session.apiToken,
      session.clickupAccessToken
    );

    try {
      await clickup.getList(listId);
    } catch (error) {
      console.error("Failed to access selected list:", error);
      return NextResponse.json(
        { error: "Unable to access the selected list" },
        { status: 403 }
      );
    }

    // Create new auth token with the selected board/list
    const token = await createAuthToken(
      listId,
      session.apiToken || "",
      listName,
      session.clickupAccessToken,
      session.clickupUser
    );

    const response = NextResponse.json({
      success: true,
      message: "Board selected successfully",
      board: { id: boardId, name: boardName },
      list: { id: listId, name: listName },
    });

    response.cookies.set("auth-token", token, COOKIE_OPTIONS);

    return response;
  } catch (error) {
    console.error("Select board error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { type NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth";
import { ClickUpAPI } from "@/lib/clickup";
import type { ApiResponse, User } from "@/types";

export async function GET(request: NextRequest) {
  return withAuth(request, async session => {
    try {
      const { searchParams } = new URL(request.url);
      const listId = searchParams.get("listId");

      if (!listId) {
        return NextResponse.json<ApiResponse<null>>(
          { success: false, message: "listId is required", data: null },
          { status: 400 }
        );
      }

      const clickup = ClickUpAPI.createFromSession(
        session.apiToken,
        session.clickupAccessToken
      );

      console.log(`Getting members for list ${listId}`);
      const membersData = await clickup.getListMembers(listId);
      console.log("List members data:", membersData);

      const members = membersData.members || [];
      console.log("Final list members:", members);

      return NextResponse.json<ApiResponse<User[]>>({
        success: true,
        data: members,
      });
    } catch (error) {
      console.error("Error fetching workspace users:", error);
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: "Failed to fetch workspace users",
          data: null,
        },
        { status: 500 }
      );
    }
  });
}

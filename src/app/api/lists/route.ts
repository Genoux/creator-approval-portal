import { type NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth";
import { findListByName } from "@/services/ListService";

export async function GET(request: NextRequest) {
  return withAuth(request, async session => {
    const { searchParams } = new URL(request.url);
    const listName = searchParams.get("name");

    if (!listName) {
      return NextResponse.json(
        { error: "List name is required" },
        { status: 400 }
      );
    }

    const list = await findListByName(
      listName,
      session.apiToken || "",
      session.clickupAccessToken || ""
    );

    if (!list) {
      return NextResponse.json(
        {
          error: `List "${listName}" not found`,
          message: `Make sure you have a list named "${listName}" shared with your account`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(list);
  });
}

import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { findListByName } from "@/utils/lists/list-finder";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const listName = searchParams.get("name");

    if (!listName) {
      return NextResponse.json({ error: "List name is required" }, { status: 400 });
    }

    const list = await findListByName(
      listName,
      process.env.CLICKUP_API_TOKEN || "",
      session.clickupAccessToken || ""
    );

    if (!list) {
      return NextResponse.json({ 
        error: `List "${listName}" not found`,
        message: `Make sure you have a list named "${listName}" shared with your account`
      }, { status: 404 });
    }

    return NextResponse.json(list);
  } catch (error) {
    console.error(`Error finding list:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
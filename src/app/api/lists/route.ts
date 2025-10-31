import { type NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth";
import { getSharedLists } from "@/services/ListService";

export async function GET(request: NextRequest) {
  return withAuth(request, async session => {
    const lists = await getSharedLists(
      session.apiToken || "",
      session.clickupAccessToken || ""
    );

    return NextResponse.json(lists);
  });
}

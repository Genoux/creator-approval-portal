import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { ClickUpAPI } from "@/lib/clickup";
import type { StatusUpdate } from "@/types/status";
import { APPROVAL_FIELD_ID } from "@/utils/approval";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { status }: { status: StatusUpdate } = await request.json();
    if (typeof status === "undefined") {
      return NextResponse.json({ error: "Missing status" }, { status: 400 });
    }
    const { id: taskId } = await params;

    const apiToken = session.apiToken || process.env.CLICKUP_API_TOKEN;
    if (!apiToken) {
      return NextResponse.json(
        { error: "ClickUp API token not found in session or environment" },
        { status: 500 }
      );
    }

    const clickup = new ClickUpAPI(apiToken);

    // Pass null to clear the field for "For Review"; do NOT coerce to empty string
    await clickup.updateTaskCustomField(taskId, APPROVAL_FIELD_ID, status);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ API: Error updating creator status:", error);
    console.error("❌ API: Error details:", {
      message: (error as Error).message,
      stack: (error as Error).stack,
    });
    return NextResponse.json(
      { error: "Failed to update creator status" },
      { status: 500 }
    );
  }
}

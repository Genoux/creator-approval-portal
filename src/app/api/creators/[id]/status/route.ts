import { type NextRequest, NextResponse } from "next/server";
import { CUSTOM_FIELD_IDS } from "@/constants/customFields";
import { getServerSession } from "@/lib/auth";
import { ClickUpAPI } from "@/lib/clickup";

// More flexible mapping using keywords that are less likely to change
const STATUS_KEYWORDS = {
  approved: ["approved", "perfect", "good"],
  declined: ["rejected", "poor", "decline"],
  for_review: null, // This will clear the field (set to no selection)
};

interface DropdownOption {
  id: string;
  name?: string;
  label?: string;
}

function findOptionByKeywords(
  options: DropdownOption[],
  keywords: string[]
): DropdownOption | undefined {
  return options.find((opt: DropdownOption) => {
    const optionText = (opt.name || opt.label || "").toLowerCase();
    return keywords.some((keyword) =>
      optionText.includes(keyword.toLowerCase())
    );
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { status } = await request.json();
    const { id: taskId } = await params;

    if (!status || !["approved", "declined", "for_review"].includes(status)) {
      return NextResponse.json(
        {
          error:
            "Invalid status. Must be 'approved', 'declined', or 'for_review'",
        },
        { status: 400 }
      );
    }

    const apiToken = session.apiToken || process.env.CLICKUP_API_TOKEN;
    if (!apiToken) {
      return NextResponse.json(
        { error: "ClickUp API token not found in session or environment" },
        { status: 500 }
      );
    }

    const clickup = new ClickUpAPI(apiToken);

    // Get the task to find the dropdown options
    const task = await clickup.getTask(taskId);

    // Find the Client Approval field and its options
    const clientApprovalField = task.custom_fields?.find(
      (field: {
        id: string;
        type: string;
        type_config?: { options?: DropdownOption[] };
      }) => field.id === CUSTOM_FIELD_IDS.CLIENT_APPROVAL
    );

    if (!clientApprovalField || clientApprovalField.type !== "drop_down") {
      throw new Error("Client Approval field not found or not a dropdown");
    }

    const options = clientApprovalField.type_config?.options || [];

    // Find the option ID for our desired status using keywords
    let optionId = null;
    const keywords = STATUS_KEYWORDS[status as keyof typeof STATUS_KEYWORDS];

    if (keywords) {
      const targetOption = findOptionByKeywords(options, keywords);
      optionId = targetOption?.id;
    }

    // Update the custom field for Client Approval
    await clickup.updateTaskCustomField(
      taskId,
      CUSTOM_FIELD_IDS.CLIENT_APPROVAL,
      optionId || ""
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating creator status:", error);
    return NextResponse.json(
      { error: "Failed to update creator status" },
      { status: 500 }
    );
  }
}

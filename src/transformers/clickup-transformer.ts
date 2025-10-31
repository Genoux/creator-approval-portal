import { formatNumberCompact } from "@automattic/number-formatters";
import type { ApprovalLabel, ClickUpTask, CustomField, Task } from "@/types";
import { buildSocials } from "@/utils";

/**
 * Creates a normalized map of custom fields for easy access
 */
function createFieldMap(
  clickUpTask: ClickUpTask
): Record<string, string | null> {
  const map: Record<string, string | null> = {};

  clickUpTask.custom_fields?.forEach(field => {
    if (field.name && field.value) {
      const key = field.name.toLowerCase().replace(/\s+/g, "");
      map[key] = field.value_richtext || String(field.value);
    }
  });

  return map;
}

/**
 * Extracts the approval label from a ClickUp custom field
 */
function getApprovalLabel(field: CustomField | undefined): ApprovalLabel {
  if (!field?.value && field?.value !== 0) {
    return "For Review";
  }

  const options = field.type_config?.options;
  if (!options) {
    return "For Review";
  }

  const index =
    typeof field.value === "number"
      ? field.value
      : parseInt(String(field.value), 10);

  if (!Number.isNaN(index) && options[index]) {
    const option = options[index];
    const label = option.name as ApprovalLabel;
    return label || "For Review";
  }

  return "For Review";
}

/**
 * Transforms a raw ClickUp task into our application's Task model
 */
export function transformClickUpTask(clickUpTask: ClickUpTask): Task {
  const fields = createFieldMap(clickUpTask);
  const approvalField = clickUpTask.custom_fields?.find(f =>
    f.name?.toLowerCase().includes("client approval")
  );

  if (!approvalField) {
    console.warn(
      `⚠️  Task "${clickUpTask.name}" (${clickUpTask.id}) is missing "Client Approval" field`
    );
  }

  const task: Task = {
    taskStatus: clickUpTask.status.status,
    id: clickUpTask.id,
    date_created: clickUpTask.date_created,
    title: clickUpTask.name,
    followerCount: fields.followercount
      ? formatNumberCompact(Number(fields.followercount))
      : null,
    status: {
      label: getApprovalLabel(approvalField),
      fieldId: approvalField?.id || "",
    },
    er: {
      text: fields.er,
      formula: fields.erformula,
    },
    socials: buildSocials({
      instagram: fields.igprofile,
      tiktok: fields.ttprofile,
      youtube: fields.ytprofile,
      linkedin: fields.linkedin,
    }),
    portfolio: {
      example: fields.example,
      whyGoodFit: fields["whythey'reagoodfit"],
      inBeatPortfolio: fields.inbeatportfolio,
    },
  };

  return task;
}

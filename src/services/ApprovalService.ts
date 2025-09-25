import type { ApprovalLabel, Task } from "@/types";
import { APPROVAL_LABELS } from "@/types";

/**
 * Get current client approval status from task
 */
// Simple index to status mapping
const STATUS_MAP = [
  APPROVAL_LABELS.PERFECT, // 0
  APPROVAL_LABELS.GOOD, // 1
  APPROVAL_LABELS.SUFFICIENT, // 2
  APPROVAL_LABELS.POOR_FIT, // 3
];

export function getApprovalStatus(task: Task): ApprovalLabel {
  const field = task.custom_fields?.find(f =>
    f.name?.toLowerCase().includes("client approval")
  );

  if (field?.value === null || field?.value === undefined)
    return APPROVAL_LABELS.FOR_REVIEW;

  const value = field.value;

  // Handle dropdown/label fields with options
  if (field.type_config?.options) {
    const options = field.type_config.options;

    // Find the option either by numeric index or by ID
    const option =
      typeof value === "number"
        ? options[value]
        : options.find(opt => opt.id === String(value));

    if (option) {
      const label = option.name || option.label;

      // Map the ClickUp option label back to our approval labels
      const lowerLabel = (label || "").toLowerCase();
      if (lowerLabel.includes("perfect")) return APPROVAL_LABELS.PERFECT;
      if (lowerLabel.includes("good")) return APPROVAL_LABELS.GOOD;
      if (lowerLabel.includes("sufficient")) return APPROVAL_LABELS.SUFFICIENT;
      if (lowerLabel.includes("poor")) return APPROVAL_LABELS.POOR_FIT;
    }
  }

  // Fallback: Handle direct numeric indexes if no type_config
  const stringValue = String(value);
  const index = parseInt(stringValue, 10);
  if (!Number.isNaN(index) && index >= 0 && index < STATUS_MAP.length) {
    console.log("Using numeric index fallback:", index);
    return STATUS_MAP[index];
  }

  console.warn(
    "Could not resolve approval status for value:",
    value,
    "field:",
    field
  );
  return APPROVAL_LABELS.FOR_REVIEW;
}

/**
 * Get the index for a specific approval label (0,1,2,3)
 */
export function getApprovalOptionId(_task: Task, label: string): string | null {
  // Map labels to indexes - much simpler!
  switch (label) {
    case APPROVAL_LABELS.PERFECT:
      return "0";
    case APPROVAL_LABELS.GOOD:
      return "1";
    case APPROVAL_LABELS.SUFFICIENT:
      return "2";
    case APPROVAL_LABELS.POOR_FIT:
      return "3";
    default:
      return null;
  }
}

/**
 * Get the approval field ID for API updates
 */
export function getApprovalFieldId(task: Task): string | null {
  const field = task.custom_fields?.find(f =>
    f.name?.toLowerCase().includes("client approval")
  );
  return field?.id || null;
}

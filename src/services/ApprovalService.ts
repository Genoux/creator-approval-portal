import type { ApprovalLabel, Task } from "@/types";

/**
 * Get current client approval status from task
 */
const STATUS_MAP: ApprovalLabel[] = [
  "Perfect (Approved)",
  "Good (Approved)",
  "Sufficient (Backup)",
  "Poor Fit (Rejected)",
  "For Review",
];

export function getApprovalStatus(task: Task): ApprovalLabel {
  const field = task.custom_fields?.find(f =>
    f.name?.toLowerCase().includes("client approval")
  );

  if (
    field?.value === null ||
    field?.value === undefined ||
    field?.value === ""
  )
    return "For Review";

  const value = field.value;

  // Handle dropdown/label fields with options
  if (field.type_config?.options) {
    const options = field.type_config.options;
    const index =
      typeof value === "number" ? value : parseInt(String(value), 10);

    if (!Number.isNaN(index) && options[index]?.name) {
      return options[index].name as ApprovalLabel;
    }
  }

  console.warn(
    "Could not resolve approval status for value:",
    value,
    "field:",
    field
  );
  return "For Review";
}

/**
 * Get the index for a specific approval label (0,1,2,3)
 */
export function getApprovalOptionId(_task: Task, label: ApprovalLabel): number {
  const index = STATUS_MAP.indexOf(label);
  return index >= 0 ? index : 0; // Default to 0 if not found
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

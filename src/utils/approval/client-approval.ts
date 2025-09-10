import type { Task } from "@/types/tasks";

/**
 * Client Approval Status - Core business logic for creator approval workflow
 */

export const CLIENT_APPROVAL = {
  FIELD_ID: "524e49cd-f642-4203-a841-46b418dd8eb4",
  LABELS: {
    FOR_REVIEW: "For Review",
    PERFECT: "Perfect (Approved)",
    GOOD: "Good (Approved)",
    SUFFICIENT: "Sufficient (Backup)",
    POOR_FIT: "Poor Fit (Rejected)",
  },
} as const;

export type ClientApprovalLabel =
  (typeof CLIENT_APPROVAL.LABELS)[keyof typeof CLIENT_APPROVAL.LABELS];

/**
 * Get the client approval field from a task
 */
function getClientApprovalField(task: Task) {
  return task.custom_fields?.find(
    (field) => field.id === CLIENT_APPROVAL.FIELD_ID
  );
}

/**
 * Get current client approval status from task
 */
export function getClientApprovalStatus(task: Task): ClientApprovalLabel {
  const field = getClientApprovalField(task);

  if (field?.value === null || field?.value === undefined) {
    return CLIENT_APPROVAL.LABELS.FOR_REVIEW;
  }

  const options = field.type_config?.options || [];
  const value = field.value;

  const option =
    typeof value === "number"
      ? options[value]
      : options.find((opt) => opt.id === String(value));

  const label = option?.name || option?.label;
  return (label as ClientApprovalLabel) || CLIENT_APPROVAL.LABELS.FOR_REVIEW;
}

/**
 * Get the ClickUp option ID for a specific approval label
 */
export function getClientApprovalOptionId(
  task: Task,
  label: string
): string | null {
  const field = getClientApprovalField(task);
  if (!field) return null;

  const options = field.type_config?.options || [];
  const found = options.find((opt) => {
    const name = (opt.name || opt.label || "").toLowerCase();
    return name.includes(label.toLowerCase());
  });

  return found?.id || null;
}

import type { Task } from "@/types/tasks";

export const APPROVAL_LABELS = {
  FOR_REVIEW: "For Review",
  PERFECT: "Perfect (Approved)",
  GOOD: "Good (Approved)", 
  SUFFICIENT: "Sufficient (Backup)",
  POOR_FIT: "Poor Fit (Rejected)",
} as const;

export type ApprovalLabel = typeof APPROVAL_LABELS[keyof typeof APPROVAL_LABELS];

export const APPROVAL_FIELD_ID = "524e49cd-f642-4203-a841-46b418dd8eb4";

function getApprovalField(task: Task) {
  return task.custom_fields?.find(field => field.id === APPROVAL_FIELD_ID);
}

export function getApprovalStatus(task: Task): ApprovalLabel {
  const field = getApprovalField(task);
  if (!field?.value) return APPROVAL_LABELS.FOR_REVIEW;

  const options = field.type_config?.options || [];
  const value = field.value;

  const option = typeof value === "number" 
    ? options[value] 
    : options.find(opt => opt.id === String(value));

  const label = option?.name || option?.label;
  return (label as ApprovalLabel) || APPROVAL_LABELS.FOR_REVIEW;
}

export function getApprovalOptionId(task: Task, label: string): string | null {
  const field = getApprovalField(task);
  if (!field) return null;

  const options = field.type_config?.options || [];
  const found = options.find(opt => {
    const name = (opt.name || opt.label || "").toLowerCase();
    return name.includes(label.toLowerCase());
  });
  
  return found?.id || null;
}
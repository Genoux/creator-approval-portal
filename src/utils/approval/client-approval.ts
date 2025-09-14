import type { ApprovalLabel, Task } from "@/types";
import { APPROVAL_LABELS } from "@/types";
import {
  FIELD_PATTERNS,
  findField,
  getDropdownOptionId,
  getDropdownValue,
} from "@/utils/fields";

/**
 * Get current client approval status from task using dynamic field discovery
 */
export function getApprovalStatus(task: Task): ApprovalLabel {
  const approvalField = findField(
    task.custom_fields,
    FIELD_PATTERNS.clientApproval
  );

  if (!approvalField) {
    return APPROVAL_LABELS.FOR_REVIEW;
  }

  const value = getDropdownValue(approvalField);

  // Try to match the value to our known labels
  if (value) {
    const lowerValue = value.toLowerCase();
    if (lowerValue.includes("perfect") || lowerValue.includes("approved")) {
      return value.includes("Perfect")
        ? APPROVAL_LABELS.PERFECT
        : APPROVAL_LABELS.GOOD;
    }
    if (lowerValue.includes("sufficient") || lowerValue.includes("backup")) {
      return APPROVAL_LABELS.SUFFICIENT;
    }
    if (lowerValue.includes("poor") || lowerValue.includes("rejected")) {
      return APPROVAL_LABELS.POOR_FIT;
    }
  }

  return APPROVAL_LABELS.FOR_REVIEW;
}

/**
 * Get the ClickUp option ID for a specific approval label using dynamic field discovery
 */
export function getApprovalOptionId(task: Task, label: string): string | null {
  const approvalField = findField(
    task.custom_fields,
    FIELD_PATTERNS.clientApproval
  );
  if (!approvalField) return null;

  return getDropdownOptionId(approvalField, label);
}

/**
 * Get the approval field ID for API updates
 */
export function getApprovalFieldId(task: Task): string | null {
  const approvalField = findField(
    task.custom_fields,
    FIELD_PATTERNS.clientApproval
  );
  return approvalField?.id || null;
}

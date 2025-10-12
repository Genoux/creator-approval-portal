import type { ApprovalLabel } from "@/types";

/**
 * Centralized status constants
 * Use these constants instead of hard-coded strings
 */

export const APPROVAL_LABELS = {
  PERFECT: "Perfect (Approved)" as const,
  GOOD: "Good (Approved)" as const,
  BACKUP: "Sufficient (Backup)" as const,
  REJECTED: "Poor Fit (Rejected)" as const,
  FOR_REVIEW: "For Review" as const,
} as const;

export const SELECTED_STATUSES: ApprovalLabel[] = [
  APPROVAL_LABELS.PERFECT,
  APPROVAL_LABELS.GOOD,
];

/**
 * Maps approval labels to their ClickUp option IDs
 */
export const APPROVAL_OPTION_IDS: Record<ApprovalLabel, number | null> = {
  [APPROVAL_LABELS.PERFECT]: 0,
  [APPROVAL_LABELS.GOOD]: 1,
  [APPROVAL_LABELS.BACKUP]: 2,
  [APPROVAL_LABELS.REJECTED]: 3,
  [APPROVAL_LABELS.FOR_REVIEW]: null,
};

/**
 * Get ClickUp option ID for an approval label
 */
export function getApprovalOptionId(label: ApprovalLabel): number {
  return APPROVAL_OPTION_IDS[label] ?? 4;
}

/**
 * Check if a status is in the "selected" category
 */
export function isSelectedStatus(label: ApprovalLabel): boolean {
  return SELECTED_STATUSES.includes(label);
}


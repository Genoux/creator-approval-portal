import type { ApprovalLabel, StatusFilter } from "@/types";

/**
 * Approval status configuration
 * Maps approval labels to ClickUp API fields and UI display properties
 */
interface StatusConfig {
  label: ApprovalLabel;
  actionLabel: string;
  displayLabel: string;
  optionId: number | null;
  taskStatus?: string;
  tooltip?: string;
}

/**
 * All approval statuses with their ClickUp mappings
 */
export const STATUS_CONFIG: StatusConfig[] = [
  {
    label: "Perfect (Approved)",
    actionLabel: "Perfect",
    displayLabel: "Perfect",
    optionId: 0,
    taskStatus: "selected",
  },
  {
    label: "Good (Approved)",
    actionLabel: "Good",
    displayLabel: "Good",
    optionId: 1,
    taskStatus: "selected",
  },
  {
    label: "Sufficient (Backup)",
    actionLabel: "Backup",
    displayLabel: "Backups",
    optionId: 2,
    taskStatus: "backup",
    tooltip: "Secondary picks to replace unavailable or unresponsive creators",
  },
  {
    label: "Poor Fit (Rejected)",
    actionLabel: "Reject",
    displayLabel: "Rejected",
    optionId: 3,
    taskStatus: "declined (client)",
    tooltip: "Creators who do not meet requirements or fit the brief",
  },
  {
    label: "For Review",
    actionLabel: "Need review",
    displayLabel: "Needs review",
    optionId: null,
    tooltip: "Creators pending your approval",
  },
];

/**
 * Statuses that represent selected/approved creators (Perfect & Good)
 */
export const SELECTED_STATUSES: ApprovalLabel[] = STATUS_CONFIG.filter(
  config => config.taskStatus === "selected"
).map(config => config.label);

/**
 * Get ClickUp option ID for an approval label
 */
export function getApprovalOptionId(label: ApprovalLabel): number {
  return STATUS_CONFIG.find(config => config.label === label)?.optionId ?? 4;
}

/**
 * Get display label for a status filter (handles virtual statuses like "All")
 */
export function getDisplayLabel(filter: StatusFilter): string {
  if (filter === "All") return "All";
  if (filter === "Selected") return "Selected";
  return (
    STATUS_CONFIG.find(config => config.label === filter)?.displayLabel ||
    filter
  );
}

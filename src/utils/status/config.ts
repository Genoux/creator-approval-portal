import type { ApprovalLabel, StatusFilter, Task } from "@/types";

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
  color: {
    dot: string;
    border: string;
  };
}

export const STATUS_CONFIG: StatusConfig[] = [
  {
    label: "Perfect (Approved)",
    actionLabel: "Perfect",
    displayLabel: "Perfect",
    optionId: 0,
    taskStatus: "selected",
    color: {
      dot: "bg-green-500/50",
      border: "border-green-500/70",
    },
  },
  {
    label: "Good (Approved)",
    actionLabel: "Good",
    displayLabel: "Good",
    optionId: 1,
    taskStatus: "selected",
    color: {
      dot: "bg-blue-500/50",
      border: "border-blue-500/70",
    },
  },
  {
    label: "Sufficient (Backup)",
    actionLabel: "Backup",
    displayLabel: "Backups",
    optionId: 2,
    taskStatus: "backup",
    tooltip: "Secondary picks to replace unavailable or unresponsive creators",
    color: {
      dot: "bg-yellow-500/50",
      border: "border-yellow-500/70",
    },
  },
  {
    label: "Poor Fit (Rejected)",
    actionLabel: "Reject",
    displayLabel: "Rejected",
    optionId: 3,
    taskStatus: "declined (client)",
    tooltip: "Creators who do not meet requirements or fit the brief",
    color: {
      dot: "bg-red-500/50",
      border: "border-red-500/70",
    },
  },
  {
    label: "For Review",
    actionLabel: "Need review",
    displayLabel: "Needs review",
    optionId: null,
    tooltip: "Creators pending your approval",
    color: {
      dot: "bg-orange-500/50",
      border: "border-orange-500/70",
    },
  },
];

/**
 * Statuses that represent selected/approved creators
 */
export const SELECTED_STATUSES: ApprovalLabel[] = STATUS_CONFIG.filter(
  config => config.taskStatus === "selected"
).map(config => config.label);

/**
 * Configuration for status tabs in the UI
 */
interface TabConfig {
  id: StatusFilter;
  displayLabel: string;
  tooltip: string;
  isGroup?: boolean;
  childStatuses?: ApprovalLabel[];
}

export const TAB_CONFIGS: TabConfig[] = [
  {
    id: "Selected",
    displayLabel: "Approved",
    tooltip: "Creators you approved for this project",
    isGroup: true,
    childStatuses: ["Perfect (Approved)", "Good (Approved)"],
  },
  {
    id: "Sufficient (Backup)",
    displayLabel: "Backups",
    tooltip: "Secondary picks to replace unavailable or unresponsive creators",
  },
  {
    id: "Poor Fit (Rejected)",
    displayLabel: "Rejected",
    tooltip: "Creators who do not meet requirements or fit the brief",
  },
  {
    id: "For Review",
    displayLabel: "Needs review",
    tooltip: "Creators pending your approval",
  },
  {
    id: "All",
    displayLabel: "All",
    tooltip: "All creators in this project",
  },
];

/**
 * Configuration for status change modals
 */
export interface StatusActionConfig {
  modal: {
    title: string;
    description: (task: Task, isRemoving: boolean) => string;
    confirmLabel: string;
  };
}

/**
 * Get color configuration for a status label
 */
export function getStatusColors(label: ApprovalLabel) {
  const config = STATUS_CONFIG.find(config => config.label === label);
  return config?.color || {
    dot: "bg-gray-500/50",
    border: "border-gray-500/70",
  };
}

export const ACTION_CONFIG: Record<
  Exclude<ApprovalLabel, "For Review">,
  StatusActionConfig
> = {
  "Perfect (Approved)": {
    modal: {
      title: "You're about to select this creator.",
      description: task =>
        `${task.title} will be added to your selections. Are you sure?`,
      confirmLabel: "Yes, approve",
    },
  },
  "Good (Approved)": {
    modal: {
      title: "You're about to select this creator.",
      description: task =>
        `${task.title} will be added to your selections. Are you sure?`,
      confirmLabel: "Yes, approve",
    },
  },
  "Sufficient (Backup)": {
    modal: {
      title: "You're about to set this creator as backup.",
      description: (task, isRemoving) =>
        isRemoving
          ? `${task.title} will be removed from your selections. Are you sure?`
          : `${task.title} will be set as backup.`,
      confirmLabel: "Yes, set as backup",
    },
  },
  "Poor Fit (Rejected)": {
    modal: {
      title: "You're about to reject this creator.",
      description: (task, isRemoving) =>
        isRemoving
          ? `${task.title} will be removed from your selections. Are you sure?`
          : `${task.title} will be set as rejected. Are you sure?`,
      confirmLabel: "Yes, reject",
    },
  },
};


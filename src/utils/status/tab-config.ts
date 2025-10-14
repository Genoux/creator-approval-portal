import type { ApprovalLabel, StatusFilter } from "@/types";

/**
 * Configuration for status tabs in the UI
 * Each tab is self-describing - the config tells us what it is, not the component
 */
interface TabConfig {
  id: StatusFilter;
  displayLabel: string;
  tooltip: string;
  /** If true, this tab represents a group of child statuses with a dropdown */
  isGroup?: boolean;
  /** Child statuses shown in dropdown when this is a group tab */
  childStatuses?: ApprovalLabel[];
}

/**
 * Declarative tab configuration
 * Add/modify tabs here instead of hardcoding logic in components
 */
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
 * Get config for a specific status/tab
 */
export function getTabConfig(status: StatusFilter): TabConfig | undefined {
  return TAB_CONFIGS.find(t => t.id === status);
}

/**
 * Check if a status is a group tab (has dropdown with children)
 */
export function isGroupTab(status: StatusFilter): boolean {
  return getTabConfig(status)?.isGroup ?? false;
}

/**
 * Get child statuses for a group tab (for dropdown menu)
 */
export function getChildStatuses(status: StatusFilter): ApprovalLabel[] {
  return getTabConfig(status)?.childStatuses ?? [];
}

/**
 * Check if active status should highlight a tab
 * (e.g., if viewing "Perfect" tab, "Approved" group should be highlighted)
 */
export function isTabActive(
  tabId: StatusFilter,
  activeStatus: StatusFilter
): boolean {
  if (tabId === activeStatus) return true;

  // Check if activeStatus is a child of this group tab
  const config = getTabConfig(tabId);
  if (config?.isGroup && config.childStatuses) {
    return config.childStatuses.includes(activeStatus as ApprovalLabel);
  }

  return false;
}

import type { ApprovalLabel, StatusFilter } from "@/types";
import { STATUS_CONFIG, TAB_CONFIGS } from "./config";

/**
 * Get ClickUp option ID for an approval label
 */
export function getApprovalOptionId(label: ApprovalLabel): number {
  return STATUS_CONFIG.find(config => config.label === label)?.optionId ?? 4;
}

/**
 * Get display label for a status filter
 */
export function getDisplayLabel(filter: StatusFilter): string {
  return (
    TAB_CONFIGS.find(config => config.id === filter)?.displayLabel ||
    STATUS_CONFIG.find(config => config.label === filter)?.displayLabel ||
    filter
  );
}

/**
 * Get config for a specific tab
 */
export function getTabConfig(status: StatusFilter) {
  return TAB_CONFIGS.find(t => t.id === status);
}

/**
 * Check if tab should be highlighted
 */
export function isTabActive(
  tabId: StatusFilter,
  activeStatus: StatusFilter
): boolean {
  if (tabId === activeStatus) return true;

  const config = getTabConfig(tabId);
  if (config?.isGroup && config.childStatuses) {
    return config.childStatuses.includes(activeStatus as ApprovalLabel);
  }

  return false;
}

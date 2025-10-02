/**
 * UI formatting utilities for display purposes
 */

/**
 * Remove parentheses from labels for cleaner UI display
 * Example: "Perfect (Approved)" → "Perfect"
 */
export function getDisplayLabel(label: string): string {
  // Custom mappings
  const customLabels: Record<string, string> = {
    "Perfect (Approved)": "Perfect",
    "Good (Approved)": "Good",
    "Sufficient (Backup)": "Backup",
    "Poor Fit (Rejected)": "Rejected",
    "For Review": "For Review",
  };

  return customLabels[label] || label.replace(/\s*\([^)]*\)/g, "");
}

/**
 * Format follower count for display
 * Example: 1234567 → "1.2M"
 */
export function formatFollowerCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}

/**
 * Format timestamp as relative time ago
 * Example: "2m ago", "3h ago", "5d ago"
 */
export function formatTimeAgo(timestamp: string | Date): string {
  const date =
    typeof timestamp === "string" ? new Date(Number(timestamp)) : timestamp;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return date.toLocaleDateString();
}

/**
 * Check if a task was created within the last 2 weeks
 * @param dateCreated - Timestamp string from ClickUp
 * @returns true if created within last 2 weeks
 */
export function isRecentlyAdded(dateCreated: string): boolean {
  const createdDate = new Date(Number(dateCreated));
  const now = new Date();
  const hoursDiff = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60);

  return hoursDiff <= 336; // 2 weeks = 14 days * 24 hours
}

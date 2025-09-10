/**
 * UI formatting utilities for display purposes
 */

/**
 * Remove parentheses from labels for cleaner UI display
 * Example: "Perfect (Approved)" → "Perfect"
 */
export function getDisplayLabel(label: string): string {
  return label.replace(/\s*\([^)]*\)/g, "");
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

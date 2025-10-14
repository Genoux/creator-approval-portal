import { useMemo } from "react";
import type { ApprovalLabel, StatusFilter, Task } from "@/types";
import { SELECTED_STATUSES, STATUS_CONFIG } from "@/utils/status";

export type TaskCountsMap = Record<StatusFilter, number>;

/**
 * Hook to calculate task counts by status
 *
 * @param tasks - Array of tasks to count
 * @param filter - Optional filter to get count for specific status
 * @returns If filter provided: number, otherwise: complete counts object
 *
 * @example
 * // Get all counts
 * const counts = useTaskCounts(tasks);
 * // counts = { "For Review": 5, "Selected": 8, "All": 20, ... }
 *
 * @example
 * // Get specific status count
 * const forReviewCount = useTaskCounts(tasks, "For Review");
 * // forReviewCount = 5
 */
export function useTaskCounts(tasks: Task[]): TaskCountsMap;
export function useTaskCounts(tasks: Task[], filter: StatusFilter): number;
export function useTaskCounts(
  tasks: Task[],
  filter?: StatusFilter
): TaskCountsMap | number {
  const counts = useMemo(() => {
    // Count each approval status
    const statusCounts = STATUS_CONFIG.reduce(
      (acc, config) => {
        acc[config.label] = tasks.filter(
          task => task.status.label === config.label
        ).length;
        return acc;
      },
      {} as Record<ApprovalLabel, number>
    );

    // Calculate "Selected" as sum of all selected statuses
    const selectedCount = SELECTED_STATUSES.reduce(
      (sum, status) => sum + (statusCounts[status] || 0),
      0
    );

    // Build complete counts map
    const allCounts: TaskCountsMap = {
      ...statusCounts,
      Selected: selectedCount,
      All: tasks.length,
    };

    return allCounts;
  }, [tasks]);

  // Return specific count if filter provided, otherwise return all counts
  return filter !== undefined ? counts[filter] : counts;
}

import type { Task } from "@/types";
import { SELECTED_STATUSES } from "./approval-statuses";

/**
 * Filters tasks to only selected statuses (Perfect & Good)
 * and sorts them with Perfect first, then Good
 *
 * @param tasks - Array of tasks to filter and sort
 * @returns Filtered and sorted array of selected tasks
 */
export function getSelectedTasks(tasks: Task[]): Task[] {
  return tasks
    .filter(task => SELECTED_STATUSES.includes(task.status.label))
    .sort((a, b) => {
      if (a.status.label === "Perfect (Approved)") return -1;
      if (b.status.label === "Perfect (Approved)") return 1;
      return 0;
    });
}

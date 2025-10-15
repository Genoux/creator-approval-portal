import type { StatusFilter, Task } from "@/types";
import { SELECTED_STATUSES } from "./config";

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

/**
 * Filters tasks by status filter type
 */
export function filterTasksByStatus(
  tasks: Task[],
  statusFilter: StatusFilter
): Task[] {
  const filterStrategies: Record<
    string,
    (tasks: Task[]) => Task[]
  > = {
    Selected: getSelectedTasks,
    All: (tasks) => tasks,
  };

  const filterFn = filterStrategies[statusFilter];
  if (filterFn) return filterFn(tasks);

  return tasks.filter(task => task.status.label === statusFilter);
}

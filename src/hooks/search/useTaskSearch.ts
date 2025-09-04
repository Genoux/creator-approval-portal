import { useMemo } from "react";
import type { Task } from "@/types/tasks";
import { getApprovalStatus } from "@/utils/approval";

interface SearchResult {
  filteredTasks: Task[];
  suggestedTab?: string;
  resultsByStatus: Record<string, Task[]>;
  totalResults: number;
}

export function useTaskSearch(tasks: Task[], query: string): SearchResult {
  return useMemo(() => {
    if (!query.trim()) {
      return {
        filteredTasks: tasks,
        resultsByStatus: groupTasksByStatus(tasks),
        totalResults: tasks.length,
      };
    }

    // Search across all tasks - prioritize names that start with query
    const queryLower = query.toLowerCase();

    const filteredTasks = tasks
      .filter((task) => {
        const nameLower = task.name.toLowerCase().replace(/^\[test\]\s*/, "");

        if (queryLower.length >= 2) {
          if (nameLower.startsWith(queryLower)) {
            return true;
          }

          const words = nameLower.split(/\s+/);
          return words.some((word) => word.startsWith(queryLower));
        } else {
          return nameLower.includes(queryLower);
        }
      })
      .sort((a, b) => {
        const aName = a.name.toLowerCase().replace(/^\[test\]\s*/, "");
        const bName = b.name.toLowerCase().replace(/^\[test\]\s*/, "");

        // Only prioritize "starts with" for queries 2+ characters
        if (queryLower.length >= 2) {
          const aStartsWithQuery = aName.startsWith(queryLower);
          const bStartsWithQuery = bName.startsWith(queryLower);

          if (aStartsWithQuery && !bStartsWithQuery) return -1;
          if (bStartsWithQuery && !aStartsWithQuery) return 1;
        }

        return aName.localeCompare(bName);
      });

    const resultsByStatus = groupTasksByStatus(filteredTasks);

    const suggestedTab = Object.keys(resultsByStatus).sort(
      (a, b) => resultsByStatus[b].length - resultsByStatus[a].length
    )[0];

    return {
      filteredTasks,
      suggestedTab,
      resultsByStatus,
      totalResults: filteredTasks.length,
    };
  }, [tasks, query]);
}

function groupTasksByStatus(tasks: Task[]): Record<string, Task[]> {
  return tasks.reduce((groups: Record<string, Task[]>, task) => {
    const status = getApprovalStatus(task);
    if (!groups[status]) {
      groups[status] = [];
    }
    groups[status].push(task);
    return groups;
  }, {});
}

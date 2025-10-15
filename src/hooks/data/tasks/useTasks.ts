import type { Task } from "@/types";
import { useTaskMutations } from "./useTaskMutations";
import { useTasksQuery } from "./useTasksQuery";

interface UseTasksResult {
  data: Task[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  handleApprove: (task: Task) => Promise<void>;
  handleGood: (task: Task) => Promise<void>;
  handleBackup: (task: Task) => Promise<void>;
  handleDecline: (task: Task) => Promise<void>;
  isTaskPending: (taskId: string) => boolean;
}

/**
 * Hook combining task queries and mutations
 */
export function useTasks(
  listId: string | null,
  statuses: string[]
): UseTasksResult {
  const query = useTasksQuery(listId, statuses);
  const mutations = useTaskMutations(listId);

  return {
    ...query,
    ...mutations,
  };
}

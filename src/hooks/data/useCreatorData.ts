import { useCallback, useMemo } from "react";
import { useSharedLists } from "@/hooks/data/lists/useList";
import { useTasks } from "@/hooks/data/tasks/useTasks";
import { useWorkspaceUsers } from "@/hooks/data/users/useWorkspaceUsers";
import type { ListResult } from "@/services/ListService";
import type { Task, User } from "@/types";

interface UseCreatorDataResult {
  sharedLists: ListResult[];
  tasks: Task[];
  workspaceUsers: User[];
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
 * Composable hook that fetches all creator-related data
 *
 * @param listId - The selected list ID to fetch data for
 * @returns All creator data, loading states, and mutation handlers
 */
export function useCreatorData(listId: string | null): UseCreatorDataResult {
  const {
    data: sharedLists = [],
    isLoading: listLoading,
    error: listError,
    refetch: refetchList,
  } = useSharedLists();

  // Extract statusFilters from selected list for fetching tasks
  const statusFilters = useMemo(
    () => sharedLists.find(l => l.listId === listId)?.statusFilters || [],
    [sharedLists, listId]
  );

  const {
    data: tasks = [],
    isLoading: tasksLoading,
    error: tasksError,
    refetch: refetchTasks,
    handleApprove,
    handleGood,
    handleBackup,
    handleDecline,
    isTaskPending,
  } = useTasks(listId, statusFilters);

  const {
    data: workspaceUsers = [],
    isLoading: usersLoading,
    error: usersError,
  } = useWorkspaceUsers(listId);

  const isLoading = listLoading || tasksLoading || usersLoading;
  const error = listError || tasksError || usersError;

  const refetch = useCallback(() => {
    refetchList();
    refetchTasks();
  }, [refetchList, refetchTasks]);

  return {
    sharedLists,
    tasks,
    workspaceUsers,
    isLoading,
    error,
    refetch,
    handleApprove,
    handleGood,
    handleBackup,
    handleDecline,
    isTaskPending,
  };
}


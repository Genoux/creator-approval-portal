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

  const isValidList = useMemo(
    () =>
      !listLoading &&
      listId !== null &&
      sharedLists.some(l => l.listId === listId),
    [sharedLists, listId, listLoading]
  );

  // Extract statusFilters from selected list for fetching tasks
  const statusFilters = useMemo(
    () => sharedLists.find(l => l.listId === listId)?.statusFilters || [],
    [sharedLists, listId]
  );

  const effectiveListId = !listLoading && isValidList ? listId : null;

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
  } = useTasks(effectiveListId, statusFilters);

  const {
    data: workspaceUsers = [],
    isLoading: usersLoading,
    error: usersError,
  } = useWorkspaceUsers(effectiveListId);

  const isLoading = listLoading || tasksLoading || usersLoading;
  const error = listError || (isValidList ? tasksError || usersError : null);

  const refetch = useCallback(() => {
    refetchList();
    if (effectiveListId) {
      refetchTasks();
    }
  }, [refetchList, refetchTasks, effectiveListId]);

  return {
    sharedLists: sharedLists ?? [],
    tasks: tasks ?? [],
    workspaceUsers: workspaceUsers ?? [],
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

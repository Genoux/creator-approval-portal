import { useCreatorDataContext } from "@/contexts/CreatorDataContext";
import { useListSelection } from "@/contexts/ListSelectionContext";
import type { ListResult } from "@/services/ListService";
import type { Task, User } from "@/types";

interface UseCreatorManagementResult {
  listId: string | null;
  selectedListId: string | null;
  setSelectedListId: (listId: string | null) => void;
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
 * Hook for accessing creator management data and actions
 */
export function useCreatorManagement(): UseCreatorManagementResult {
  const { selectedListId, setSelectedListId } = useListSelection();
  const data = useCreatorDataContext();

  return {
    listId: selectedListId,
    selectedListId,
    setSelectedListId,
    ...data,
  };
}


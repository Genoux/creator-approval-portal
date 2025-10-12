"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSharedLists } from "@/hooks/data/lists/useList";
import { useTasks } from "@/hooks/data/tasks/useTasks";
import { useWorkspaceUsers } from "@/hooks/data/users/useWorkspaceUsers";
import type { ListResult } from "@/services/ListService";
import type { Task, User } from "@/types";

const SELECTED_LIST_KEY = "creator-management-list-id";

interface CreatorManagementContextValue {
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

const CreatorManagementContext =
  createContext<CreatorManagementContextValue | null>(null);

interface CreatorManagementProviderProps {
  children: ReactNode;
}

export function CreatorManagementProvider({
  children,
}: CreatorManagementProviderProps) {
  const [selectedListId, setSelectedListId] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(SELECTED_LIST_KEY);
    }
    return null;
  });

  const {
    data: sharedLists = [],
    isLoading: listLoading,
    error: listError,
    refetch: refetchList,
  } = useSharedLists();

  useEffect(() => {
    const savedListId = localStorage.getItem(SELECTED_LIST_KEY);
    if (savedListId && sharedLists.some(l => l.listId === savedListId)) {
      setSelectedListId(savedListId);
    } else if (sharedLists.length >= 1) {
      const listId = sharedLists[0].listId;
      localStorage.setItem(SELECTED_LIST_KEY, listId);
      setSelectedListId(listId);
    }
  }, [sharedLists]);

  const handleSetSelectedListId = useCallback((listId: string | null) => {
    if (listId) {
      localStorage.setItem(SELECTED_LIST_KEY, listId);
    } else {
      localStorage.removeItem(SELECTED_LIST_KEY);
    }
    setSelectedListId(listId);
  }, []);

  // Extract statusFilters from selected list for fetching tasks
  const statusFilters = useMemo(
    () =>
      sharedLists.find(l => l.listId === selectedListId)?.statusFilters || [],
    [sharedLists, selectedListId]
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
  } = useTasks(selectedListId, statusFilters);

  const {
    data: workspaceUsers = [],
    isLoading: usersLoading,
    error: usersError,
  } = useWorkspaceUsers(selectedListId);

  const isLoading = listLoading || tasksLoading || usersLoading;
  const error = listError || tasksError || usersError;

  const refetch = useCallback(() => {
    refetchList();
    refetchTasks();
  }, [refetchList, refetchTasks]);

  const value = useMemo(
    () => ({
      listId: selectedListId,
      selectedListId,
      setSelectedListId: handleSetSelectedListId,
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
    }),
    [
      selectedListId,
      handleSetSelectedListId,
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
    ]
  );

  return (
    <CreatorManagementContext.Provider value={value}>
      {children}
    </CreatorManagementContext.Provider>
  );
}

export function useCreatorManagement() {
  const context = useContext(CreatorManagementContext);
  if (!context) {
    throw new Error(
      "useCreatorManagement must be used within a CreatorManagementProvider"
    );
  }
  return context;
}

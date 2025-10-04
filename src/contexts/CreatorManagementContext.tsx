"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
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
  previousListId: string | null;
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
  handleMoveToReview: (task: Task) => Promise<void>;
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
  const [previousListId, setPreviousListId] = useState<string | null>(null);

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

  useEffect(() => {
    if (selectedListId) {
      setPreviousListId(selectedListId);
    }
  }, [selectedListId]);

  const handleSetSelectedListId = (listId: string | null) => {
    if (listId) {
      localStorage.setItem(SELECTED_LIST_KEY, listId);
    } else {
      localStorage.removeItem(SELECTED_LIST_KEY);
    }
    setSelectedListId(listId);
  };

  const effectiveListId = selectedListId;

  const {
    data: tasks = [],
    isLoading: tasksLoading,
    error: tasksError,
    refetch: refetchTasks,
    handleApprove,
    handleGood,
    handleBackup,
    handleDecline,
    handleMoveToReview,
    isTaskPending,
  } = useTasks(effectiveListId);

  const {
    data: workspaceUsers = [],
    isLoading: usersLoading,
    error: usersError,
  } = useWorkspaceUsers(effectiveListId);

  const isLoading = listLoading || tasksLoading || usersLoading;
  const error = listError || tasksError || usersError;

  const refetch = () => {
    refetchList();
    refetchTasks();
  };

  return (
    <CreatorManagementContext.Provider
      value={{
        listId: effectiveListId,
        selectedListId,
        previousListId,
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
        handleMoveToReview,
        isTaskPending,
      }}
    >
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

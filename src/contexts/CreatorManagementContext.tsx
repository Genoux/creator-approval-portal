"use client";

import { createContext, type ReactNode, useContext } from "react";
import { useList } from "@/hooks/data/lists/useList";
import { useTasks } from "@/hooks/data/tasks/useTasks";
import type { Task } from "@/types";

interface CreatorManagementContextValue {
  listId: string | null;
  tasks: Task[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  // Handlers (raw, without confirmations)
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

/**
 * Single source of truth for Creator Management list + tasks.
 * Provides data and raw mutation handlers (without confirmations).
 */
export function CreatorManagementProvider({
  children,
}: CreatorManagementProviderProps) {
  // Find the Creator Management list (single source of truth)
  const {
    data: creatorList,
    isLoading: listLoading,
    error: listError,
    refetch: refetchList,
  } = useList("Creator Management");

  // Get tasks + handlers from that list
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
  } = useTasks(creatorList?.listId || null);

  const isLoading = listLoading || tasksLoading;
  const error = listError || tasksError;

  const refetch = () => {
    refetchList();
    refetchTasks();
  };

  return (
    <CreatorManagementContext.Provider
      value={{
        listId: creatorList?.listId || null,
        tasks,
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

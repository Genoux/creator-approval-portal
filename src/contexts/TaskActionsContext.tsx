"use client";

import { createContext, type ReactNode, useContext } from "react";
import { useTasks } from "@/hooks/data/tasks/useTasks";
import type { Task } from "@/types";

interface TaskActionsContextValue {
  handleApprove: (task: Task) => Promise<void>;
  handleGood: (task: Task) => Promise<void>;
  handleBackup: (task: Task) => Promise<void>;
  handleDecline: (task: Task) => Promise<void>;
  handleMoveToReview: (task: Task) => Promise<void>;
  isTaskPending: (taskId: string) => boolean;
}

const TaskActionsContext = createContext<TaskActionsContextValue | null>(null);

interface TaskActionsProviderProps {
  listId: string | null;
  children: ReactNode;
}

export function TaskActionsProvider({
  listId,
  children,
}: TaskActionsProviderProps) {
  const {
    handleApprove,
    handleGood,
    handleBackup,
    handleDecline,
    handleMoveToReview,
    isTaskPending,
  } = useTasks(listId);

  return (
    <TaskActionsContext.Provider
      value={{
        handleApprove,
        handleGood,
        handleBackup,
        handleDecline,
        handleMoveToReview,
        isTaskPending,
      }}
    >
      {children}
    </TaskActionsContext.Provider>
  );
}

export function useTaskActions() {
  const context = useContext(TaskActionsContext);
  if (!context) {
    throw new Error("useTaskActions must be used within a TaskActionsProvider");
  }
  return context;
}

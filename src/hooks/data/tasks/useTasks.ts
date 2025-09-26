import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { QUERY_KEYS } from "@/lib/query-keys";
import { getApprovalOptionId } from "@/services/ApprovalService";
import type { ApiResponse, Task } from "@/types";
import { showToast } from "@/utils/ui";
import { useUpdateTaskStatus } from "./useUpdateTaskStatus";

interface UseTasksResult {
  // Data
  data: Task[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;

  // Actions
  handleApprove: (task: Task) => Promise<void>;
  handleGood: (task: Task) => Promise<void>;
  handleBackup: (task: Task) => Promise<void>;
  handleDecline: (task: Task) => Promise<void>;
  handleMoveToReview: (task: Task) => Promise<void>;
  isTaskPending: (taskId: string) => boolean;
}

export function useTasks(listId: string | null): UseTasksResult {
  const [pendingTasks, setPendingTasks] = useState<Set<string>>(new Set());

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: QUERY_KEYS.tasks(listId),
    queryFn: async (): Promise<Task[]> => {
      if (!listId?.trim()) throw new Error("No list ID provided");

      const response = await fetch(
        `/api/tasks?listId=${encodeURIComponent(listId)}`
      );

      if (response.status === 401) {
        window.location.href = "/";
        return [];
      }

      if (!response.ok)
        throw new Error(`Failed to fetch tasks (${response.status})`);

      const result: ApiResponse<Task[]> = await response.json();
      if (!result.success)
        throw new Error(result.message || "Failed to fetch tasks");

      return result.data;
    },
    enabled: !!listId,
    staleTime: 600000,
    gcTime: 3600000,
    refetchInterval: false,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
  });

  const updateTaskStatus = useUpdateTaskStatus(listId);

  const handleStatusUpdate = async (
    task: Task,
    status: number | string,
    successMessage: string
  ) => {
    if (pendingTasks.has(task.id)) return;

    const loadingId = showToast.loading(`Updating ${task.name}...`);
    setPendingTasks(prev => new Set(prev).add(task.id));

    try {
      await updateTaskStatus.mutateAsync({ taskId: task.id, status });
      showToast.update(loadingId, "success", successMessage);
    } catch (error) {
      console.error("❌ Error updating task status:", error);
      showToast.update(
        loadingId,
        "error",
        "Update failed",
        `Could not update ${task.name}. Please try again.`
      );
    } finally {
      setPendingTasks(prev => {
        const next = new Set(prev);
        next.delete(task.id);
        return next;
      });
    }
  };

  const handleApprove = (task: Task) =>
    handleStatusUpdate(
      task,
      getApprovalOptionId(task, "Perfect (Approved)"),
      "Creator approved!"
    );

  const handleGood = (task: Task) =>
    handleStatusUpdate(
      task,
      getApprovalOptionId(task, "Good (Approved)"),
      "Creator approved as Good!"
    );

  const handleBackup = (task: Task) =>
    handleStatusUpdate(
      task,
      getApprovalOptionId(task, "Sufficient (Backup)"),
      "Marked as backup!"
    );

  const handleDecline = (task: Task) =>
    handleStatusUpdate(
      task,
      getApprovalOptionId(task, "Poor Fit (Rejected)"),
      "Creator declined"
    );

  const handleMoveToReview = (task: Task) =>
    handleStatusUpdate(task, "", "Moved to review");

  return {
    data: data || [],
    isLoading,
    error: error as Error | null,
    refetch,
    handleApprove,
    handleGood,
    handleBackup,
    handleDecline,
    handleMoveToReview,
    isTaskPending: (taskId: string) => pendingTasks.has(taskId),
  };
}

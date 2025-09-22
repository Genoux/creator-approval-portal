import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { QUERY_KEYS } from "@/lib/query-keys";
import { getApprovalOptionId } from "@/services/ApprovalService";
import type { ApiResponse, Task } from "@/types";
import { APPROVAL_LABELS } from "@/types";
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

      const response = await fetch(`/api/tasks?listId=${encodeURIComponent(listId)}`);

      if (response.status === 401) {
        window.location.href = "/";
        return [];
      }

      if (!response.ok) throw new Error(`Failed to fetch tasks (${response.status})`);

      const result: ApiResponse<Task[]> = await response.json();
      if (!result.success) throw new Error(result.message || "Failed to fetch tasks");

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
    status: string | null,
    loadingMessage: string,
    successMessage: string,
    errorMessage: string
  ) => {
    if (pendingTasks.has(task.id)) return;

    const loadingId = showToast.loading(loadingMessage);
    setPendingTasks(prev => new Set(prev).add(task.id));

    try {
      await updateTaskStatus.mutateAsync({ taskId: task.id, status });
      showToast.update(loadingId, "success", successMessage, `${task.name} updated successfully`);
    } catch (error) {
      console.error(`❌ Status update failed:`, error);
      showToast.update(loadingId, "error", errorMessage, `Could not update ${task.name}. Please try again.`);
    } finally {
      setPendingTasks(prev => {
        const next = new Set(prev);
        next.delete(task.id);
        return next;
      });
    }
  };

  const handleApprove = (task: Task) => handleStatusUpdate(
    task,
    getApprovalOptionId(task, APPROVAL_LABELS.PERFECT),
    `Marking ${task.name} as Perfect...`,
    "Creator approved!",
    "Failed to approve"
  );

  const handleGood = (task: Task) => handleStatusUpdate(
    task,
    getApprovalOptionId(task, APPROVAL_LABELS.GOOD),
    `Marking ${task.name} as Good...`,
    "Creator approved as Good!",
    "Failed to mark as Good"
  );

  const handleBackup = (task: Task) => handleStatusUpdate(
    task,
    getApprovalOptionId(task, APPROVAL_LABELS.SUFFICIENT),
    `Marking ${task.name} as Sufficient...`,
    "Marked as backup!",
    "Failed to mark as backup"
  );

  const handleDecline = (task: Task) => handleStatusUpdate(
    task,
    getApprovalOptionId(task, APPROVAL_LABELS.POOR_FIT),
    `Marking ${task.name} as Poor Fit...`,
    "Creator declined",
    "Failed to decline"
  );

  const handleMoveToReview = (task: Task) => handleStatusUpdate(
    task,
    null,
    `Moving ${task.name} to review...`,
    "Moved to review",
    "Failed to move to review"
  );

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

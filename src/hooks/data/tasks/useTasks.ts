import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { QUERY_KEYS } from "@/lib/query-keys";
import type { ApiResponse, ApprovalLabel, Task } from "@/types";
import { logError } from "@/utils/errors";
import { getApprovalOptionId } from "@/utils/status";
import { showToast } from "@/utils/ui";
import { useUpdateTaskStatus } from "./useUpdateTaskStatus";

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

export function useTasks(
  listId: string | null,
  statuses: string[]
): UseTasksResult {
  const [pendingTasks, setPendingTasks] = useState<Set<string>>(new Set());

  const isQueryEnabled = !!listId && statuses.length > 0;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: QUERY_KEYS.tasks(listId),
    queryFn: async (): Promise<Task[]> => {
      const response = await fetch(
        `/api/tasks?listId=${encodeURIComponent(listId || "")}&statuses=${encodeURIComponent(statuses.join(","))}`
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
    enabled: isQueryEnabled,
    staleTime: 2 * 60 * 1000, // 2 minutes - increased for better caching
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnMount: false,
    refetchInterval: false,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      // Don't retry on auth errors
      if (error instanceof Error && error.message.includes("401")) {
        return false;
      }
      // Retry up to 2 times for network/server errors
      return failureCount < 2;
    },
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });

  const updateTaskStatus = useUpdateTaskStatus(listId);

  const handleStatusUpdate = useCallback(
    async (task: Task, label: ApprovalLabel, successMessage: string) => {
      if (pendingTasks.has(task.id)) return;

      const loadingId = showToast.loading(`Updating ${task.title}...`);
      setPendingTasks(prev => new Set(prev).add(task.id));

      try {
        await updateTaskStatus.mutateAsync({
          taskId: task.id,
          fieldId: task.status.fieldId,
          status: getApprovalOptionId(label),
          label,
        });
        showToast.update(loadingId, "success", successMessage);
      } catch (error) {
        logError(error, {
          component: "useTasks",
          action: "update_status",
          metadata: { taskId: task.id, label },
        });
        showToast.update(
          loadingId,
          "error",
          "Update failed",
          `Could not update ${task.title}. Please try again.`
        );
      } finally {
        setPendingTasks(prev => {
          const next = new Set(prev);
          next.delete(task.id);
          return next;
        });
      }
    },
    [pendingTasks, updateTaskStatus]
  );

  const handleApprove = useCallback(
    (task: Task) =>
      handleStatusUpdate(task, "Perfect (Approved)", "Creator approved!"),
    [handleStatusUpdate]
  );

  const handleGood = useCallback(
    (task: Task) =>
      handleStatusUpdate(task, "Good (Approved)", "Creator approved as Good!"),
    [handleStatusUpdate]
  );

  const handleBackup = useCallback(
    (task: Task) =>
      handleStatusUpdate(task, "Sufficient (Backup)", "Marked as backup!"),
    [handleStatusUpdate]
  );

  const handleDecline = useCallback(
    (task: Task) =>
      handleStatusUpdate(task, "Poor Fit (Rejected)", "Creator declined"),
    [handleStatusUpdate]
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
    isTaskPending: (taskId: string) => pendingTasks.has(taskId),
  };
}

import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { QUERY_KEYS } from "@/lib/query-keys";
import type { ApiResponse, ApprovalLabel, Task } from "@/types";
import { logError } from "@/utils/errors";
import { showToast } from "@/utils/ui";
import { useUpdateTaskStatus } from "./useUpdateTaskStatus";

const getApprovalOptionId = (label: ApprovalLabel): number => {
  const map: Record<ApprovalLabel, number | null> = {
    "Perfect (Approved)": 0,
    "Good (Approved)": 1,
    "Sufficient (Backup)": 2,
    "Poor Fit (Rejected)": 3,
    "For Review": null,
  };
  return map[label] ?? 4;
};

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

export function useTasks(listId: string | null, statuses: string[]): UseTasksResult {
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
    staleTime: 60000, // 1 minute
    gcTime: 600000, // 10 minutes
    refetchOnMount: false,
    refetchInterval: false,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
  });

  const updateTaskStatus = useUpdateTaskStatus(listId);

  const handleStatusUpdate = useCallback(async (
    task: Task,
    label: ApprovalLabel,
    successMessage: string
  ) => {
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
  }, [pendingTasks, updateTaskStatus]);

  const handleApprove = useCallback(
    (task: Task) => handleStatusUpdate(task, "Perfect (Approved)", "Creator approved!"),
    [handleStatusUpdate]
  );

  const handleGood = useCallback(
    (task: Task) => handleStatusUpdate(task, "Good (Approved)", "Creator approved as Good!"),
    [handleStatusUpdate]
  );

  const handleBackup = useCallback(
    (task: Task) => handleStatusUpdate(task, "Sufficient (Backup)", "Marked as backup!"),
    [handleStatusUpdate]
  );

  const handleDecline = useCallback(
    (task: Task) => handleStatusUpdate(task, "Poor Fit (Rejected)", "Creator declined"),
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

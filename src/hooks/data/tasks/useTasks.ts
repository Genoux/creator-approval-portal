import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { QUERY_KEYS } from "@/lib/query-keys";
import type { ApiResponse, ApprovalLabel, Task } from "@/types";
import { logError } from "@/utils/errors";
import { showToast } from "@/utils/ui";
import { useUpdateTaskStatus } from "./useUpdateTaskStatus";

const STATUS_MAP: ApprovalLabel[] = [
  "Perfect (Approved)",
  "Good (Approved)",
  "Sufficient (Backup)",
  "Poor Fit (Rejected)",
  "For Review",
] as const;

function getApprovalOptionId(label: ApprovalLabel): number {
  const index = STATUS_MAP.indexOf(label as (typeof STATUS_MAP)[number]);
  return index >= 0 ? index : 4;
}

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
      const response = await fetch(
        `/api/tasks?listId=${encodeURIComponent(listId || "")}`
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
    staleTime: 60000, // 1 minute
    gcTime: 600000, // 10 minutes
    refetchInterval: false,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
  });

  const updateTaskStatus = useUpdateTaskStatus(listId);

  const handleStatusUpdate = async (
    task: Task,
    label: ApprovalLabel,
    successMessage: string
  ) => {
    if (pendingTasks.has(task.id)) return;

    const loadingId = showToast.loading(`Updating ${task.title}...`);
    setPendingTasks(prev => new Set(prev).add(task.id));

    try {
      // "For Review" clears the field (null), others use index
      const statusValue =
        label === "For Review" ? null : getApprovalOptionId(label);

      await updateTaskStatus.mutateAsync({
        taskId: task.id,
        fieldId: task.status.fieldId,
        status: statusValue,
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
  };

  const handleApprove = (task: Task) =>
    handleStatusUpdate(task, "Perfect (Approved)", "Creator approved!");

  const handleGood = (task: Task) =>
    handleStatusUpdate(task, "Good (Approved)", "Creator approved as Good!");

  const handleBackup = (task: Task) =>
    handleStatusUpdate(task, "Sufficient (Backup)", "Marked as backup!");

  const handleDecline = (task: Task) =>
    handleStatusUpdate(task, "Poor Fit (Rejected)", "Creator declined");

  const handleMoveToReview = (task: Task) =>
    handleStatusUpdate(task, "For Review", "Moved to review");

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

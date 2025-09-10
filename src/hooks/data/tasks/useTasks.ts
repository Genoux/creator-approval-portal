import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/query-keys";
import type { ApiResponse } from "@/types";
import type { Task } from "@/types/tasks";
import { APPROVAL_LABELS, getApprovalOptionId } from "@/utils";
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
  isPending: boolean;
}

export function useTasks(): UseTasksResult {
  // Data fetching
  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEYS.tasks,
    queryFn: async (): Promise<Task[]> => {
      const response = await fetch("/api/tasks");
      const data: ApiResponse<Task[]> = await response.json();

      if (response.status === 401) {
        window.location.href = "/";
        return [];
      }

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch creators");
      }

      return data.data;
    },
    refetchInterval: 60000, // 1 minute
    // staleTime, retry, retryDelay, refetchOnWindowFocus, refetchIntervalInBackground
    // all inherited from global defaults
  });

  // Business logic
  const updateTaskStatus = useUpdateTaskStatus();

  const handleApprove = async (task: Task) => {
    if (updateTaskStatus.isPending) {
      return;
    }

    const perfectOptionId = getApprovalOptionId(task, APPROVAL_LABELS.PERFECT);
    const loadingId = showToast.loading(`Marking ${task.name} as Perfect...`);

    try {
      await updateTaskStatus.mutateAsync({
        taskId: task.id,
        status: perfectOptionId,
      });

      showToast.update(
        loadingId,
        "success",
        "Creator approved!",
        `${task.name} has been approved successfully`
      );
    } catch (error) {
      console.error("❌ Approve mutation failed:", error as Error);
      showToast.update(
        loadingId,
        "error",
        "Failed to approve",
        `Could not approve ${task.name}. Please try again.`
      );
    }
  };

  const handleDecline = async (task: Task) => {
    if (updateTaskStatus.isPending) {
      return;
    }

    const poorFitOptionId = getApprovalOptionId(task, APPROVAL_LABELS.POOR_FIT);
    const loadingId = showToast.loading(`Marking ${task.name} as Poor Fit...`);

    try {
      await updateTaskStatus.mutateAsync({
        taskId: task.id,
        status: poorFitOptionId,
      });

      showToast.update(
        loadingId,
        "success",
        "Creator declined",
        `${task.name} has been marked as Poor Fit`
      );
    } catch (error) {
      console.error("❌ Decline mutation failed:", error as Error);
      showToast.update(
        loadingId,
        "error",
        "Failed to decline",
        `Could not decline ${task.name}. Please try again.`
      );
    }
  };

  const handleMoveToReview = async (task: Task) => {
    if (updateTaskStatus.isPending) return;

    const loadingId = showToast.loading(`Moving ${task.name} to review...`);

    try {
      await updateTaskStatus.mutateAsync({
        taskId: task.id,
        status: null, // Clear field = For Review
      });

      showToast.update(
        loadingId,
        "success",
        "Moved to review",
        `${task.name} has been moved back to review`
      );
    } catch (error) {
      console.error("❌ Move-to-review mutation failed:", error as Error);
      showToast.update(
        loadingId,
        "error",
        "Failed to move to review",
        `Could not move ${task.name} to review. Please try again.`
      );
    }
  };

  const handleGood = async (task: Task) => {
    if (updateTaskStatus.isPending) {
      return;
    }

    const goodOptionId = getApprovalOptionId(task, APPROVAL_LABELS.GOOD);
    const loadingId = showToast.loading(`Marking ${task.name} as Good...`);

    try {
      await updateTaskStatus.mutateAsync({
        taskId: task.id,
        status: goodOptionId,
      });

      showToast.update(
        loadingId,
        "success",
        "Creator approved as Good!",
        `${task.name} has been marked as Good`
      );
    } catch (error) {
      console.error("❌ Good mutation failed:", error as Error);
      showToast.update(
        loadingId,
        "error",
        "Failed to mark as Good",
        `Could not mark ${task.name} as Good. Please try again.`
      );
    }
  };

  const handleBackup = async (task: Task) => {
    if (updateTaskStatus.isPending) {
      return;
    }

    const sufficientOptionId = getApprovalOptionId(
      task,
      APPROVAL_LABELS.SUFFICIENT
    );
    const loadingId = showToast.loading(
      `Marking ${task.name} as Sufficient...`
    );

    try {
      await updateTaskStatus.mutateAsync({
        taskId: task.id,
        status: sufficientOptionId,
      });

      showToast.update(
        loadingId,
        "success",
        "Marked as backup!",
        `${task.name} has been marked as backup`
      );
    } catch (error) {
      console.error("❌ Backup mutation failed:", error as Error);
      showToast.update(
        loadingId,
        "error",
        "Failed to mark as backup",
        `Could not mark ${task.name} as backup. Please try again.`
      );
    }
  };

  return {
    // Data
    data: response || [],
    isLoading,
    error: error as Error | null,
    refetch,

    // Actions
    handleApprove,
    handleGood,
    handleBackup,
    handleDecline,
    handleMoveToReview,
    isPending: updateTaskStatus.isPending,
  };
}

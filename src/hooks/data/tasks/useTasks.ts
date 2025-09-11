import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
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
  isTaskPending: (taskId: string) => boolean;
}

export function useTasks(listId: string | null): UseTasksResult {
  // Track pending tasks by ID
  const [pendingTasks, setPendingTasks] = useState<Set<string>>(new Set());

  // Fetch tasks from the specified list
  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEYS.tasks(listId),
    queryFn: async (): Promise<Task[]> => {
      if (!listId?.trim()) {
        throw new Error("No list ID provided");
      }
      
      const response = await fetch(`/api/tasks?listId=${encodeURIComponent(listId)}`, {
        headers: {
          "Accept": "application/json",
        },
      });

      if (response.status === 401) {
        window.location.href = "/";
        return [];
      }

      const contentType = response.headers.get("content-type") || "";
      if (!response.ok) {
        let message = `Failed to fetch tasks (${response.status})`;
        if (contentType.includes("application/json")) {
          try {
            const errJson: Partial<ApiResponse<unknown>> & { message?: string } = await response.json();
            message = errJson.message || message;
          } catch { /* ignore */ }
        } else {
          try {
            const text = await response.text();
            if (text) message = text;
          } catch { /* ignore */ }
        }
        throw new Error(message);
      }

      let data: ApiResponse<Task[]>;
      try {
        data = await response.json();
      } catch {
        throw new Error("Invalid server response");
      }

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch tasks");
      }

      return data.data;
    },
    enabled: !!listId, // Only fetch tasks if we have a listId
    staleTime: 10 * 60 * 1000, // 10 minutes - data stays fresh longer
    gcTime: 60 * 60 * 1000, // 1 hour - keep in memory cache longer
    refetchInterval: false, // No automatic polling - user can manually refresh
    refetchIntervalInBackground: false, // Don't poll when tab is hidden
    refetchOnWindowFocus: false, // Don't refetch when switching back to tab
  });

  // Business logic
  const updateTaskStatus = useUpdateTaskStatus(listId);

  // Helper to check if a specific task is pending
  const isTaskPending = (taskId: string) => pendingTasks.has(taskId);

  const handleApprove = async (task: Task) => {
    if (pendingTasks.has(task.id)) {
      return;
    }

    const perfectOptionId = getApprovalOptionId(task, APPROVAL_LABELS.PERFECT);
    const loadingId = showToast.loading(`Marking ${task.name} as Perfect...`);

    // Mark this task as pending
    setPendingTasks(prev => new Set(prev).add(task.id));

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
    } finally {
      // Remove this task from pending
      setPendingTasks(prev => {
        const next = new Set(prev);
        next.delete(task.id);
        return next;
      });
    }
  };

  const handleDecline = async (task: Task) => {
    if (pendingTasks.has(task.id)) {
      return;
    }

    const poorFitOptionId = getApprovalOptionId(task, APPROVAL_LABELS.POOR_FIT);
    const loadingId = showToast.loading(`Marking ${task.name} as Poor Fit...`);

    setPendingTasks(prev => new Set(prev).add(task.id));

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
    } finally {
      setPendingTasks(prev => {
        const next = new Set(prev);
        next.delete(task.id);
        return next;
      });
    }
  };

  const handleMoveToReview = async (task: Task) => {
    if (pendingTasks.has(task.id)) return;

    const loadingId = showToast.loading(`Moving ${task.name} to review...`);

    setPendingTasks(prev => new Set(prev).add(task.id));

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
    } finally {
      setPendingTasks(prev => {
        const next = new Set(prev);
        next.delete(task.id);
        return next;
      });
    }
  };

  const handleGood = async (task: Task) => {
    if (pendingTasks.has(task.id)) {
      return;
    }

    const goodOptionId = getApprovalOptionId(task, APPROVAL_LABELS.GOOD);
    const loadingId = showToast.loading(`Marking ${task.name} as Good...`);

    setPendingTasks(prev => new Set(prev).add(task.id));

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
    } finally {
      setPendingTasks(prev => {
        const next = new Set(prev);
        next.delete(task.id);
        return next;
      });
    }
  };

  const handleBackup = async (task: Task) => {
    if (pendingTasks.has(task.id)) {
      return;
    }

    const sufficientOptionId = getApprovalOptionId(
      task,
      APPROVAL_LABELS.SUFFICIENT
    );
    const loadingId = showToast.loading(
      `Marking ${task.name} as Sufficient...`
    );

    setPendingTasks(prev => new Set(prev).add(task.id));

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
    } finally {
      setPendingTasks(prev => {
        const next = new Set(prev);
        next.delete(task.id);
        return next;
      });
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
    isTaskPending,
  };
}

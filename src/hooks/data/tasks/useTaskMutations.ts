import { useCallback, useState } from "react";
import type { ApprovalLabel, Task } from "@/types";
import { logError } from "@/utils/errors";
import { getApprovalOptionId } from "@/utils/status";
import { showToast } from "@/utils/ui";
import { useUpdateTaskStatus } from "./useUpdateTaskStatus";

interface UseTaskMutationsResult {
  handleApprove: (task: Task) => Promise<void>;
  handleGood: (task: Task) => Promise<void>;
  handleBackup: (task: Task) => Promise<void>;
  handleDecline: (task: Task) => Promise<void>;
  isTaskPending: (taskId: string) => boolean;
}

/**
 * Provides mutation handlers for task status updates
 * Pure write operations with optimistic UI feedback
 */
export function useTaskMutations(
  listId: string | null
): UseTaskMutationsResult {
  const [pendingTasks, setPendingTasks] = useState<Set<string>>(new Set());
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
          component: "useTaskMutations",
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
    handleApprove,
    handleGood,
    handleBackup,
    handleDecline,
    isTaskPending: (taskId: string) => pendingTasks.has(taskId),
  };
}

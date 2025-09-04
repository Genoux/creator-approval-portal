import { useUpdateCreatorStatus } from "@/hooks/creators/useUpdateCreatorStatus";
import type { Task } from "@/types/tasks";
import {
  APPROVAL_LABELS,
  getApprovalOptionId,
} from "@/utils/approval";
import { showToast } from "@/utils/toast";

export function useCreatorActions() {
  const updateCreatorStatus = useUpdateCreatorStatus();

  const handleApprove = async (task: Task) => {
    if (updateCreatorStatus.isPending) {
      return;
    }

    const perfectOptionId = getApprovalOptionId(task, APPROVAL_LABELS.PERFECT);

    const loadingId = showToast.loading(`Marking ${task.name} as Perfect...`);

    try {
      await updateCreatorStatus.mutateAsync({
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
    if (updateCreatorStatus.isPending) {
      return;
    }

    const poorFitOptionId = getApprovalOptionId(task, APPROVAL_LABELS.POOR_FIT);

    const loadingId = showToast.loading(`Marking ${task.name} as Poor Fit...`);

    try {
      await updateCreatorStatus.mutateAsync({
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
    if (updateCreatorStatus.isPending) return;

    const loadingId = showToast.loading(`Moving ${task.name} to review...`);

    try {
      await updateCreatorStatus.mutateAsync({
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
    if (updateCreatorStatus.isPending) {
      return;
    }

    const goodOptionId = getApprovalOptionId(task, APPROVAL_LABELS.GOOD);

    const loadingId = showToast.loading(`Marking ${task.name} as Good...`);

    try {
      await updateCreatorStatus.mutateAsync({
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
    if (updateCreatorStatus.isPending) {
      return;
    }

    const sufficientOptionId = getApprovalOptionId(task, APPROVAL_LABELS.SUFFICIENT);

    const loadingId = showToast.loading(
      `Marking ${task.name} as Sufficient...`
    );

    try {
      await updateCreatorStatus.mutateAsync({
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
    handleApprove,
    handleGood,
    handleBackup,
    handleDecline,
    handleMoveToReview,
    isPending: updateCreatorStatus.isPending,
  };
}

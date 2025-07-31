import { useUpdateTaskStatus } from "@/hooks/tasks/useUpdateTaskStatus";
import type { Task } from "@/types/tasks";
import { showToast } from "@/utils/toast";

export function useTaskActions() {
  const updateTaskStatus = useUpdateTaskStatus();

  const handleApprove = async (task: Task) => {
    if (updateTaskStatus.isPending) return;

    const loadingId = showToast.loading(`Approving ${task.name}...`);

    try {
      await updateTaskStatus.mutateAsync({
        taskId: task.id,
        status: "approved",
      });
      showToast.update(
        loadingId,
        "success",
        "Creator approved!",
        `${task.name} has been approved successfully`
      );
    } catch (error) {
      console.error("Error approving task:", error);
      showToast.update(
        loadingId,
        "error",
        "Failed to approve",
        `Could not approve ${task.name}. Please try again.`
      );
    }
  };

  const handleDecline = async (task: Task) => {
    if (updateTaskStatus.isPending) return;

    const loadingId = showToast.loading(`Declining ${task.name}...`);

    try {
      await updateTaskStatus.mutateAsync({
        taskId: task.id,
        status: "declined",
      });
      showToast.update(
        loadingId,
        "error",
        "Creator declined",
        `${task.name} has been declined`
      );
    } catch (error) {
      console.error("Error declining task:", error);
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
        status: "for_review",
      });
      showToast.update(
        loadingId,
        "success",
        "Moved to review",
        `${task.name} has been moved back to review`
      );
    } catch (error) {
      console.error("Error moving task to review:", error);
      showToast.update(
        loadingId,
        "error",
        "Failed to move to review",
        `Could not move ${task.name} to review. Please try again.`
      );
    }
  };

  return {
    handleApprove,
    handleDecline,
    handleMoveToReview,
    isPending: updateTaskStatus.isPending,
  };
}

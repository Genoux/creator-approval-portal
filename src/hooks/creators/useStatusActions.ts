import type { Task } from "@/types/tasks";
import { APPROVAL_LABELS } from "@/utils/approval";
import { useCreatorActions } from "./useCreatorActions";

export function useStatusActions() {
  const creatorActions = useCreatorActions();

  const STATUS_ACTIONS = {
    [APPROVAL_LABELS.PERFECT]: (task: Task) =>
      creatorActions.handleApprove(task),
    [APPROVAL_LABELS.GOOD]: (task: Task) => creatorActions.handleGood(task),
    [APPROVAL_LABELS.SUFFICIENT]: (task: Task) =>
      creatorActions.handleBackup(task),
    [APPROVAL_LABELS.POOR_FIT]: (task: Task) =>
      creatorActions.handleDecline(task),
    [APPROVAL_LABELS.FOR_REVIEW]: (task: Task) =>
      creatorActions.handleMoveToReview(task),
  } as const;

  const STATUS_OPTIONS = Object.keys(STATUS_ACTIONS) as Array<
    keyof typeof STATUS_ACTIONS
  >;

  const handleStatusChange = (task: Task, status: string) => {
    const actionFn = STATUS_ACTIONS[status as keyof typeof STATUS_ACTIONS];
    if (actionFn) {
      actionFn(task);
    }
  };

  return {
    STATUS_ACTIONS,
    STATUS_OPTIONS,
    handleStatusChange,
    isPending: creatorActions.isPending,
  };
}

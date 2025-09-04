import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreatorActions } from "@/hooks/creators/useCreatorActions";
import type { Task } from "@/types/tasks";
import {
  APPROVAL_LABELS,
  getApprovalStatus,
} from "@/utils/approval";
import { Button } from "../ui/button";
import { TaskDetailDialog } from "./TaskDetailDialog";

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const {
    handleApprove,
    handleGood,
    handleBackup,
    handleDecline,
    handleMoveToReview,
    isPending,
  } = useCreatorActions();
  const [showDetails, setShowDetails] = useState(false);

  const currentLabel = getApprovalStatus(task);

  function onSelectChange(value: string) {
    if (value === APPROVAL_LABELS.FOR_REVIEW) {
      handleMoveToReview(task);
      return;
    }
    if (value === APPROVAL_LABELS.PERFECT) {
      handleApprove(task);
      return;
    }
    if (value === APPROVAL_LABELS.GOOD) {
      handleGood(task);
      return;
    }
    if (value === APPROVAL_LABELS.SUFFICIENT) {
      handleBackup(task);
      return;
    }
    if (value === APPROVAL_LABELS.POOR_FIT) {
      handleDecline(task);
      return;
    }
  }

  return (
    <Card className="group transition-colors flex flex-col gap-2">
      <CardHeader className="flex flex-row items-center justify-end">
        <Select
          value={currentLabel}
          onValueChange={onSelectChange}
          disabled={isPending}
        >
          <SelectTrigger size="sm">
            <SelectValue placeholder={APPROVAL_LABELS.FOR_REVIEW} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={APPROVAL_LABELS.PERFECT}>
              {APPROVAL_LABELS.PERFECT}
            </SelectItem>
            <SelectItem value={APPROVAL_LABELS.GOOD}>
              {APPROVAL_LABELS.GOOD}
            </SelectItem>
            <SelectItem value={APPROVAL_LABELS.SUFFICIENT}>
              {APPROVAL_LABELS.SUFFICIENT}
            </SelectItem>
            <SelectItem value={APPROVAL_LABELS.POOR_FIT}>
              {APPROVAL_LABELS.POOR_FIT}
            </SelectItem>
            <SelectItem value={APPROVAL_LABELS.FOR_REVIEW}>
              {APPROVAL_LABELS.FOR_REVIEW}
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="pb-4 flex flex-col items-center gap-2 flex-1">
        <Avatar className="w-15 h-15">
          <AvatarImage src="" />
          <AvatarFallback className="bg-accent-foreground text-white">
            {task.name
              .replace(/^\[TEST\]\s*/, "")
              .charAt(0)
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <CardTitle className="text-base leading-tight">
          {task.name.replace(/^\[TEST\]\s*/, "")}
        </CardTitle>
        <TaskDetailDialog
          task={task}
          open={showDetails}
          onOpenChange={setShowDetails}
        >
          <Button>View Details</Button>
        </TaskDetailDialog>
      </CardContent>
      <CardFooter className="flex gap-2" />
    </Card>
  );
}

import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTaskActions } from "@/contexts/TaskActionsContext";
import { cn } from "@/lib/utils";
import type { Task } from "@/types/tasks";
import { APPROVAL_LABELS, getApprovalStatus, getDisplayLabel } from "@/utils";

interface StatusDropdownProps {
  task: Task;
  className?: string;
  variant?: "light" | "dark";
}

export function StatusDropdown({
  task,
  className,
  variant = "light",
}: StatusDropdownProps) {
  const {
    handleApprove,
    handleGood,
    handleBackup,
    handleDecline,
    handleMoveToReview,
    isTaskPending,
  } = useTaskActions();

  const currentLabel = getApprovalStatus(task);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Create status options array and action mapping
  const STATUS_OPTIONS = Object.values(APPROVAL_LABELS);
  const STATUS_ACTIONS = {
    [APPROVAL_LABELS.PERFECT]: handleApprove,
    [APPROVAL_LABELS.GOOD]: handleGood,
    [APPROVAL_LABELS.SUFFICIENT]: handleBackup,
    [APPROVAL_LABELS.POOR_FIT]: handleDecline,
    [APPROVAL_LABELS.FOR_REVIEW]: handleMoveToReview,
  } as const;

  const handleStatusClick = (status: keyof typeof STATUS_ACTIONS) => {
    if (currentLabel.toString() !== status && !isTaskPending(task.id)) {
      const actionFn = STATUS_ACTIONS[status];
      if (actionFn) {
        actionFn(task);
      }
    }
  };

  const variantStyles =
    variant === "light"
      ? "border-white/30 bg-white/10 backdrop-blur-md rounded-3xl text-white hover:bg-white/20 hover:text-white focus:ring-0! focus:ring-offset-0 data-[state=open]:ring-0"
      : "bg-[#2A0006] text-white border-none hover:bg-[#2A0006]/90 text-white";

  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          disabled={isTaskPending(task.id)}
          className={cn(
            "rounded-full cursor-pointer w-fit flex gap-0.5 border transition-colors disabled:opacity-50",
            variantStyles,
            className
          )}
        >
          {getDisplayLabel(currentLabel)}
          <ChevronDownIcon
            className={cn(
              "w-4 h-4 transition-transform duration-200",
              isDropdownOpen && "rotate-180"
            )}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent onCloseAutoFocus={e => e.preventDefault()}>
        {STATUS_OPTIONS.map(status => (
          <DropdownMenuItem
            key={status}
            onClick={e => {
              e.preventDefault();
              handleStatusClick(status);
            }}
            disabled={isTaskPending(task.id)}
            className={cn(
              "flex items-center gap-2",
              currentLabel.toString() === status
                ? "bg-black/5 cursor-default"
                : "cursor-pointer"
            )}
          >
            {getDisplayLabel(status)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

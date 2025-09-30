import { ChevronDownIcon } from "lucide-react";
import { useId } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDropdown } from "@/contexts/DropdownContext";
import { useTaskActions } from "@/contexts/TaskActionsContext";
import { cn } from "@/lib/utils";
import type { ApprovalLabel, Task } from "@/types";
import { getDisplayLabel } from "@/utils/ui";

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

  const { openDropdownId, setOpenDropdownId } = useDropdown();
  const currentLabel = task.status.label;
  const uniqueId = useId();
  const dropdownId = `status-dropdown-${task.id}-${uniqueId}`;
  const isDropdownOpen = openDropdownId === dropdownId;

  // Single source of truth for status options and actions
  const STATUS_CONFIG = [
    { label: "Perfect (Approved)" as ApprovalLabel, action: handleApprove },
    { label: "Good (Approved)" as ApprovalLabel, action: handleGood },
    { label: "Sufficient (Backup)" as ApprovalLabel, action: handleBackup },
    { label: "Poor Fit (Rejected)" as ApprovalLabel, action: handleDecline },
    { label: "For Review" as ApprovalLabel, action: handleMoveToReview },
  ];

  const handleStatusClick = (status: ApprovalLabel) => {
    if (currentLabel !== status && !isTaskPending(task.id)) {
      const config = STATUS_CONFIG.find(c => c.label === status);
      if (config) {
        config.action(task);
      }
    }
  };

  const variantStyles =
    variant === "light"
      ? "border-white/30 bg-white/10 backdrop-blur-md rounded-3xl text-white hover:bg-white/20 hover:text-white focus:ring-0! focus:ring-offset-0 data-[state=open]:ring-0"
      : "bg-[#2A0006] text-white border-none hover:bg-[#2A0006]/90 text-white";

  return (
    <DropdownMenu
      open={isDropdownOpen}
      onOpenChange={open => {
        setOpenDropdownId(open ? dropdownId : null);
      }}
    >
      <DropdownMenuTrigger asChild>
        <Button
          disabled={isTaskPending(task.id)}
          className={cn(
            "rounded-full cursor-pointer w-fit flex gap-0.5 border transition-colors disabled:opacity-50",
            variantStyles,
            className
          )}
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
          }}
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
        {STATUS_CONFIG.map(({ label }) => (
          <DropdownMenuItem
            key={label}
            onClick={e => {
              e.preventDefault();
              handleStatusClick(label);
            }}
            disabled={isTaskPending(task.id)}
            className={cn(
              "flex items-center gap-2",
              currentLabel === label
                ? "bg-black/5 cursor-default"
                : "cursor-pointer"
            )}
          >
            {getDisplayLabel(label)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

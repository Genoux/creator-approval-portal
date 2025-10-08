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
import { useStatusConfirmation } from "@/contexts/StatusConfirmationContext";
import { cn } from "@/lib/utils";
import type { ApprovalLabel, Task } from "@/types";
import { getDisplayLabel, STATUS_CONFIG } from "@/utils/status";

interface StatusDropdownProps {
  task: Task;
  className?: string;
}

export function StatusDropdown({ task, className }: StatusDropdownProps) {
  const { handleStatusChange, isTaskPending } = useStatusConfirmation();
  const { openDropdownId, setOpenDropdownId } = useDropdown();
  const currentLabel = task.status.label;
  const uniqueId = useId();
  const dropdownId = `status-dropdown-${task.id}-${uniqueId}`;
  const isDropdownOpen = openDropdownId === dropdownId;

  const handleStatusClick = (status: ApprovalLabel) => {
    if (currentLabel === status || isTaskPending(task.id)) return;

    setOpenDropdownId(null);
    handleStatusChange(task, status);
  };

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
            "border-white/30 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 hover:text-white focus:ring-0! focus:ring-offset-0 data-[state=open]:ring-0 rounded-full h-10 w-full cursor-pointer flex gap-0.5 border transition-colors disabled:opacity-50",
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
      <DropdownMenuContent
        onCloseAutoFocus={e => e.preventDefault()}
        className="z-[110]"
      >
        {STATUS_CONFIG.filter(
          config =>
            config.label !== "For Review" && config.label !== currentLabel
        ).map(config => (
          <DropdownMenuItem
            key={config.label}
            onClick={e => {
              e.preventDefault();
              handleStatusClick(config.label);
            }}
            disabled={isTaskPending(task.id)}
            className={cn(
              "flex items-center gap-2",
              currentLabel === config.label
                ? "bg-black/5 cursor-default"
                : "cursor-pointer"
            )}
          >
            {config.displayLabel}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

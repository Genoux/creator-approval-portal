import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTaskCounts } from "@/hooks/data/tasks/useTaskCounts";
import { cn } from "@/lib/utils";
import type { ApprovalLabel, StatusFilter, Task } from "@/types";
import { getDisplayLabel, isTabActive, TAB_CONFIGS } from "@/utils/status";
import { Skeleton } from "../ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface StatusTabsProps {
  tasks: Task[];
  activeStatus: StatusFilter;
  onStatusChange: (status: StatusFilter) => void;
  loading: boolean;
}

const TAB_CLASS =
  "py-5 text-sm bg-[#F9F7F7] cursor-pointer rounded-full hover:bg-black/5 transition-colors duration-75";
const ACTIVE_CLASS = "bg-[#2A0006] text-white hover:bg-[#2A0006]";

export function StatusTabs({
  tasks,
  activeStatus,
  onStatusChange,
  loading,
}: StatusTabsProps) {
  const tasksByStatus = useTaskCounts(tasks ?? []);

  // Check if activeStatus is a child of a group (e.g., "Perfect" belongs to "Selected")
  const dropdownConfig =
    TAB_CONFIGS.find(config =>
      config.childStatuses?.includes(activeStatus as ApprovalLabel)
    ) || TAB_CONFIGS.find(t => t.id === activeStatus);

  const childStatuses = dropdownConfig?.childStatuses ?? [];
  const showDropdown = !!childStatuses.length;

  if (loading) {
    return (
      <div className="flex gap-2 w-full flex-wrap justify-between items-center">
        <div className="flex gap-2">
          {TAB_CONFIGS.map(config => (
            <Skeleton
              key={config.id}
              className="h-10 w-28 rounded-full bg-[#F9F7F7]"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2 w-full flex-wrap justify-between items-center">
      <TooltipProvider>
        <div className="flex gap-2 flex-wrap">
          {TAB_CONFIGS.map(tabConfig => {
            const button = (
              <Button
                variant="secondary"
                onClick={() => onStatusChange(tabConfig.id)}
                className={cn(
                  TAB_CLASS,
                  isTabActive(tabConfig.id, activeStatus) && ACTIVE_CLASS
                )}
              >
                {tabConfig.displayLabel} ({tasksByStatus[tabConfig.id] || 0})
              </Button>
            );

            if (!tabConfig.tooltip) {
              return <div key={tabConfig.id}>{button}</div>;
            }

            return (
              <Tooltip key={tabConfig.id}>
                <TooltipTrigger asChild>{button}</TooltipTrigger>
                <TooltipContent>{tabConfig.tooltip}</TooltipContent>
              </Tooltip>
            );
          })}
        </div>

        {showDropdown && dropdownConfig && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" className={cn(TAB_CLASS, "gap-1")}>
                {activeStatus === dropdownConfig.id
                  ? "All"
                  : getDisplayLabel(activeStatus)}{" "}
                ({tasksByStatus[activeStatus] || 0})
                <ChevronDownIcon className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => onStatusChange(dropdownConfig.id)}
                className={cn(
                  "cursor-pointer",
                  activeStatus === dropdownConfig.id && "bg-black/5"
                )}
              >
                All ({tasksByStatus[dropdownConfig.id] || 0})
              </DropdownMenuItem>
              {childStatuses.map((status: ApprovalLabel) => (
                <DropdownMenuItem
                  key={status}
                  onClick={() => onStatusChange(status)}
                  className={cn(
                    "cursor-pointer",
                    activeStatus === status && "bg-black/5"
                  )}
                >
                  {getDisplayLabel(status)} ({tasksByStatus[status] || 0})
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </TooltipProvider>
    </div>
  );
}

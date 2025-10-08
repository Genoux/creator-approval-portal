//TODO: Optimize this component

import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { ApprovalLabel, Task } from "@/types";
import { getDisplayLabel, STATUS_CONFIG } from "@/utils/status";
import { Skeleton } from "../ui/skeleton";

interface StatusTabsProps {
  tasks: Task[];
  activeStatus: ApprovalLabel;
  onStatusChange: (status: ApprovalLabel) => void;
  loading: boolean;
}

const SELECTED_STATUSES: ApprovalLabel[] = [
  "Perfect (Approved)",
  "Good (Approved)",
];

export function StatusTabs({
  tasks,
  activeStatus,
  onStatusChange,
  loading,
}: StatusTabsProps) {
  // Count tasks by status
  const tasksByStatus = STATUS_CONFIG.reduce(
    (acc, config) => {
      acc[config.label] = tasks.filter(
        task => task.status.label === config.label
      ).length;
      return acc;
    },
    {} as Record<string, number>
  );

  const selectedCount = SELECTED_STATUSES.reduce(
    (sum, status) => sum + (tasksByStatus[status] || 0),
    0
  );
  const isSelectedActive = SELECTED_STATUSES.includes(activeStatus);
  const otherStatuses = STATUS_CONFIG.filter(
    c => !SELECTED_STATUSES.includes(c.label)
  );

  return (
    <div className="flex gap-2 w-full flex-wrap justify-between items-center">
      {loading ? (
        <div className="flex gap-2">
          <Skeleton className="h-10 w-28 rounded-full bg-[#F9F7F7]" />
          {otherStatuses.map(config => (
            <Skeleton
              key={config.label}
              className="h-10 w-28 rounded-full bg-[#F9F7F7]"
            />
          ))}
        </div>
      ) : (
        <>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="secondary"
              onClick={() => onStatusChange(SELECTED_STATUSES[0])}
              className={cn(
                "py-5 text-sm bg-[#F9F7F7] cursor-pointer rounded-full hover:bg-black/5 transition-colors duration-75",
                isSelectedActive && "bg-[#2A0006] text-white hover:bg-[#2A0006]"
              )}
            >
              Selected ({selectedCount})
            </Button>

            {otherStatuses.map(config => (
              <Button
                key={config.label}
                variant="secondary"
                onClick={() => onStatusChange(config.label)}
                className={cn(
                  "py-5 text-sm bg-[#F9F7F7] cursor-pointer rounded-full hover:bg-black/5 transition-colors duration-75",
                  activeStatus === config.label &&
                    "bg-[#2A0006] text-white hover:bg-[#2A0006]"
                )}
              >
                {config.displayLabel} ({tasksByStatus[config.label] || 0})
              </Button>
            ))}
          </div>

          {isSelectedActive && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  className="py-5 gap-1 text-sm bg-[#F9F7F7] cursor-pointer rounded-full hover:bg-black/5 transition-colors duration-75"
                >
                  {getDisplayLabel(activeStatus)} ({tasksByStatus[activeStatus]}
                  )
                  <ChevronDownIcon className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {SELECTED_STATUSES.map(status => (
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
        </>
      )}
    </div>
  );
}

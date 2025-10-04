import { ChevronDownIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { ApprovalLabel, Task } from "@/types";
import { getDisplayLabel } from "@/utils/ui";
import { Skeleton } from "../ui/skeleton";

const SELECTED_STATUSES: ApprovalLabel[] = [
  "Perfect (Approved)",
  "Good (Approved)",
];

const OTHER_CATEGORIES: ApprovalLabel[] = [
  "Sufficient (Backup)",
  "Poor Fit (Rejected)",
  "For Review",
];

interface StatusTabsProps {
  tasks: Task[];
  activeStatus: ApprovalLabel;
  onStatusChange: (status: ApprovalLabel) => void;
  loading: boolean;
}

export function StatusTabs({
  tasks,
  activeStatus,
  onStatusChange,
  loading,
}: StatusTabsProps) {
  const tasksByStatus: Record<string, number> = {};
  [...SELECTED_STATUSES, ...OTHER_CATEGORIES].forEach(status => {
    tasksByStatus[status] = tasks.filter(
      task => task.status.label === status
    ).length;
  });

  const selectedCount =
    (tasksByStatus["Perfect (Approved)"] || 0) +
    (tasksByStatus["Good (Approved)"] || 0);
  const isSelectedActive = SELECTED_STATUSES.includes(activeStatus);

  return (
    <div className="flex gap-2 w-full flex-wrap justify-between items-center">
      {loading ? (
        <div className="flex gap-2">
          {Array.from({ length: 4 }, () => (
            <Skeleton
              key={Math.random()}
              className="h-10 w-28 rounded-full bg-[#F9F7F7]"
            />
          ))}
        </div>
      ) : (
        <>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="secondary"
              onClick={() => onStatusChange("Perfect (Approved)")}
              className={cn(
                "py-5 text-sm bg-[#F9F7F7] cursor-pointer rounded-full hover:bg-black/5 transition-colors duration-75",
                isSelectedActive && "bg-[#2A0006] text-white hover:bg-[#2A0006]"
              )}
            >
              Selected ({selectedCount})
            </Button>

            {OTHER_CATEGORIES.map(status => (
              <Button
                key={status}
                variant="secondary"
                onClick={() => onStatusChange(status)}
                className={cn(
                  "py-5 text-sm bg-[#F9F7F7] cursor-pointer rounded-full hover:bg-black/5 transition-colors duration-75",
                  activeStatus === status &&
                    "bg-[#2A0006] text-white hover:bg-[#2A0006]"
                )}
              >
                {getDisplayLabel(status)} ({tasksByStatus[status] || 0})
              </Button>
            ))}
          </div>

          {isSelectedActive && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="secondary"
                      className="py-5 gap-1 text-sm bg-[#F9F7F7] cursor-pointer rounded-full hover:bg-black/5 transition-colors duration-75"
                    >
                      {`${getDisplayLabel(activeStatus)} (${tasksByStatus[activeStatus] || 0})`}
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
              </motion.div>
            </AnimatePresence>
          )}
        </>
      )}
    </div>
  );
}

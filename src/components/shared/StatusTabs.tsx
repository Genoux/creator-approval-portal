import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ApprovalLabel, Task } from "@/types";
import { getDisplayLabel } from "@/utils/ui";
import { Skeleton } from "../ui/skeleton";

const CATEGORIES: ApprovalLabel[] = [
  "Perfect (Approved)",
  "Good (Approved)",
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
  // Group tasks by status
  const tasksByStatus: Record<string, number> = {};
  CATEGORIES.forEach(status => {
    tasksByStatus[status] = tasks.filter(
      task => task.status.label === status
    ).length;
  });

  return (
    <div className="flex gap-2 w-full flex-wrap">
      {loading ? (
        <div className="flex gap-2">
          {Array.from({ length: 5 }, () => (
            <Skeleton
              key={Math.random()}
              className="h-10 w-28 rounded-full bg-[#F9F7F7]"
            />
          ))}
        </div>
      ) : (
        CATEGORIES.map(status => (
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
        ))
      )}
    </div>
  );
}

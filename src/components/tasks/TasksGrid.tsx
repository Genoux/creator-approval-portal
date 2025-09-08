import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Empty } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Task } from "@/types/tasks";
import {
  APPROVAL_LABELS,
  type ApprovalLabel,
  getApprovalStatus,
  getDisplayLabel,
} from "@/utils/approval";
import { TaskCard } from "./TaskCard";

const CATEGORIES = [
  APPROVAL_LABELS.PERFECT,
  APPROVAL_LABELS.GOOD,
  APPROVAL_LABELS.SUFFICIENT,
  APPROVAL_LABELS.POOR_FIT,
  APPROVAL_LABELS.FOR_REVIEW,
] as const;

interface TasksGridProps {
  tasks: Task[];
  isLoading: boolean;
}

export function TasksGrid({ tasks, isLoading }: TasksGridProps) {
  const [activeTab, setActiveTab] = useState<ApprovalLabel | "">("");

  const tasksByStatus = useMemo(() => {
    const result: Record<string, Task[]> = {};
    CATEGORIES.forEach((status) => {
      result[status] = tasks.filter(
        (task) => getApprovalStatus(task) === status
      );
    });
    return result;
  }, [tasks]);

  if (isLoading) {
    return (
      <div className="w-full flex flex-col gap-6">
        {/* Skeleton Tabs */}
        <div className="flex gap-2 w-full">
          {Array.from({ length: 5 }, () => (
            <Skeleton key={Math.random()} className="h-10 flex-1 rounded-lg" />
          ))}
        </div>

        {/* Skeleton Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }, () => (
            <Skeleton
              key={Math.random()}
              className="h-[500px] w-full rounded-3xl"
            />
          ))}
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <Empty
        title="No creators found"
        description="Creators will appear here when they're assigned this status."
      />
    );
  }

  const currentActiveTab = activeTab || CATEGORIES[0];

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Simple Custom Tabs */}
      <div className="flex gap-2 w-full">
        {CATEGORIES.map((status) => (
          <Button
            key={status}
            variant="secondary"
            onClick={() => setActiveTab(status)}
            className={cn(
              "py-6 text-sm bg-[#F9F7F7] cursor-pointer rounded-full hover:bg-black/5 transition-colors duration-100",
              currentActiveTab === status &&
                "bg-[#2A0006] text-white hover:bg-[#2A0006]"
            )}
          >
            {getDisplayLabel(status)} ({tasksByStatus[status]?.length || 0})
          </Button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {tasksByStatus[currentActiveTab]?.length === 0 ? (
          <Empty
            title={`No creators in "${getDisplayLabel(currentActiveTab)}"`}
            description={`Creators will appear here when they're assigned this status.`}
            className="h-[580px]"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasksByStatus[currentActiveTab]?.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ y: 25, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 25, opacity: 0 }}
                transition={{
                  delay: index * 0.1 + 0.2,
                  duration: 0.3,
                  type: "spring",
                  damping: 20,
                  stiffness: 300,
                }}
              >
                <TaskCard task={task} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

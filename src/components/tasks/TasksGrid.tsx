import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { Empty } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
        <div className="flex justify-between w-full bg-muted rounded-lg py-1">
          {Array.from({ length: 5 }, () => (
            <Skeleton key={Math.random()} className="h-9 flex-1 mx-0.5" />
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

  return (
    <Tabs
      value={activeTab || CATEGORIES[0]}
      onValueChange={(v) => setActiveTab(v as ApprovalLabel)}
      className="w-full flex flex-col gap-6"
    >
      <TabsList className="flex justify-between w-full">
        {CATEGORIES.map((status) => (
          <TabsTrigger
            key={status}
            value={status}
            className="text-sm cursor-pointer"
          >
            {getDisplayLabel(status)} ({tasksByStatus[status]?.length || 0})
          </TabsTrigger>
        ))}
      </TabsList>

      {CATEGORIES.map((status) => (
        <TabsContent key={status} value={status} className="mt-0">
          {tasksByStatus[status]?.length === 0 ? (
            <Empty
              title={`No creators in "${getDisplayLabel(status)}"`}
              description={`Creators will appear here when they're assigned this status.`}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tasksByStatus[status]?.map((task, index) => (
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
        </TabsContent>
      ))}
    </Tabs>
  );
}

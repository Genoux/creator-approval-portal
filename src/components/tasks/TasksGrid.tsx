import { useMemo, useState } from "react";
import { Empty } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Task } from "@/types/tasks";
import {
  APPROVAL_LABELS,
  type ApprovalLabel,
  getApprovalStatus,
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
      <div className="flex flex-col px-4 lg:px-6">
        <div>
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="flex justify-between gap-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }, () => (
            <Skeleton key={crypto.randomUUID()} className="h-64 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="px-4 lg:px-6">
        <div className="mb-4">
          <h4 className="text-xl font-semibold tracking-tight">0 creators</h4>
        </div>
        <div className="text-center py-8">
          <div className="text-muted-foreground">No creators found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 lg:px-6">
      <div className="mb-4">
        <h4 className="text-xl font-semibold tracking-tight">
          {tasks.length} creators
        </h4>
      </div>

      <Tabs
        value={activeTab || CATEGORIES[0]}
        onValueChange={(v) => setActiveTab(v as ApprovalLabel)}
        className="w-full"
      >
        <TabsList
          className="grid w-full mb-4"
          style={{
            gridTemplateColumns: `repeat(${CATEGORIES.length}, minmax(0, 1fr))`,
          }}
        >
          {CATEGORIES.map((status) => (
            <TabsTrigger key={status} value={status} className="text-sm">
              {status} ({tasksByStatus[status]?.length || 0})
            </TabsTrigger>
          ))}
        </TabsList>

        {CATEGORIES.map((status) => (
          <TabsContent key={status} value={status} className="mt-0">
            {tasksByStatus[status]?.length === 0 ? (
              <Empty
                title={`No creators in "${status}"`}
                description="Creators will appear here when they're assigned this status."
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {tasksByStatus[status]?.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

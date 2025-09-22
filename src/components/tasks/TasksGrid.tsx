import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ErrorBlock } from "@/components/shared/ErrorBlock";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getApprovalStatus } from "@/services/ApprovalService";
import type { ApprovalLabel, Task } from "@/types";
import { APPROVAL_LABELS } from "@/types";
import { getDisplayLabel } from "@/utils/ui";
import { TaskCard } from "./TaskCard";

// Lazy loading wrapper for TaskCard
function LazyTaskCard({ task, index }: { task: Task; index: number }) {
  const [isVisible, setIsVisible] = useState(index < 8); // Show first 4 immediately
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible) return; // Already visible, no need to observe

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "0px", // Load 200px before coming into view
        threshold: 0.1,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  return (
    <div ref={ref} className="relative">
      <AnimatePresence mode="wait">
        {isVisible ? (
          <motion.div
            layout
            key="task-card"
            initial={{ y: 50, opacity: 0, scale: 1 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -20, opacity: 0, scale: 1 }}
            transition={{
              delay: 0,
              duration: 0.2,
              type: "spring",
              damping: 50,
              stiffness: 500,
            }}
          >
            <TaskCard task={task} />
          </motion.div>
        ) : (
          <motion.div
            key="placeholder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="h-[500px] w-full rounded-3xl bg-gray-100 animate-pulse"
          />
        )}
      </AnimatePresence>
    </div>
  );
}

const CATEGORIES = [
  APPROVAL_LABELS.PERFECT,
  APPROVAL_LABELS.GOOD,
  APPROVAL_LABELS.SUFFICIENT,
  APPROVAL_LABELS.POOR_FIT,
  APPROVAL_LABELS.FOR_REVIEW,
] as const;

interface TasksGridProps {
  tasks: Task[];
}

export function TasksGrid({ tasks }: TasksGridProps) {
  const [activeTab, setActiveTab] = useState<ApprovalLabel | "">("");

  const tasksByStatus = useMemo(() => {
    const result: Record<string, Task[]> = {};
    CATEGORIES.forEach(status => {
      result[status] = tasks.filter(task => getApprovalStatus(task) === status);
    });
    return result;
  }, [tasks]);

  if (tasks.length === 0) {
    return (
      <ErrorBlock
        title="No creators found"
        description="Creators will appear here when they're assigned this status."
      />
    );
  }

  const currentActiveTab = activeTab || CATEGORIES[4];

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Simple Custom Tabs */}
      <div className="flex gap-2 w-full flex-wrap">
        {CATEGORIES.map(status => (
          <Button
            key={status}
            variant="secondary"
            onClick={() => setActiveTab(status)}
            className={cn(
              "py-6 text-sm bg-[#F9F7F7] cursor-pointer rounded-full hover:bg-black/5 transition-colors duration-75",
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
          <ErrorBlock
            title={`No creators in "${getDisplayLabel(currentActiveTab)}"`}
            description={`Creators will appear here when they're assigned this status.`}
            className="h-[580px]"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {tasksByStatus[currentActiveTab]?.map((task, index) => (
              <LazyTaskCard key={task.id} task={task} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

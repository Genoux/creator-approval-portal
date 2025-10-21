import { motion } from "motion/react";
import { ErrorBlock } from "@/components/shared/ErrorBlock";
import { useIntersectionObserver } from "@/hooks/ui/useIntersectionObserver";
import type { Task } from "@/types";
import { Skeleton } from "../ui/skeleton";
import { TaskCard } from "./TaskCard";

const INITIAL_VISIBLE_CARDS = 4;
const SKELETON_COUNT = 4;

function LazyTaskCard({ task, index }: { task: Task; index: number }) {
  const isPriority = index < INITIAL_VISIBLE_CARDS;
  const { isVisible, ref } = useIntersectionObserver({
    initiallyVisible: isPriority,
    rootMargin: "400px",
  });

  return (
    <div ref={ref} className="relative">
      {isVisible ? (
        <motion.div
          key="task-card"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{
            duration: 0.2,
            ease: "easeOut",
          }}
        >
          <TaskCard task={task} priority={isPriority} />
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
    </div>
  );
}

interface TasksGridProps {
  tasks: Task[];
  empty?: {
    title: string;
    description: string;
  };
  loading: boolean;
  /**
   * Key to trigger animation reset when filter changes
   * Pass the active status/filter to force component remount
   */
  animationKey?: string;
}

export function TasksGrid({
  tasks,
  empty = {
    title: "No creators found",
    description: "Creators will appear here when they're assigned this status.",
  },
  loading,
  animationKey,
}: TasksGridProps) {
  if (tasks.length === 0 && !loading) {
    return (
      <ErrorBlock
        title={empty.title}
        description={empty.description}
        className="h-[580px]"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {loading
        ? Array.from({ length: SKELETON_COUNT }, () => (
            <Skeleton
              key={`skeleton-${Math.random()}`}
              className="h-[500px] w-full rounded-3xl bg-[#F9F7F7]"
            />
          ))
        : tasks.map((task, index) => (
            <LazyTaskCard
              key={animationKey ? `${animationKey}-${task.id}` : task.id}
              task={task}
              index={index}
            />
          ))}
    </div>
  );
}

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ErrorBlock } from "@/components/shared/ErrorBlock";
import type { Task } from "@/types";
import { Skeleton } from "../ui/skeleton";
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

interface TasksGridProps {
  tasks: Task[];
  empty?: {
    title: string;
    description: string;
  };
  loading: boolean;
}

export function TasksGrid({
  tasks,
  empty = {
    title: "No creators found",
    description: "Creators will appear here when they're assigned this status.",
  },
  loading,
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
        ? Array.from({ length: 4 }, () => (
            <Skeleton
              key={Math.random()}
              className="h-[500px] w-full rounded-3xl bg-[#F9F7F7]"
            />
          ))
        : tasks.map((task, index) => (
            <LazyTaskCard key={task.id} task={task} index={index} />
          ))}
    </div>
  );
}

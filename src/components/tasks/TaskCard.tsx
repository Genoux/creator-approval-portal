import { useState } from "react";
import { TaskModal } from "@/components/tasks/TaskModal";
import type { Task } from "@/types";
import { Skeleton } from "../ui/skeleton";
import { TaskSquircle } from "./TaskSquircle";

interface TaskCardProps {
  task: Task;
  priority?: boolean; // Priority loading for above-the-fold images
}

export function TaskCard({ task, priority = false }: TaskCardProps) {
  const [isImageLoading, setIsImageLoading] = useState(false);

  return (
    <div className="rounded-3xl relative">
      {isImageLoading && (
        <div className="absolute inset-0 z-10">
          <Skeleton className="w-full h-full border overflow-hidden rounded-2xl" />
        </div>
      )}
      {isImageLoading ? (
        <TaskSquircle
          task={task}
          onLoadingChange={setIsImageLoading}
          priority={priority}
        />
      ) : (
        <TaskModal task={task}>
          <div className="cursor-pointer">
            <TaskSquircle
              task={task}
              onLoadingChange={setIsImageLoading}
              priority={priority}
            />
          </div>
        </TaskModal>
      )}
    </div>
  );
}

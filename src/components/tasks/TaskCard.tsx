import { TaskModal } from "@/components/tasks/TaskModal";
import type { Task } from "@/types";
import { TaskSquircle } from "./TaskSquircle";

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  return (
    <TaskModal task={task}>
      <div className="cursor-pointer rounded-3xl">
        <TaskSquircle task={task} />
      </div>
    </TaskModal>
  );
}

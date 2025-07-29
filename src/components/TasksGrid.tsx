import type { Task } from "@/types/tasks";
import { TaskCard } from "./TaskCard";

interface TasksGridProps {
  tasks: Task[];
  isLoading: boolean;
}

export function TasksGrid({ tasks, isLoading }: TasksGridProps) {
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          ClickUp Tasks ({tasks.length} total)
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>

      {tasks.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500">No tasks found</div>
        </div>
      )}
    </div>
  );
}

import type { Task } from "@/types/tasks";
import { renderFieldValue } from "@/utils/fieldRenderer";

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  console.log("Task:", task);
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900">{task.name}</h3>

      <div className="mt-2 flex items-center space-x-2">
        <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          {task.type}
        </span>
        <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {task.status?.status || "No Status"}
        </span>
      </div>

      {task.custom_fields && task.custom_fields.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Custom Fields:
          </h4>
          {task.custom_fields.map(field => {
            const value = renderFieldValue(field);
            if (!value) return null;

            return (
              <div key={field.id} className="text-xs text-gray-600 mb-1">
                <span className="font-medium">{field.name}:</span> {value}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

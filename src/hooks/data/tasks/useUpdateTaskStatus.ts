import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/query-keys";
import type { StatusUpdate } from "@/types/status";
import type { Task } from "@/types/tasks";
import { APPROVAL_FIELD_ID } from "@/utils";

interface UpdateStatusParams {
  taskId: string;
  status: StatusUpdate;
}

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, status }: UpdateStatusParams) => {
      const response = await fetch(`/api/tasks/${taskId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        try {
          const error = await response.json();
          throw new Error(error.error || "Failed to update status");
        } catch {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      }

      try {
        return await response.json();
      } catch {
        throw new Error("Invalid JSON response from server");
      }
    },

    onMutate: async ({ taskId, status }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.tasks });

      const previous = queryClient.getQueryData<Task[]>(QUERY_KEYS.tasks);

      queryClient.setQueryData<Task[]>(QUERY_KEYS.tasks, (old) =>
        old?.map((task) =>
          task.id === taskId
            ? {
                ...task,
                custom_fields: task.custom_fields?.map((field) =>
                  field.id === APPROVAL_FIELD_ID
                    ? { ...field, value: status }
                    : field
                ),
              }
            : task
        )
      );

      return { previous };
    },

    onError: (_, __, context) => {
      if (context?.previous) {
        queryClient.setQueryData(QUERY_KEYS.tasks, context.previous);
      }
    },

    onSuccess: () => {
      // Invalidate queries to ensure fresh data after successful update
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tasks });
    },
  });
}

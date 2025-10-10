import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/query-keys";
import type { ApprovalLabel, StatusUpdate, Task } from "@/types";

interface UpdateStatusParams {
  taskId: string;
  fieldId: string;
  status: StatusUpdate | null;
  label: ApprovalLabel;
}

export function useUpdateTaskStatus(listId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, fieldId, status }: UpdateStatusParams) => {
      const response = await fetch(`/api/tasks/${taskId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, fieldId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update status: ${response.status}`);
      }

      return response.json();
    },
    retry: 2, // Retry twice on failure for critical status updates
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 5000), // Exponential backoff, max 5s

    onMutate: async ({ taskId, label }) => {
      if (!listId) {
        return { previous: null };
      }

      const queryKey = QUERY_KEYS.tasks(listId);
      await queryClient.cancelQueries({ queryKey });

      const previous = queryClient.getQueryData<Task[]>(queryKey);

      queryClient.setQueryData<Task[]>(queryKey, old =>
        old?.map(task =>
          task.id === taskId
            ? {
                ...task,
                status: {
                  ...task.status,
                  label,
                },
              }
            : task
        )
      );

      return { previous };
    },

    onError: (_, __, context) => {
      if (context?.previous && listId) {
        queryClient.setQueryData(QUERY_KEYS.tasks(listId), context.previous);
      }
    },

    // Optimistic update already applied - tabs will reflect changes immediately
  });
}

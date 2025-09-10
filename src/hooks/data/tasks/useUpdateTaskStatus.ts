import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/query-keys";
import type { StatusUpdate, Task } from "@/types";
import { getApprovalFieldId } from "@/utils";

interface UpdateStatusParams {
  taskId: string;
  status: StatusUpdate;
}

export function useUpdateTaskStatus(listId: string | null) {
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
      if (!listId) {
        return { previous: null };
      }

      const queryKey = QUERY_KEYS.tasks(listId);
      await queryClient.cancelQueries({ queryKey });

      const previous = queryClient.getQueryData<Task[]>(queryKey);

      queryClient.setQueryData<Task[]>(queryKey, (old) =>
        old?.map((task) => {
          if (task.id === taskId) {
            const approvalFieldId = getApprovalFieldId(task);
            return {
              ...task,
              custom_fields: task.custom_fields?.map((field) =>
                field.id === approvalFieldId
                  ? { ...field, value: status }
                  : field
              ),
            };
          }
          return task;
        })
      );

      return { previous };
    },

    onError: (_, __, context) => {
      if (context?.previous && listId) {
        queryClient.setQueryData(QUERY_KEYS.tasks(listId), context.previous);
      }
    },

    onSuccess: () => {
      // Don't invalidate immediately - trust the optimistic update
      // The background refetch will eventually sync with server
    },
  });
}
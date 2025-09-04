import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { StatusUpdate } from "@/types/status";
import type { Task } from "@/types/tasks";
import { APPROVAL_FIELD_ID } from "@/utils/approval";

interface UpdateStatusParams {
  taskId: string;
  status: StatusUpdate;
}

export function useUpdateCreatorStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, status }: UpdateStatusParams) => {
      const response = await fetch(`/api/creators/${taskId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update status");
      }

      return response.json();
    },

    onMutate: async ({ taskId, status }) => {
      await queryClient.cancelQueries({ queryKey: ["creators"] });

      const previous = queryClient.getQueryData<Task[]>(["creators"]);

      queryClient.setQueryData<Task[]>(["creators"], (old) =>
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
        queryClient.setQueryData(["creators"], context.previous);
      }
    },
  });
}

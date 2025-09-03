import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CUSTOM_FIELD_IDS } from "@/constants/customFields";
import type { Task } from "@/types/tasks";

interface UpdateTaskStatusParams {
  taskId: string;
  status: "approved" | "declined" | "for_review";
}

// Helper function to optimistically update task status in the cache
function updateTaskInCache(task: Task, newStatus: string): Task {
  const updatedTask = { ...task };

  if (updatedTask.custom_fields) {
    updatedTask.custom_fields = updatedTask.custom_fields.map((field) => {
      if (field.id === CUSTOM_FIELD_IDS.CLIENT_APPROVAL) {
        const mockOptions = [
          { id: "0", name: "Perfect (Approved)", label: "Perfect (Approved)" },
          {
            id: "1",
            name: "Poor Fit (Rejected)",
            label: "Poor Fit (Rejected)",
          },
        ];

        let newValue = null;
        if (newStatus === "approved") {
          newValue = 0;
        } else if (newStatus === "declined") {
          newValue = 1;
        }

        return {
          ...field,
          value: newValue,
          type_config: {
            ...field.type_config,
            options: mockOptions,
          },
        };
      }
      return field;
    });
  } else {
    // Create field if it doesn't exist (for Review cards)
    const mockOptions = [
      { id: "0", name: "Perfect (Approved)", label: "Perfect (Approved)" },
      { id: "1", name: "Poor Fit (Rejected)", label: "Poor Fit (Rejected)" },
    ];

    let newValue = null;
    if (newStatus === "approved") {
      newValue = 0;
    } else if (newStatus === "declined") {
      newValue = 1;
    }

    updatedTask.custom_fields = [
      {
        id: CUSTOM_FIELD_IDS.CLIENT_APPROVAL,
        name: "✅ Client Approval ",
        type: "drop_down",
        value: newValue,
        type_config: { options: mockOptions },
      },
    ];
  }

  return updatedTask;
}

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, status }: UpdateTaskStatusParams) => {
      const response = await fetch(`/api/creators/${taskId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update task status");
      }

      return response.json();
    },

    // Optimistic update
    onMutate: async ({ taskId, status }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]);

      // Optimistically update the cache
      queryClient.setQueryData<Task[]>(["tasks"], (oldTasks) => {
        if (!oldTasks) return [];

        return oldTasks.map((task) => {
          if (task.id === taskId) {
            return updateTaskInCache(task, status);
          }
          return task;
        });
      });

      // Return context with snapshot
      return { previousTasks };
    },

    // On error, revert the optimistic update
    onError: (_error, _variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks"], context.previousTasks);
      }
    },

    // Always refetch after success or error
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ApiResponse, CreateCommentRequest } from "@/types";

async function createComment(taskId: string, request: CreateCommentRequest) {
  const response = await fetch(`/api/tasks/${taskId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  const data: ApiResponse<any> = await response.json();

  if (!data.success) {
    throw new Error(data.message || "Failed to create comment");
  }

  return data.data;
}

export function useCommentActions(taskId: string) {
  const queryClient = useQueryClient();

  const createCommentMutation = useMutation({
    mutationFn: (request: CreateCommentRequest) =>
      createComment(taskId, request),
    onSuccess: () => {
      // Invalidate comments query to refetch
      queryClient.invalidateQueries({
        queryKey: ["task-comments", taskId],
      });
    },
  });

  return {
    createComment: createCommentMutation.mutateAsync,
    isCreating: createCommentMutation.isPending,
    createError: createCommentMutation.error?.message,
  };
}

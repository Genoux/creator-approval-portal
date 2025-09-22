import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/query-keys";
import type {
  ApiResponse,
  ClickUpComment,
  CreateCommentRequest,
} from "@/types";

async function createComment(taskId: string, request: CreateCommentRequest) {
  if (!taskId?.trim()) {
    throw new Error("taskId is required");
  }

  const response = await fetch(`/api/tasks/${taskId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(request),
  });

  const contentType = response.headers.get("content-type") || "";
  if (!response.ok) {
    let message = `Failed to create comment (${response.status})`;
    if (contentType.includes("application/json")) {
      try {
        const errJson: Partial<ApiResponse<unknown>> & { message?: string } =
          await response.json();
        message = errJson.message || message;
      } catch {
        /* ignore */
      }
    } else {
      try {
        const text = await response.text();
        if (text) message = text;
      } catch {
        /* ignore */
      }
    }
    throw new Error(message);
  }

  let data: ApiResponse<ClickUpComment>;
  try {
    data = await response.json();
  } catch {
    throw new Error("Invalid server response");
  }

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
        queryKey: QUERY_KEYS.taskComments(taskId),
      });
    },
  });

  return {
    createComment: createCommentMutation.mutateAsync,
    isCreating: createCommentMutation.isPending,
    createError: createCommentMutation.error?.message,
  };
}

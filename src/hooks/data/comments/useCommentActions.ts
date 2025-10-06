import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/lib/query-keys";
import type {
  ApiResponse,
  ClickUpComment,
  CreateCommentRequest,
  UpdateCommentRequest,
} from "@/types";
import { logError } from "@/utils/errors";

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

async function deleteComment(taskId: string, commentId: string) {
  if (!taskId?.trim()) {
    throw new Error("taskId is required");
  }
  if (!commentId?.trim()) {
    throw new Error("commentId is required");
  }

  const response = await fetch(`/api/tasks/${taskId}/comments/${commentId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    let message = `Failed to delete comment (${response.status})`;
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      try {
        const errJson: Partial<ApiResponse<unknown>> & { message?: string } =
          await response.json();
        message = errJson.message || message;
      } catch {
        /* ignore */
      }
    }
    throw new Error(message);
  }

  return true;
}

async function updateComment(
  taskId: string,
  commentId: string,
  request: UpdateCommentRequest
) {
  if (!taskId?.trim()) {
    throw new Error("taskId is required");
  }
  if (!commentId?.trim()) {
    throw new Error("commentId is required");
  }

  const response = await fetch(`/api/tasks/${taskId}/comments/${commentId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    let message = `Failed to update comment (${response.status})`;
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      try {
        const errJson: Partial<ApiResponse<unknown>> & { message?: string } =
          await response.json();
        message = errJson.message || message;
      } catch {
        /* ignore */
      }
    }
    throw new Error(message);
  }

  return true;
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

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: string) => deleteComment(taskId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.taskComments(taskId),
      });
      toast.success("Comment deleted");
    },
    onError: error => {
      logError(error, {
        component: "useCommentActions",
        action: "delete_comment",
      });
      toast.error("Failed to delete comment");
    },
  });

  const updateCommentMutation = useMutation({
    mutationFn: ({
      commentId,
      request,
    }: {
      commentId: string;
      request: UpdateCommentRequest;
    }) => updateComment(taskId, commentId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.taskComments(taskId),
      });
    },
  });

  return {
    createComment: createCommentMutation.mutateAsync,
    isCreating: createCommentMutation.isPending,
    createError: createCommentMutation.error?.message,
    updateComment: updateCommentMutation.mutateAsync,
    isUpdating: updateCommentMutation.isPending,
    updateError: updateCommentMutation.error?.message,
    deleteComment: deleteCommentMutation.mutateAsync,
    isDeleting: deleteCommentMutation.isPending,
    deleteError: deleteCommentMutation.error?.message,
  };
}

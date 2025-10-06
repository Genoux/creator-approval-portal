import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/query-keys";
import type { ApiResponse, Comment } from "@/types";

async function fetchTaskComments(
  taskId: string,
  signal?: AbortSignal
): Promise<Comment[]> {
  const response = await fetch(`/api/tasks/${taskId}/comments`, {
    signal,
    headers: {
      Accept: "application/json",
    },
  });

  const contentType = response.headers.get("content-type") || "";
  if (!response.ok) {
    let message = `Failed to fetch comments (${response.status})`;
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

  let data: ApiResponse<Comment[]>;
  try {
    data = await response.json();
  } catch {
    throw new Error("Invalid server response");
  }

  if (!data.success) {
    throw new Error(data.message || "Failed to fetch comments");
  }

  return data.data.reverse();
}

export function useTaskComments(taskId: string, enabled = true) {
  return useQuery({
    queryKey: QUERY_KEYS.taskComments(taskId),
    queryFn: ({ signal }) => fetchTaskComments(taskId, signal),
    enabled: !!taskId && enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: false, // Only refetch on demand (when modal opens)
    // retry, retryDelay, refetchOnWindowFocus, refetchIntervalInBackground
    // all inherited from global defaults
  });
}

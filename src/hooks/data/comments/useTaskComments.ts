import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/query-keys";
import type { ApiResponse, Comment } from "@/types";

async function fetchTaskComments(taskId: string): Promise<Comment[]> {
  const response = await fetch(`/api/tasks/${taskId}/comments`);
  const data: ApiResponse<Comment[]> = await response.json();

  if (!data.success) {
    throw new Error(data.message || "Failed to fetch comments");
  }

  return data.data.reverse();
}

export function useTaskComments(taskId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.taskComments(taskId),
    queryFn: () => fetchTaskComments(taskId),
    enabled: !!taskId,
    staleTime: 2 * 60 * 1000, // 2 minutes (override global 5min default)
    refetchInterval: 60 * 1000, // 60 seconds (reduced from 20s)
    // retry, retryDelay, refetchOnWindowFocus, refetchIntervalInBackground
    // all inherited from global defaults
  });
}

import { useQuery } from "@tanstack/react-query";
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
    queryKey: ["task-comments", taskId],
    queryFn: () => fetchTaskComments(taskId),
    enabled: !!taskId,
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 20 * 1000, // 20 seconds
    refetchOnWindowFocus: true,
  });
}

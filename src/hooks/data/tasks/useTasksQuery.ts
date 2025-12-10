import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/query-keys";
import type { ApiResponse, Task } from "@/types";

interface UseTasksQueryResult {
  data: Task[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Fetches tasks for a given list and status filters
 */
export function useTasksQuery(
  listId: string | null,
  statuses: string[]
): UseTasksQueryResult {
  const isQueryEnabled = !!listId && statuses.length > 0;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: QUERY_KEYS.tasks(listId),
    queryFn: async (): Promise<Task[]> => {
      const response = await fetch(
        `/api/tasks?listId=${encodeURIComponent(listId || "")}&statuses=${encodeURIComponent(statuses.join(","))}`
      );

      if (response.status === 401) {
        window.location.href = "/";
        return [];
      }

      if (!response.ok)
        throw new Error(`Failed to fetch tasks (${response.status})`);

      const result: ApiResponse<Task[]> = await response.json();
      if (!result.success)
        throw new Error(result.message || "Failed to fetch tasks");

      return result.data;
    },
    enabled: isQueryEnabled,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnMount: false,
    refetchInterval: false,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes("401")) {
        return false;
      }
      if (error instanceof Error && error.message.includes("400")) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    data: data || [],
    isLoading,
    error: isQueryEnabled ? (error as Error | null) : null,
    refetch,
  };
}

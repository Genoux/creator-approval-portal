import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/query-keys";
import type { ApiResponse, User } from "@/types";

interface UseWorkspaceUsersResult {
  data: User[];
  isLoading: boolean;
  error: Error | null;
}

export function useWorkspaceUsers(
  listId: string | null
): UseWorkspaceUsersResult {
  const { data, isLoading, error } = useQuery({
    queryKey: QUERY_KEYS.workspaceUsers(listId),
    queryFn: async (): Promise<User[]> => {
      const response = await fetch(
        `/api/users/workspace?listId=${encodeURIComponent(listId || "")}`
      );

      if (response.status === 401) {
        window.location.href = "/";
        return [];
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch workspace users (${response.status})`);
      }

      const result: ApiResponse<User[]> = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to fetch workspace users");
      }

      return result.data;
    },
    enabled: !!listId, // Only run query when listId is available
    staleTime: 60 * 60 * 1000, // 1 hour - users don't change often
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
    refetchOnMount: false,
    refetchInterval: false,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      // Don't retry on auth errors
      if (error instanceof Error && error.message.includes("401")) {
        return false;
      }
      // Retry once for network/server errors
      return failureCount < 1;
    },
    retryDelay: 2000, // 2 second delay before retry
  });

  return {
    data: data || [],
    isLoading,
    error: error as Error | null,
  };
}

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
    staleTime: 3600000, // 1 hour - users don't change often
    gcTime: 7200000, // 2 hours
    refetchOnMount: false,
    refetchInterval: false,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
  });

  return {
    data: data || [],
    isLoading,
    error: error as Error | null,
  };
}

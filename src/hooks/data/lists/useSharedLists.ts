import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/query-keys";

interface SharedBoard {
  id: string;
  name: string;
  workspace: {
    id: string;
    name: string;
    color: string;
  };
  lists: {
    id: string;
    name: string;
    task_count: number;
  }[];
}

interface UseSharedListsResult {
  boards: SharedBoard[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useSharedLists(): UseSharedListsResult {
  const {
    data: boards = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEYS.sharedBoards,
    queryFn: async (): Promise<SharedBoard[]> => {
      const response = await fetch("/api/clickup/shared-boards");

      if (!response.ok) {
        throw new Error("Failed to fetch shared boards");
      }

      const data = await response.json();
      return data.boards || [];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes (override global 5min default)
    // retry, retryDelay, refetchOnWindowFocus, refetchIntervalInBackground
    // all inherited from global defaults
  });

  return {
    boards,
    isLoading,
    error: error as Error | null,
    refetch,
  };
}

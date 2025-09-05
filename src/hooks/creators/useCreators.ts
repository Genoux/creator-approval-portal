import { useQuery } from "@tanstack/react-query";
import type { ApiResponse } from "@/types";
import type { Task } from "@/types/tasks";

interface UseCreatorsResult {
  data: Task[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useCreators(): UseCreatorsResult {
  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["creators"],
    queryFn: async (): Promise<Task[]> => {
      const response = await fetch("/api/creators");
      const data: ApiResponse<Task[]> = await response.json();

      if (response.status === 401) {
        window.location.href = "/";
        return [];
      }

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch creators");
      }

      return data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 60000, // 1 minute
    refetchOnWindowFocus: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    data: response || [],
    isLoading,
    error: error as Error | null,
    refetch,
  };
}

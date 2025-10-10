import { useQuery } from "@tanstack/react-query";
import type { ListResult } from "@/services/ListService";

async function fetchSharedLists(): Promise<ListResult[]> {
  const response = await fetch("/api/lists", {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch shared lists (${response.status})`);
  }

  return response.json();
}

export function useSharedLists() {
  return useQuery({
    queryKey: ["lists", "shared"],
    queryFn: fetchSharedLists,
    staleTime: 10 * 60 * 1000, // 10 minutes - lists don't change often
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnMount: false,
    refetchInterval: false,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      // Retry once on network/server errors
      if (error instanceof Error && error.message.includes("Failed to fetch")) {
        return failureCount < 1;
      }
      return false;
    },
    retryDelay: 2000, // 2 second delay before retry
  });
}

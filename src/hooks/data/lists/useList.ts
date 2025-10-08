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
    retry: false,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnMount: false,
    refetchInterval: false,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
  });
}

import { useQuery } from "@tanstack/react-query";
import type { ListResult } from "@/utils/lists/list-finder";

async function fetchList(listName: string): Promise<ListResult> {
  const response = await fetch(`/api/lists?name=${encodeURIComponent(listName)}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `Failed to fetch list "${listName}"`);
  }
  
  const result = await response.json();
  return result;
}

export function useList(listName: string) {
  return useQuery({
    queryKey: ["list", listName],
    queryFn: () => fetchList(listName),
    retry: false, // User can manually refresh if needed
    staleTime: 10 * 60 * 1000, // 10 minutes - lists rarely change
    gcTime: 30 * 60 * 1000, // 30 minutes - keep list info in cache for very fast refreshes
  });
}
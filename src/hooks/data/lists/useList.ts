import { useQuery } from "@tanstack/react-query";
import type { ListResult } from "@/services/ListService";

async function fetchList(listName: string): Promise<ListResult> {
  if (!listName?.trim()) {
    throw new Error("List name is required");
  }

  const response = await fetch(
    `/api/lists?name=${encodeURIComponent(listName)}`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );

  const contentType = response.headers.get("content-type") || "";
  if (!response.ok) {
    let message = `Failed to fetch list "${listName}" (${response.status})`;
    if (contentType.includes("application/json")) {
      try {
        const errJson: { message?: string } = await response.json();
        message = errJson.message || message;
      } catch {
        /* ignore */
      }
    } else {
      try {
        const text = await response.text();
        if (text) message = text;
      } catch {
        /* ignore */
      }
    }
    throw new Error(message);
  }

  let result: ListResult;
  try {
    result = await response.json();
  } catch {
    throw new Error("Invalid server response");
  }

  return result;
}

export function useList(listName: string) {
  return useQuery({
    queryKey: ["list", listName],
    queryFn: () => fetchList(listName),
    retry: false, // User can manually refresh if needed
    staleTime: 10 * 60 * 1000, // 10 minutes - lists rarely change
    gcTime: 30 * 60 * 1000, // 30 minutes - keep list info in cache for very fast refreshes
    refetchInterval: false, // No automatic polling - user can manually refresh if needed
    refetchIntervalInBackground: false, // Don't poll when tab is hidden
    refetchOnWindowFocus: false, // Don't refetch when switching back to tab
  });
}

import { QueryClient } from "@tanstack/react-query";

/**
 * Global React Query client with optimized defaults
 * These defaults apply to all queries/mutations unless overridden
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh
      retry: 3, // Automatic retries on failure
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: true, // Refresh when user returns to tab
      refetchIntervalInBackground: false, // Don't poll when tab inactive (rate limit protection)
    },
    mutations: {
      retry: 1, // Only retry mutations once
    },
  },
});

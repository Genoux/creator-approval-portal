import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { logError } from "@/utils/errors";

/**
 * Global React Query client with optimized defaults
 * These defaults apply to all queries/mutations unless overridden
 */
export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      // Global error handler for all queries
      logError(error, {
        component: "QueryClient",
        action: "query_failed",
        metadata: {
          queryKey: query.queryKey,
        },
      });
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      // Global error handler for all mutations
      logError(error, {
        component: "QueryClient",
        action: "mutation_failed",
        metadata: {
          mutationKey: mutation.options.mutationKey,
        },
      });
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh
      gcTime: 10 * 60 * 1000, // 10 minutes - keep in cache for fast page refreshes
      retry: 3, // Automatic retries on failure
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: true, // Refresh when user returns to tab
      refetchIntervalInBackground: false, // Don't poll when tab inactive (rate limit protection)
    },
    mutations: {
      retry: 1, // Only retry mutations once
    },
  },
});

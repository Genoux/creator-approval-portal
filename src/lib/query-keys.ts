/**
 * Centralized query keys for React Query
 * This ensures consistency across all hooks and prevents key mismatches
 */
export const QUERY_KEYS = {
  list: (listName: string) => ["list", listName] as const,
  tasks: (listId: string | null) => ["tasks", listId] as const,
  taskComments: (taskId: string) => ["task-comments", taskId] as const,
  userSession: ["user-session"] as const,
} as const;

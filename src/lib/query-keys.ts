/**
 * Centralized query keys for React Query
 * This ensures consistency across all hooks and prevents key mismatches
 */
export const QUERY_KEYS = {
  // Lists
  list: (listName: string) => ["list", listName] as const,

  // Tasks
  tasks: (listId: string | null) => ["tasks", listId] as const,

  // Comments
  taskComments: (taskId: string) => ["task-comments", taskId] as const,

  // Auth/User
  userSession: ["user-session"] as const,
} as const;

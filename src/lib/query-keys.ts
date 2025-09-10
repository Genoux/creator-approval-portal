/**
 * Centralized query keys for React Query
 * This ensures consistency across all hooks and prevents key mismatches
 */
export const QUERY_KEYS = {
  // Tasks
  tasks: ["tasks"] as const,

  // Comments
  taskComments: (taskId: string) => ["task-comments", taskId] as const,

  // Boards and Lists
  sharedBoards: ["shared-boards"] as const,

  // Auth/User
  userSession: ["user-session"] as const,
} as const;

// Type helpers for better TypeScript support
export type QueryKey = (typeof QUERY_KEYS)[keyof typeof QUERY_KEYS];

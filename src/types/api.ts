import type { ApiResponse } from "./core";

// Re-export from core for backward compatibility
export type { ApiResponse };

/**
 * Authentication credentials for API access
 */
export interface AuthCredentials {
  listId: string;
}

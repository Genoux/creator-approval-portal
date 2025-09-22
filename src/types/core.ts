// Shared core types used across the application

/**
 * Base user type - single source of truth for all user representations
 */
export interface User {
  id: number;
  username: string;
  email: string;
  color?: string;
  profilePicture?: string;
  initials?: string;
  week_start_day?: number;
  global_font_support?: boolean;
  timezone?: string;
}

export interface AuthCredentials {
  listId: string;
}

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

/**
 * Status update type for task status changes
 */
export type StatusUpdate = string | null;

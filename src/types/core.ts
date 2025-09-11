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

/**
 * ClickUp custom field dropdown option
 */
export interface DropdownOption {
  id: string;
  name?: string;
  label?: string;
  color?: string | null;
}

/**
 * ClickUp custom field structure
 */
export interface CustomField {
  id: string;
  name: string;
  type: string;
  value: string | number | boolean | null | undefined;
  type_config?: {
    options?: DropdownOption[];
  };
  date_created?: string;
  hide_from_guests?: boolean;
  required?: boolean;
  value_richtext?: string;
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
import type { CustomField } from "./core";

/**
 * Task status information
 */
export interface TaskStatus {
  status: string;
  color?: string;
}

/**
 * ClickUp task with custom fields for creator management
 */
export interface Task {
  id: string;
  name: string;
  status: TaskStatus;
  custom_fields?: CustomField[];
}

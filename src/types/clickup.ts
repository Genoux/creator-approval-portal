import type { User } from "./core";

export interface ClickUpWorkspace {
  id: string;
  name: string;
  color: string;
  avatar: string | null;
  members: User[];
}

export interface ClickUpSpace {
  id: string;
  name: string;
  archived: boolean;
}

export interface ClickUpFolder {
  id: string;
  name: string;
  space: ClickUpSpace;
}

export interface ClickUpList {
  id: string;
  name: string;
  orderindex: number;
  content: string;
  status: unknown;
  priority: unknown;
  assignee: unknown;
  task_count: number;
  due_date: string;
  start_date: string;
  folder?: ClickUpFolder;
  space: ClickUpSpace;
  archived: boolean;
}

// Extended types for workspace management
export interface ClickUpSpaceWithLists extends ClickUpSpace {
  lists: ClickUpList[];
}

export interface ClickUpWorkspaceWithSpaces extends ClickUpWorkspace {
  spaces: ClickUpSpaceWithLists[];
}

// OAuth Session Data
export interface ClickUpSessionData {
  accessToken: string;
  user: User;
  workspaces: ClickUpWorkspace[];
}

// OAuth Token Response
export interface ClickUpTokenResponse {
  access_token: string;
  token_type: string;
}

// OAuth Auth Response
export interface ClickUpAuthResponse {
  user: User;
  workspaces: ClickUpWorkspace[];
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

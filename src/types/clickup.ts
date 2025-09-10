// Core ClickUp Entities
export interface ClickUpUser {
  id: number;
  username: string;
  email: string;
  color: string;
  profilePicture: string;
  initials: string;
  week_start_day?: number;
  global_font_support?: boolean;
  timezone?: string;
}

export interface ClickUpWorkspace {
  id: string;
  name: string;
  color: string;
  avatar: string | null;
  members: ClickUpUser[];
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
  user: ClickUpUser;
  workspaces: ClickUpWorkspace[];
}

// OAuth Token Response
export interface ClickUpTokenResponse {
  access_token: string;
  token_type: string;
}

// OAuth Auth Response
export interface ClickUpAuthResponse {
  user: ClickUpUser;
  workspaces: ClickUpWorkspace[];
}

import type { User } from "./core";

/**
 * ClickUp comment structure from API response
 */
export interface ClickUpComment {
  id: string;
  comment: {
    text: string;
    html: string;
  }[];
  comment_text: string;
  user: User;
  resolved: boolean;
  assignee: User | null;
  assigned_by: User | null;
  reactions: unknown[];
  date: string;
}

// Simplified Comment for UI
export interface Comment {
  id: string;
  taskId: string;
  text: string;
  structuredComment?: Array<{
    type?: "tag";
    text?: string;
    user?: { id: number; username?: string };
  }>;
  author: {
    id: number;
    name: string;
    initials: string;
  };
  createdAt: string;
  resolved: boolean;
}

// Create Comment Request
export interface CreateCommentRequest {
  comment_text?: string;
  comment?: Array<{
    type?: "tag";
    text?: string;
    user?: { id: number };
  }>;
  assignee?: number;
  notify_all?: boolean;
}

// Update Comment Request
export interface UpdateCommentRequest {
  comment_text: string;
  resolved?: boolean;
}

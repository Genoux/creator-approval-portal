// ClickUp Comment Response Structure
export interface ClickUpComment {
  id: string;
  comment: {
    text: string;
    html: string;
  }[];
  comment_text: string;
  user: {
    id: number;
    username: string;
    email: string;
    color: string;
    profilePicture: string;
    initials: string;
  };
  resolved: boolean;
  assignee: {
    id: number;
    username: string;
    email: string;
    color: string;
    initials: string;
    profilePicture: string;
  } | null;
  assigned_by: {
    id: number;
    username: string;
    email: string;
    color: string;
    initials: string;
    profilePicture: string;
  } | null;
  reactions: unknown[];
  date: string;
}

// Simplified Comment for UI
export interface Comment {
  id: string;
  taskId: string;
  text: string;
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
  comment_text: string;
  assignee?: number;
  notify_all?: boolean;
}

// Update Comment Request
export interface UpdateCommentRequest {
  comment_text: string;
  resolved?: boolean;
}

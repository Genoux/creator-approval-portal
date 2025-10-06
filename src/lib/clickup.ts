// TODO:CHORE: Extract functions to a separate file

import type { Task } from "@/types";

export class ClickUpAPI {
  private apiToken: string;
  private baseUrl: string;

  constructor(apiToken: string, baseUrl = "https://api.clickup.com/api/v2") {
    this.apiToken = apiToken;
    this.baseUrl = baseUrl;
  }

  static createFromSession(apiToken?: string, oauthToken?: string): ClickUpAPI {
    const tokenToUse = oauthToken || apiToken;
    if (!tokenToUse) {
      throw new Error("No ClickUp API token available");
    }
    return new ClickUpAPI(tokenToUse);
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const headers: Record<string, string> = {
      Authorization: this.apiToken.startsWith("pk_")
        ? this.apiToken
        : `Bearer ${this.apiToken}`,
      "Content-Type": "application/json",
    };

    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ ClickUp API Error:", {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        errorBody: errorText,
      });
      throw new Error(
        `ClickUp API error: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    return response.json();
  }

  async getTasks(listId: string) {
    const filter =
      "archived=false&include_closed=true&order_by=created&reverse=true&limit=100&statuses[]=client%20approval&statuses[]=backup&statuses[]=declined%20(client)&statuses[]=selected";
    const baseQuery = `/list/${listId}/task`;

    const firstResponse = await this.request(`${baseQuery}?${filter}&page=0`);
    const allTasks = firstResponse.tasks || [];

    if (allTasks.length < 100) return allTasks;

    const promises: Promise<{ tasks: Task[] }>[] = [];
    for (let page = 1; page <= 5; page++) {
      promises.push(
        this.request(`${baseQuery}&page=${page}`).catch(() => ({ tasks: [] }))
      );
    }

    const responses = await Promise.all(promises);

    for (const response of responses) {
      const pageTasks = response.tasks || [];
      if (pageTasks.length === 0) break;
      allTasks.push(...pageTasks);
      if (pageTasks.length < 100) break;
    }

    return allTasks;
  }

  async getTask(taskId: string) {
    return this.request(`/task/${taskId}?include_attachments=true`);
  }

  async getTaskMembers(taskId: string) {
    return this.request(`/task/${taskId}/member`);
  }

  async getListMembers(listId: string) {
    return this.request(`/list/${listId}/member`);
  }

  async updateTaskCustomField(
    taskId: string,
    fieldId: string,
    value: string | number | null
  ) {
    // Clear field: use DELETE request
    if (value === "" || value === null || value === undefined) {
      return this.request(`/task/${taskId}/field/${fieldId}`, {
        method: "DELETE",
      });
    }

    // Set field: use POST request
    return this.request(`/task/${taskId}/field/${fieldId}`, {
      method: "POST",
      body: JSON.stringify({ value }),
    });
  }

  async getList(listId: string) {
    return this.request(`/list/${listId}`);
  }

  async getFolder(folderId: string) {
    return this.request(`/folder/${folderId}`);
  }

  async getSpace(spaceId: string) {
    return this.request(`/space/${spaceId}`);
  }

  async getTeams() {
    return this.request("/team");
  }

  async getSharedResources(teamId: string) {
    return this.request(`/team/${teamId}/shared`);
  }

  async getTaskComments(taskId: string) {
    return this.request(`/task/${taskId}/comment`);
  }

  async createTaskComment(
    taskId: string,
    commentData:
      | string
      | {
          comment_text?: string;
          comment?: Array<{
            type?: "tag";
            text?: string;
            user?: { id: number };
          }>;
        },
    assignee?: number
  ) {
    const body = {
      notify_all: true,
      ...(assignee && { assignee }),
      ...(typeof commentData === "string"
        ? { comment_text: commentData }
        : commentData),
    };

    return this.request(`/task/${taskId}/comment`, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  async updateComment(
    commentId: string,
    commentData:
      | string
      | {
          comment_text?: string;
          comment?: Array<{
            type?: "tag";
            text?: string;
            user?: { id: number };
          }>;
        },
    resolved?: boolean
  ) {
    const body = {
      ...(resolved !== undefined && { resolved }),
      ...(typeof commentData === "string"
        ? { comment_text: commentData }
        : commentData),
    };

    return this.request(`/comment/${commentId}`, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  async deleteComment(commentId: string) {
    return this.request(`/comment/${commentId}`, {
      method: "DELETE",
    });
  }

  async getAttachment(attachmentId: string) {
    return this.request(`/attachment/${attachmentId}`);
  }
}

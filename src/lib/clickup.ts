import type { Task } from "@/types/tasks";

export class ClickUpAPI {
  private apiToken: string;
  private baseUrl: string;

  constructor(apiToken: string) {
    this.apiToken = apiToken;
    this.baseUrl =
      process.env.CLICKUP_API_URL || "https://api.clickup.com/api/v2";
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        Authorization: this.apiToken.startsWith('pk_') ? this.apiToken : `Bearer ${this.apiToken}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `ClickUp API error: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    return response.json();
  }

  // === TASK OPERATIONS ===

  // Get single task by ID
  async getTask(taskId: string): Promise<Task> {
    try {
      const response = await this.request(`/task/${taskId}`);
      return response;
    } catch (error) {
      console.error("Error fetching task from ClickUp:", error);
      throw error;
    }
  }

  // Get all tasks from a list
  async getTasks(listId: string): Promise<Task[]> {
    try {
      const response = await this.request(
        `/list/${listId}/task?archived=false&include_closed=true&page=0&order_by=created&reverse=true&subtasks=true`
      );
      return response.tasks || [];
    } catch (error) {
      console.error("Error fetching tasks from ClickUp:", error);
      throw error;
    }
  }

  // Update task custom field
  async updateTaskCustomField(
    taskId: string,
    fieldId: string,
    value: string
  ): Promise<void> {
    try {
      await this.request(`/task/${taskId}/field/${fieldId}`, {
        method: "POST",
        body: JSON.stringify({ value }),
      });
    } catch (error) {
      console.error("Error updating task custom field:", error);
      throw error;
    }
  }

  // === LIST OPERATIONS ===

  // Get list information
  async getList(listId: string): Promise<{ id: string; name: string }> {
    try {
      const response = await this.request(`/list/${listId}`);
      return {
        id: response.id,
        name: response.name,
      };
    } catch (error) {
      console.error("Error fetching list info:", error);
      throw error;
    }
  }

  // - SPACE OPERATIONS (getSpace, getSpaces)
  // - USER OPERATIONS (getUser, getUsers)
  // - COMMENT OPERATIONS (getComments, addComment)
  // - ATTACHMENT OPERATIONS (getAttachments, uploadAttachment)
  // - WEBHOOK OPERATIONS (createWebhook, deleteWebhook)
}

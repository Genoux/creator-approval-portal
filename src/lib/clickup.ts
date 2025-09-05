export class ClickUpAPI {
  private apiToken: string;
  private baseUrl: string;

  constructor(apiToken: string) {
    this.apiToken = apiToken;
    this.baseUrl = "https://api.clickup.com/api/v2";
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        Authorization: this.apiToken.startsWith("pk_")
          ? this.apiToken
          : `Bearer ${this.apiToken}`,
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

  async getTasks(listId: string) {
    const allTasks = [];
    let page = 0;
    let hasMore = true;

    while (hasMore) {
      const response = await this.request(
        `/list/${listId}/task?archived=false&include_closed=true&page=${page}&order_by=created&reverse=true&subtasks=true`
      );

      const pageTasks = response.tasks || [];
      allTasks.push(...pageTasks);

      if (pageTasks.length === 0) {
        hasMore = false;
      } else {
        page++;
        if (page > 50) {
          console.warn(`Reached pagination limit for list ${listId}`);
          break;
        }
      }
    }

    return allTasks;
  }

  async updateTaskCustomField(
    taskId: string,
    fieldId: string,
    value: string | number | null
  ) {
    let actualValue = value;
    if (typeof value === "string" && /^\d+$/.test(value)) {
      actualValue = parseInt(value, 10);
    }

    return this.request(`/task/${taskId}/field/${fieldId}`, {
      method: "POST",
      body: JSON.stringify({ value: actualValue }),
    });
  }

  async getList(listId: string) {
    return this.request(`/list/${listId}`);
  }
}

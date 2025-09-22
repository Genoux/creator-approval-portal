interface CacheEntry {
  data: unknown;
  timestamp: number;
  ttl: number;
}

interface RequestCache {
  [key: string]: CacheEntry;
}

export class ClickUpAPI {
  private apiToken: string;
  private baseUrl: string;
  private cache: RequestCache = {};
  private defaultCacheTTL = 5 * 60 * 1000; // 5 minutes

  constructor(apiToken: string, baseUrl = "https://api.clickup.com/api/v2") {
    this.apiToken = apiToken;
    this.baseUrl = baseUrl;
  }

  static createFromSession(apiToken?: string, oauthToken?: string): ClickUpAPI {
    const tokenToUse = oauthToken || apiToken || process.env.CLICKUP_API_TOKEN;
    if (!tokenToUse) {
      throw new Error("No ClickUp API token available");
    }
    return new ClickUpAPI(tokenToUse);
  }

  private getCacheKey(endpoint: string, options: RequestInit = {}): string {
    return `${endpoint}:${JSON.stringify(options)}`;
  }

  private isValidCache(cacheEntry: CacheEntry): boolean {
    return Date.now() - cacheEntry.timestamp < cacheEntry.ttl;
  }

  private async request(
    endpoint: string,
    options: RequestInit = {},
    cacheTTL?: number
  ) {
    const cacheKey = this.getCacheKey(endpoint, options);

    // Check cache for GET requests
    if ((!options.method || options.method === "GET") && this.cache[cacheKey]) {
      const cached = this.cache[cacheKey];
      if (this.isValidCache(cached)) {
        return cached.data;
      }
    }

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
      console.error(
        `❌ API Error: ${response.status} ${response.statusText} - ${errorText}`
      );
      throw new Error(
        `ClickUp API error: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    const data = await response.json();

    // Cache GET requests
    if (!options.method || options.method === "GET") {
      this.cache[cacheKey] = {
        data,
        timestamp: Date.now(),
        ttl: cacheTTL || this.defaultCacheTTL,
      };
    }

    return data;
  }

  clearCache(): void {
    this.cache = {};
  }

  clearExpiredCache(): void {
    const keysToDelete = Object.keys(this.cache).filter(
      key => !this.isValidCache(this.cache[key])
    );
    keysToDelete.forEach(key => delete this.cache[key]);
  }

  async getTasks(listId: string, cacheTTL = 10 * 60 * 1000) {
    const allTasks = [];
    let page = 0;
    let hasMore = true;

    while (hasMore) {
      const response = await this.request(
        `/list/${listId}/task?archived=false&include_closed=true&page=${page}&order_by=created&reverse=true&limit=100&statuses[]=client%20approval&statuses[]=backup&statuses[]=declined%20(client)&statuses[]=selected`,
        {},
        cacheTTL
      );

      const pageTasks = response.tasks || [];
      allTasks.push(...pageTasks);

      if (pageTasks.length === 0 || pageTasks.length < 100) {
        hasMore = false;
      } else {
        page++;
        if (page > 20) {
          // Reduced from 50 since we're getting more per page
          console.warn(`⚠️  Reached pagination limit for list ${listId}`);
          break;
        }
      }
    }

    return allTasks;
  }

  async getTask(taskId: string, cacheTTL = 1 * 60 * 1000) {
    const response = await this.request(`/task/${taskId}`, {}, cacheTTL);
    return response;
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

    const result = await this.request(`/task/${taskId}/field/${fieldId}`, {
      method: "POST",
      body: JSON.stringify({ value: actualValue }),
    });

    // Clear cache for this task since it was updated
    this.clearTaskCache(taskId);

    return result;
  }

  private clearTaskCache(taskId: string): void {
    const keysToDelete = Object.keys(this.cache).filter(
      key => key.includes(`/task/${taskId}`) || key.includes(`/list/`)
    );
    keysToDelete.forEach(key => delete this.cache[key]);
  }

  async getList(listId: string, cacheTTL = 10 * 60 * 1000) {
    return this.request(`/list/${listId}`, {}, cacheTTL);
  }

  async getFolder(folderId: string, cacheTTL = 15 * 60 * 1000) {
    return this.request(`/folder/${folderId}`, {}, cacheTTL);
  }

  async getSpace(spaceId: string, cacheTTL = 15 * 60 * 1000) {
    return this.request(`/space/${spaceId}`, {}, cacheTTL);
  }

  // Team/Workspace Methods
  async getTeams(cacheTTL = 15 * 60 * 1000) {
    return this.request("/team", {}, cacheTTL);
  }

  async getSharedResources(teamId: string, cacheTTL = 10 * 60 * 1000) {
    return this.request(`/team/${teamId}/shared`, {}, cacheTTL);
  }

  // Comment Methods
  async getTaskComments(taskId: string, cacheTTL = 2 * 60 * 1000) {
    return this.request(`/task/${taskId}/comment`, {}, cacheTTL);
  }

  async createTaskComment(
    taskId: string,
    commentText: string,
    assignee?: number
  ) {
    const body: {
      comment_text: string;
      assignee?: number;
      notify_all?: boolean;
    } = {
      comment_text: commentText,
      notify_all: true,
    };

    if (assignee) {
      body.assignee = assignee;
    }

    const result = await this.request(`/task/${taskId}/comment`, {
      method: "POST",
      body: JSON.stringify(body),
    });

    // Clear comments cache for this task
    this.clearCommentsCache(taskId);
    return result;
  }

  async updateComment(
    commentId: string,
    commentText: string,
    resolved?: boolean
  ) {
    const body: {
      comment_text: string;
      resolved?: boolean;
    } = {
      comment_text: commentText,
    };

    if (resolved !== undefined) {
      body.resolved = resolved;
    }

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

  private clearCommentsCache(taskId: string): void {
    const keysToDelete = Object.keys(this.cache).filter(key =>
      key.includes(`/task/${taskId}/comment`)
    );
    keysToDelete.forEach(key => delete this.cache[key]);
    // Cache cleared successfully
  }
}

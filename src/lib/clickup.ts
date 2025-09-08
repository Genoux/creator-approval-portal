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
        console.log(`📦 Cache hit for: ${endpoint}`);
        return cached.data;
      }
    }

    console.log(`🚀 Making request to: ${this.baseUrl}${endpoint}`);
    const startTime = Date.now();

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

    const duration = Date.now() - startTime;
    console.log(
      `⏱️  Request completed in ${duration}ms - Status: ${response.status}`
    );

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
    console.log(
      `✅ Response received - Size: ${JSON.stringify(data).length} chars`
    );

    // Cache GET requests
    if (!options.method || options.method === "GET") {
      this.cache[cacheKey] = {
        data,
        timestamp: Date.now(),
        ttl: cacheTTL || this.defaultCacheTTL,
      };
      console.log(`💾 Cached response for: ${endpoint}`);
    }

    return data;
  }

  clearCache(): void {
    this.cache = {};
    console.log("🗑️  Cache cleared");
  }

  clearExpiredCache(): void {
    const keysToDelete = Object.keys(this.cache).filter(
      (key) => !this.isValidCache(this.cache[key])
    );
    keysToDelete.forEach((key) => delete this.cache[key]);
    console.log(`🧹 Cleared ${keysToDelete.length} expired cache entries`);
  }

  async getTasks(listId: string, cacheTTL = 2 * 60 * 1000) {
    const allTasks = [];
    let page = 0;
    let hasMore = true;

    while (hasMore) {
      const response = await this.request(
        `/list/${listId}/task?archived=false&include_closed=true&page=${page}&order_by=created&reverse=true&subtasks=true`,
        {},
        cacheTTL
      );

      const pageTasks = response.tasks || [];
      allTasks.push(...pageTasks);

      if (pageTasks.length === 0) {
        hasMore = false;
      } else {
        page++;
        if (page > 50) {
          console.warn(`⚠️  Reached pagination limit for list ${listId}`);
          break;
        }
      }
    }

    console.log(
      `📋 Fetched ${allTasks.length} total tasks from list ${listId}`
    );
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

    console.log(`🔄 Updating task ${taskId} field ${fieldId} to:`, actualValue);

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
      (key) => key.includes(`/task/${taskId}`) || key.includes(`/list/`)
    );
    keysToDelete.forEach((key) => delete this.cache[key]);
    console.log(
      `🗑️  Cleared ${keysToDelete.length} cache entries related to task ${taskId}`
    );
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

  // Comment Methods
  async getTaskComments(taskId: string, cacheTTL = 2 * 60 * 1000) {
    console.log(`💬 Fetching comments for task ${taskId}`);
    return this.request(`/task/${taskId}/comment`, {}, cacheTTL);
  }

  async createTaskComment(
    taskId: string,
    commentText: string,
    assignee?: number
  ) {
    console.log(`💬 Creating comment for task ${taskId}`);
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
    console.log(`💬 Updating comment ${commentId}`);
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
    console.log(`💬 Deleting comment ${commentId}`);
    return this.request(`/comment/${commentId}`, {
      method: "DELETE",
    });
  }

  private clearCommentsCache(taskId: string): void {
    const keysToDelete = Object.keys(this.cache).filter((key) =>
      key.includes(`/task/${taskId}/comment`)
    );
    keysToDelete.forEach((key) => delete this.cache[key]);
    console.log(
      `🗑️  Cleared ${keysToDelete.length} comment cache entries for task ${taskId}`
    );
  }
}

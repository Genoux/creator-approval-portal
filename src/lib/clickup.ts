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
        Authorization: this.apiToken,
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

  async getCreators(listId: string): Promise<any[]> {
    try {
      // Get tasks from ClickUp list with custom fields included
      const response = await this.request(`/list/${listId}/task`);
      console.log("Response:", response);

      console.log(
        "Raw ClickUp response:",
        JSON.stringify(response.tasks?.[0], null, 2)
      );
      return response.tasks || [];
    } catch (error) {
      console.error("Error fetching creators from ClickUp:", error);
      throw error;
    }
  }

  async updateCreatorStatus(
    taskId: string,
    status: "for_review" | "approved" | "declined"
  ): Promise<void> {
    try {
      // Update task status in ClickUp
      await this.request(`/task/${taskId}`, {
        method: "PUT",
        body: JSON.stringify({
          status,
        }),
      });
    } catch (error) {
      console.error("Error updating creator status in ClickUp:", error);
      throw error;
    }
  }
}

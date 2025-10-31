import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ClickUpAPI } from "@/lib/clickup";
import { getSharedLists } from "./ListService";

// Mock the ClickUpAPI module
vi.mock("@/lib/clickup", () => ({
  ClickUpAPI: {
    createFromSession: vi.fn(),
  },
}));

describe("getSharedLists", () => {
  const mockApiToken = "test-api-token";
  const mockUserAccessToken = "test-user-token";

  let mockClickUpInstance: {
    getTeams: ReturnType<typeof vi.fn>;
    getSharedResources: ReturnType<typeof vi.fn>;
    getListViews: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();

    // Create mock ClickUp instance
    mockClickUpInstance = {
      getTeams: vi.fn(),
      getSharedResources: vi.fn(),
      getListViews: vi.fn(),
    };

    // Mock the createFromSession to return our mock instance
    vi.mocked(ClickUpAPI.createFromSession).mockReturnValue(
      mockClickUpInstance as unknown as InstanceType<typeof ClickUpAPI>
    );

    // Suppress console.log and console.warn in tests
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Basic functionality", () => {
    it("should return empty array when no teams exist", async () => {
      mockClickUpInstance.getTeams.mockResolvedValue({ teams: [] });

      const result = await getSharedLists(mockApiToken, mockUserAccessToken);

      expect(result).toEqual([]);
      expect(ClickUpAPI.createFromSession).toHaveBeenCalledWith(
        mockApiToken,
        mockUserAccessToken
      );
    });

    it("should return empty array when teams is undefined", async () => {
      mockClickUpInstance.getTeams.mockResolvedValue({});

      const result = await getSharedLists(mockApiToken, mockUserAccessToken);

      expect(result).toEqual([]);
    });

    it("should create ClickUpAPI instance with correct tokens", async () => {
      mockClickUpInstance.getTeams.mockResolvedValue({ teams: [] });

      await getSharedLists(mockApiToken, mockUserAccessToken);

      expect(ClickUpAPI.createFromSession).toHaveBeenCalledTimes(1);
      expect(ClickUpAPI.createFromSession).toHaveBeenCalledWith(
        mockApiToken,
        mockUserAccessToken
      );
    });
  });

  describe("Creator Management list filtering", () => {
    it("should find and return Creator Management list with status filters", async () => {
      const mockTeams = [{ id: "team1", name: "Team 1" }];
      const mockSharedLists = [{ id: "list1", name: "Creator Management" }];
      const mockViews = {
        required_views: {
          list: {
            id: "view1",
            filters: {
              op: "AND",
              fields: [
                {
                  field: "status",
                  values: ["approved", "pending"],
                },
              ],
            },
          },
        },
      };

      mockClickUpInstance.getTeams.mockResolvedValue({ teams: mockTeams });
      mockClickUpInstance.getSharedResources.mockResolvedValue({
        shared: { lists: mockSharedLists },
      });
      mockClickUpInstance.getListViews.mockResolvedValue(mockViews);

      const result = await getSharedLists(mockApiToken, mockUserAccessToken);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        listId: "list1",
        listName: "Creator Management",
        viewId: "view1",
        statusFilters: ["approved", "pending"],
      });
    });

    it("should skip lists that are not named Creator Management", async () => {
      const mockTeams = [{ id: "team1", name: "Team 1" }];
      const mockSharedLists = [
        { id: "list1", name: "Other List" },
        { id: "list2", name: "Another List" },
      ];

      mockClickUpInstance.getTeams.mockResolvedValue({ teams: mockTeams });
      mockClickUpInstance.getSharedResources.mockResolvedValue({
        shared: { lists: mockSharedLists },
      });

      const result = await getSharedLists(mockApiToken, mockUserAccessToken);

      expect(result).toEqual([]);
      expect(mockClickUpInstance.getListViews).not.toHaveBeenCalled();
    });

    it("should handle multiple teams with Creator Management lists", async () => {
      const mockTeams = [
        { id: "team1", name: "Team 1" },
        { id: "team2", name: "Team 2" },
      ];

      mockClickUpInstance.getTeams.mockResolvedValue({ teams: mockTeams });

      mockClickUpInstance.getSharedResources
        .mockResolvedValueOnce({
          shared: { lists: [{ id: "list1", name: "Creator Management" }] },
        })
        .mockResolvedValueOnce({
          shared: { lists: [{ id: "list2", name: "Creator Management" }] },
        });

      const mockViews = {
        required_views: {
          list: {
            id: "view1",
            filters: { op: "AND", fields: [] },
          },
        },
      };

      mockClickUpInstance.getListViews.mockResolvedValue(mockViews);

      const result = await getSharedLists(mockApiToken, mockUserAccessToken);

      expect(result).toHaveLength(2);
      expect(result[0].listId).toBe("list1");
      expect(result[1].listId).toBe("list2");
    });
  });

  describe("Status filter extraction", () => {
    it("should extract status filters from AND operation", async () => {
      const mockTeams = [{ id: "team1", name: "Team 1" }];
      const mockSharedLists = [{ id: "list1", name: "Creator Management" }];
      const mockViews = {
        required_views: {
          list: {
            id: "view1",
            filters: {
              op: "AND",
              fields: [
                {
                  field: "status",
                  values: ["approved", "pending", "review"],
                },
              ],
            },
          },
        },
      };

      mockClickUpInstance.getTeams.mockResolvedValue({ teams: mockTeams });
      mockClickUpInstance.getSharedResources.mockResolvedValue({
        shared: { lists: mockSharedLists },
      });
      mockClickUpInstance.getListViews.mockResolvedValue(mockViews);

      const result = await getSharedLists(mockApiToken, mockUserAccessToken);

      expect(result[0].statusFilters).toEqual([
        "approved",
        "pending",
        "review",
      ]);
    });

    it("should skip non-string status values (like closed objects)", async () => {
      const mockTeams = [{ id: "team1", name: "Team 1" }];
      const mockSharedLists = [{ id: "list1", name: "Creator Management" }];
      const mockViews = {
        required_views: {
          list: {
            id: "view1",
            filters: {
              op: "AND",
              fields: [
                {
                  field: "status",
                  values: ["approved", { type: "closed" }, "pending"],
                },
              ],
            },
          },
        },
      };

      mockClickUpInstance.getTeams.mockResolvedValue({ teams: mockTeams });
      mockClickUpInstance.getSharedResources.mockResolvedValue({
        shared: { lists: mockSharedLists },
      });
      mockClickUpInstance.getListViews.mockResolvedValue(mockViews);

      const result = await getSharedLists(mockApiToken, mockUserAccessToken);

      expect(result[0].statusFilters).toEqual(["approved", "pending"]);
      expect(result[0].statusFilters).not.toContain({ type: "closed" });
    });

    it("should return empty status filters when no status field exists", async () => {
      const mockTeams = [{ id: "team1", name: "Team 1" }];
      const mockSharedLists = [{ id: "list1", name: "Creator Management" }];
      const mockViews = {
        required_views: {
          list: {
            id: "view1",
            filters: {
              op: "AND",
              fields: [
                {
                  field: "priority",
                  values: ["high", "medium"],
                },
              ],
            },
          },
        },
      };

      mockClickUpInstance.getTeams.mockResolvedValue({ teams: mockTeams });
      mockClickUpInstance.getSharedResources.mockResolvedValue({
        shared: { lists: mockSharedLists },
      });
      mockClickUpInstance.getListViews.mockResolvedValue(mockViews);

      const result = await getSharedLists(mockApiToken, mockUserAccessToken);

      expect(result[0].statusFilters).toEqual([]);
    });

    it("should handle filters without op: AND", async () => {
      const mockTeams = [{ id: "team1", name: "Team 1" }];
      const mockSharedLists = [{ id: "list1", name: "Creator Management" }];
      const mockViews = {
        required_views: {
          list: {
            id: "view1",
            filters: {
              op: "OR",
              fields: [{ field: "status", values: ["approved"] }],
            },
          },
        },
      };

      mockClickUpInstance.getTeams.mockResolvedValue({ teams: mockTeams });
      mockClickUpInstance.getSharedResources.mockResolvedValue({
        shared: { lists: mockSharedLists },
      });
      mockClickUpInstance.getListViews.mockResolvedValue(mockViews);

      const result = await getSharedLists(mockApiToken, mockUserAccessToken);

      expect(result[0].statusFilters).toEqual([]);
    });

    it("should handle missing filters object", async () => {
      const mockTeams = [{ id: "team1", name: "Team 1" }];
      const mockSharedLists = [{ id: "list1", name: "Creator Management" }];
      const mockViews = {
        required_views: {
          list: {
            id: "view1",
          },
        },
      };

      mockClickUpInstance.getTeams.mockResolvedValue({ teams: mockTeams });
      mockClickUpInstance.getSharedResources.mockResolvedValue({
        shared: { lists: mockSharedLists },
      });
      mockClickUpInstance.getListViews.mockResolvedValue(mockViews);

      const result = await getSharedLists(mockApiToken, mockUserAccessToken);

      expect(result[0].statusFilters).toEqual([]);
    });

    it("should handle missing fields array", async () => {
      const mockTeams = [{ id: "team1", name: "Team 1" }];
      const mockSharedLists = [{ id: "list1", name: "Creator Management" }];
      const mockViews = {
        required_views: {
          list: {
            id: "view1",
            filters: {
              op: "AND",
            },
          },
        },
      };

      mockClickUpInstance.getTeams.mockResolvedValue({ teams: mockTeams });
      mockClickUpInstance.getSharedResources.mockResolvedValue({
        shared: { lists: mockSharedLists },
      });
      mockClickUpInstance.getListViews.mockResolvedValue(mockViews);

      const result = await getSharedLists(mockApiToken, mockUserAccessToken);

      expect(result[0].statusFilters).toEqual([]);
    });
  });

  describe("Error handling", () => {
    it("should continue processing other teams when one team fails", async () => {
      const mockTeams = [
        { id: "team1", name: "Team 1" },
        { id: "team2", name: "Team 2" },
      ];

      mockClickUpInstance.getTeams.mockResolvedValue({ teams: mockTeams });

      mockClickUpInstance.getSharedResources
        .mockRejectedValueOnce(new Error("API Error"))
        .mockResolvedValueOnce({
          shared: { lists: [{ id: "list2", name: "Creator Management" }] },
        });

      mockClickUpInstance.getListViews.mockResolvedValue({
        required_views: {
          list: { id: "view2", filters: { op: "AND", fields: [] } },
        },
      });

      const result = await getSharedLists(mockApiToken, mockUserAccessToken);

      expect(result).toHaveLength(1);
      expect(result[0].listId).toBe("list2");
      expect(console.warn).toHaveBeenCalled();
    });

    it("should log warning when team processing fails", async () => {
      const mockTeams = [{ id: "team1", name: "Team 1" }];
      const mockError = new Error("Network error");

      mockClickUpInstance.getTeams.mockResolvedValue({ teams: mockTeams });
      mockClickUpInstance.getSharedResources.mockRejectedValue(mockError);

      await getSharedLists(mockApiToken, mockUserAccessToken);

      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining(
          "Error fetching shared resources for team team1"
        ),
        mockError
      );
    });

    it("should handle empty shared resources", async () => {
      const mockTeams = [{ id: "team1", name: "Team 1" }];

      mockClickUpInstance.getTeams.mockResolvedValue({ teams: mockTeams });
      mockClickUpInstance.getSharedResources.mockResolvedValue({
        shared: { lists: [] },
      });

      const result = await getSharedLists(mockApiToken, mockUserAccessToken);

      expect(result).toEqual([]);
    });

    it("should handle missing shared object", async () => {
      const mockTeams = [{ id: "team1", name: "Team 1" }];

      mockClickUpInstance.getTeams.mockResolvedValue({ teams: mockTeams });
      mockClickUpInstance.getSharedResources.mockResolvedValue({});

      const result = await getSharedLists(mockApiToken, mockUserAccessToken);

      expect(result).toEqual([]);
    });
  });

  describe("Multiple status filters", () => {
    it("should handle multiple status filter fields", async () => {
      const mockTeams = [{ id: "team1", name: "Team 1" }];
      const mockSharedLists = [{ id: "list1", name: "Creator Management" }];
      const mockViews = {
        required_views: {
          list: {
            id: "view1",
            filters: {
              op: "AND",
              fields: [
                { field: "status", values: ["approved"] },
                { field: "status", values: ["pending", "review"] },
              ],
            },
          },
        },
      };

      mockClickUpInstance.getTeams.mockResolvedValue({ teams: mockTeams });
      mockClickUpInstance.getSharedResources.mockResolvedValue({
        shared: { lists: mockSharedLists },
      });
      mockClickUpInstance.getListViews.mockResolvedValue(mockViews);

      const result = await getSharedLists(mockApiToken, mockUserAccessToken);

      expect(result[0].statusFilters).toEqual([
        "approved",
        "pending",
        "review",
      ]);
    });

    it("should handle empty values array", async () => {
      const mockTeams = [{ id: "team1", name: "Team 1" }];
      const mockSharedLists = [{ id: "list1", name: "Creator Management" }];
      const mockViews = {
        required_views: {
          list: {
            id: "view1",
            filters: {
              op: "AND",
              fields: [{ field: "status", values: [] }],
            },
          },
        },
      };

      mockClickUpInstance.getTeams.mockResolvedValue({ teams: mockTeams });
      mockClickUpInstance.getSharedResources.mockResolvedValue({
        shared: { lists: mockSharedLists },
      });
      mockClickUpInstance.getListViews.mockResolvedValue(mockViews);

      const result = await getSharedLists(mockApiToken, mockUserAccessToken);

      expect(result[0].statusFilters).toEqual([]);
    });
  });
});

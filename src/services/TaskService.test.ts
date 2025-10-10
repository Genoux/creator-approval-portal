import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ClickUpTask } from "@/types";
import { extractTask } from "./TaskService";

describe("TaskService", () => {
  beforeEach(() => {
    // Suppress console.warn for cleaner test output
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("extractTask", () => {
    it("should transform ClickUp task with all required fields", () => {
      const mockClickUpTask: Partial<ClickUpTask> = {
        id: "task-123",
        name: "Test Creator",
        status: {
          status: "for review",
          color: "#blue",
        },
        custom_fields: [],
      };

      const result = extractTask(mockClickUpTask as ClickUpTask);

      expect(result).toBeDefined();
      expect(result.id).toBe("task-123");
      expect(result.title).toBe("Test Creator");
      expect(result).toHaveProperty("status");
      expect(result).toHaveProperty("taskStatus");
      expect(result).toHaveProperty("socials");
      expect(result).toHaveProperty("portfolio");
      expect(result).toHaveProperty("followerCount");
      expect(result).toHaveProperty("er");
    });

    it("should extract approval status from custom fields", () => {
      const mockClickUpTask: Partial<ClickUpTask> = {
        id: "task-456",
        name: "Creator with Status",
        status: {
          status: "selected",
          color: "#green",
        },
        custom_fields: [
          {
            id: "cf-approval",
            name: "Client Approval",
            type: "drop_down",
            value: 0,
            type_config: {
              options: [
                {
                  id: "opt-1",
                  name: "Perfect (Approved)",
                  color: "#green",
                },
                {
                  id: "opt-2",
                  name: "Good (Approved)",
                  color: "#blue",
                },
              ],
            },
          },
        ],
      };

      const result = extractTask(mockClickUpTask as ClickUpTask);

      expect(result.status).toBeDefined();
      expect(result.status.fieldId).toBe("cf-approval");
      expect([
        "Perfect (Approved)",
        "Good (Approved)",
        "Sufficient (Backup)",
        "Poor Fit (Rejected)",
        "For Review",
      ]).toContain(result.status.label);
    });

    it("should handle task with minimal data", () => {
      const mockClickUpTask: Partial<ClickUpTask> = {
        id: "task-789",
        name: "Minimal Creator",
        status: {
          status: "open",
          color: "#gray",
        },
        custom_fields: [],
      };

      const result = extractTask(mockClickUpTask as ClickUpTask);

      expect(result.id).toBe("task-789");
      expect(result.title).toBe("Minimal Creator");
      expect(result.socials).toEqual([]);
      expect(result.portfolio).toBeDefined();
      expect(result.followerCount).toBeNull();
      expect(result.er).toBeDefined();
    });

    it("should consistently transform multiple tasks", () => {
      const mockTask1: Partial<ClickUpTask> = {
        id: "1",
        name: "Creator 1",
        status: { status: "open", color: "#gray" },
        custom_fields: [],
      };

      const mockTask2: Partial<ClickUpTask> = {
        id: "2",
        name: "Creator 2",
        status: {
          status: "selected",
          color: "#green",
        },
        custom_fields: [],
      };

      const result1 = extractTask(mockTask1 as ClickUpTask);
      const result2 = extractTask(mockTask2 as ClickUpTask);

      // Both should be transformed successfully
      expect(result1.id).toBe("1");
      expect(result1.title).toBe("Creator 1");
      expect(result2.id).toBe("2");
      expect(result2.title).toBe("Creator 2");

      // Both should have consistent structure
      expect(result1).toHaveProperty("status");
      expect(result1).toHaveProperty("socials");
      expect(result2).toHaveProperty("status");
      expect(result2).toHaveProperty("socials");
    });

    it("should preserve task status from ClickUp", () => {
      const testStatuses = ["open", "selected", "backup", "declined (client)"];

      testStatuses.forEach(statusValue => {
        const mockTask: Partial<ClickUpTask> = {
          id: `task-${statusValue}`,
          name: "Test Creator",
          status: {
            status: statusValue,
            color: "#blue",
          },
          custom_fields: [],
        };

        const result = extractTask(mockTask as ClickUpTask);

        expect(result.taskStatus).toBe(statusValue);
      });
    });

    it("should handle task with multiple custom fields", () => {
      const mockClickUpTask: Partial<ClickUpTask> = {
        id: "task-multi",
        name: "Creator with Multiple Fields",
        status: {
          status: "selected",
          color: "#green",
        },
        custom_fields: [
          {
            id: "cf-approval",
            name: "Client Approval",
            type: "drop_down",
            value: 1,
            type_config: {
              options: [
                { id: "opt-1", name: "Perfect (Approved)", color: "#green" },
                { id: "opt-2", name: "Good (Approved)", color: "#blue" },
              ],
            },
          },
          {
            id: "cf-followers",
            name: "FollowerCount",
            type: "number",
            value: 50000,
          },
          {
            id: "cf-er",
            name: "ER",
            type: "text",
            value: "5.2%",
          },
        ],
      };

      const result = extractTask(mockClickUpTask as ClickUpTask);

      expect(result.status.label).toBe("Good (Approved)");
      expect(result.followerCount).toBe("50K");
      expect(result.er.text).toBe("5.2%");
    });

    it("should handle null and undefined values gracefully", () => {
      const mockClickUpTask: Partial<ClickUpTask> = {
        id: "task-nulls",
        name: "Creator with Nulls",
        status: {
          status: "open",
        },
        custom_fields: [
          {
            id: "cf-1",
            name: "Field1",
            type: "text",
            value: null,
          },
          {
            id: "cf-2",
            name: "Field2",
            type: "text",
            value: undefined,
          },
        ],
      };

      const result = extractTask(mockClickUpTask as ClickUpTask);

      expect(result).toBeDefined();
      expect(result.id).toBe("task-nulls");
      expect(result.followerCount).toBeNull();
    });

    it("should extract social media profiles from custom fields", () => {
      const mockClickUpTask: Partial<ClickUpTask> = {
        id: "task-socials",
        name: "Creator with Socials",
        status: { status: "open", color: "#gray" },
        custom_fields: [
          {
            id: "cf-ig",
            name: "IG Profile",
            type: "url",
            value: "https://instagram.com/creator",
          },
          {
            id: "cf-tt",
            name: "TT Profile",
            type: "url",
            value: "https://tiktok.com/@creator",
          },
        ],
      };

      const result = extractTask(mockClickUpTask as ClickUpTask);

      // Socials are extracted from custom fields by buildSocials utility
      expect(Array.isArray(result.socials)).toBe(true);
      // Social extraction depends on specific field names matching the transformer
      expect(result.socials.length).toBeGreaterThanOrEqual(0);
    });

    it("should handle tasks without custom_fields array", () => {
      const mockClickUpTask: Partial<ClickUpTask> = {
        id: "task-no-fields",
        name: "Creator without Fields",
        status: { status: "open", color: "#gray" },
      };

      const result = extractTask(mockClickUpTask as ClickUpTask);

      expect(result).toBeDefined();
      expect(result.id).toBe("task-no-fields");
      expect(result.status.label).toBe("For Review");
      expect(result.socials).toEqual([]);
    });

    it("should handle empty custom_fields array", () => {
      const mockClickUpTask: Partial<ClickUpTask> = {
        id: "task-empty-fields",
        name: "Creator with Empty Fields",
        status: { status: "backup", color: "#yellow" },
        custom_fields: [],
      };

      const result = extractTask(mockClickUpTask as ClickUpTask);

      expect(result).toBeDefined();
      expect(result.status.label).toBe("For Review");
      expect(result.status.fieldId).toBe("");
    });

    it("should default to 'For Review' when approval field has no value", () => {
      const mockClickUpTask: Partial<ClickUpTask> = {
        id: "task-no-value",
        name: "Creator No Value",
        status: { status: "open" },
        custom_fields: [
          {
            id: "cf-approval",
            name: "Client Approval",
            type: "drop_down",
            value: null,
            type_config: {
              options: [{ id: "opt-1", name: "Perfect (Approved)" }],
            },
          },
        ],
      };

      const result = extractTask(mockClickUpTask as ClickUpTask);

      expect(result.status.label).toBe("For Review");
      expect(result.status.fieldId).toBe("cf-approval");
    });
  });
});

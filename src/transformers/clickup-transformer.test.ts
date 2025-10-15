import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ClickUpTask } from "@/types/clickup";
import type { Task } from "@/types/tasks";
import { transformClickUpTask } from "./clickup-transformer";

// Mock the dependencies
vi.mock("@automattic/number-formatters", () => ({
  formatNumberCompact: (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  },
}));

vi.mock("@/utils", () => ({
  buildSocials: (urls: {
    instagram?: string | null;
    tiktok?: string | null;
    youtube?: string | null;
    linkedin?: string | null;
  }) => {
    const socials = [];
    if (urls.instagram)
      socials.push({
        platform: "Instagram",
        handle: "@test",
        url: urls.instagram,
      });
    if (urls.tiktok)
      socials.push({ platform: "TikTok", handle: "@test", url: urls.tiktok });
    if (urls.youtube)
      socials.push({
        platform: "YouTube",
        handle: "@test",
        url: urls.youtube,
      });
    if (urls.linkedin)
      socials.push({
        platform: "LinkedIn",
        handle: "test",
        url: urls.linkedin,
      });
    return socials;
  },
}));

describe("transformClickUpTask", () => {
  const originalConsoleWarn = console.warn;

  beforeEach(() => {
    console.warn = vi.fn();
  });

  afterEach(() => {
    console.warn = originalConsoleWarn;
    vi.clearAllMocks();
  });

  describe("transform", () => {
    it("should transform basic ClickUp task to Task", () => {
      const clickUpTask: ClickUpTask = {
        id: "123",
        name: "Test Creator",
        date_created: "1234567890",
        status: { status: "open" },
        custom_fields: [
          {
            id: "field-1",
            name: "Client Approval",
            type: "dropdown",
            value: 0,
            type_config: {
              options: [
                { id: "opt-1", name: "For Review" },
                { id: "opt-2", name: "Perfect (Approved)" },
              ],
            },
          },
          {
            id: "field-2",
            name: "Follower Count",
            type: "number",
            value: "1500000",
          },
          {
            id: "field-3",
            name: "IG Profile",
            type: "url",
            value: "https://instagram.com/testuser",
          },
        ],
      };

      const result: Task = transformClickUpTask(clickUpTask);

      expect(result.id).toBe("123");
      expect(result.title).toBe("Test Creator");
      expect(result.date_created).toBe("1234567890");
      expect(result.status.label).toBe("For Review");
      expect(result.status.fieldId).toBe("field-1");
      expect(result.followerCount).toBe("1.5M");
    });

    it("should handle missing Client Approval field", () => {
      const clickUpTask: ClickUpTask = {
        id: "456",
        name: "No Approval Field",
        date_created: "1234567890",
        status: { status: "open" },
        custom_fields: [],
      };

      const result = transformClickUpTask(clickUpTask);

      expect(console.warn).toHaveBeenCalledWith(
        '⚠️  Task "No Approval Field" (456) is missing "Client Approval" field'
      );
      expect(result.status.label).toBe("For Review");
      expect(result.status.fieldId).toBe("");
    });

    it("should handle all approval status labels", () => {
      const baseTask: ClickUpTask = {
        id: "789",
        name: "Status Test",
        date_created: "1234567890",
        status: { status: "open" },
      };

      const statuses = [
        { value: 0, expected: "For Review" },
        { value: 1, expected: "Perfect (Approved)" },
        { value: 2, expected: "Good (Approved)" },
        { value: 3, expected: "Sufficient (Backup)" },
        { value: 4, expected: "Poor Fit (Rejected)" },
      ];

      for (const { value, expected } of statuses) {
        const task = {
          ...baseTask,
          custom_fields: [
            {
              id: "approval",
              name: "Client Approval",
              type: "dropdown",
              value,
              type_config: {
                options: [
                  { id: "1", name: "For Review" },
                  { id: "2", name: "Perfect (Approved)" },
                  { id: "3", name: "Good (Approved)" },
                  { id: "4", name: "Sufficient (Backup)" },
                  { id: "5", name: "Poor Fit (Rejected)" },
                ],
              },
            },
          ],
        };

        const result = transformClickUpTask(task);
        expect(result.status.label).toBe(expected);
      }
    });

    it("should default to 'For Review' for invalid approval value", () => {
      const clickUpTask: ClickUpTask = {
        id: "999",
        name: "Invalid Status",
        date_created: "1234567890",
        status: { status: "open" },
        custom_fields: [
          {
            id: "approval",
            name: "Client Approval",
            type: "dropdown",
            value: null,
            type_config: {
              options: [{ id: "1", name: "For Review" }],
            },
          },
        ],
      };

      const result = transformClickUpTask(clickUpTask);
      expect(result.status.label).toBe("For Review");
    });

    it("should create proper field map from custom fields", () => {
      const clickUpTask: ClickUpTask = {
        id: "111",
        name: "Field Map Test",
        date_created: "1234567890",
        status: { status: "open" },
        custom_fields: [
          {
            id: "f1",
            name: "Client Approval",
            type: "dropdown",
            value: 0,
            type_config: { options: [{ id: "1", name: "For Review" }] },
          },
          {
            id: "f2",
            name: "ER",
            type: "text",
            value: "5.2%",
          },
          {
            id: "f3",
            name: "ER Formula",
            type: "text",
            value: "formula_value",
          },
          {
            id: "f4",
            name: "Example",
            type: "url",
            value: "https://example.com",
          },
          {
            id: "f5",
            name: "Why They're a Good Fit",
            type: "text",
            value: "Great fit",
          },
          {
            id: "f6",
            name: "InBeat Portfolio",
            type: "url",
            value: "https://portfolio.com",
          },
        ],
      };

      const result = transformClickUpTask(clickUpTask);

      expect(result.er.text).toBe("5.2%");
      expect(result.er.formula).toBe("formula_value");
      expect(result.portfolio.example).toBe("https://example.com");
      expect(result.portfolio.whyGoodFit).toBe("Great fit");
      expect(result.portfolio.inBeatPortfolio).toBe("https://portfolio.com");
    });

    it("should handle social media fields", () => {
      const clickUpTask: ClickUpTask = {
        id: "222",
        name: "Social Test",
        date_created: "1234567890",
        status: { status: "open" },
        custom_fields: [
          {
            id: "approval",
            name: "Client Approval",
            type: "dropdown",
            value: 0,
            type_config: { options: [{ id: "1", name: "For Review" }] },
          },
          {
            id: "ig",
            name: "IG Profile",
            type: "url",
            value: "https://instagram.com/user",
          },
          {
            id: "tt",
            name: "TT Profile",
            type: "url",
            value: "https://tiktok.com/@user",
          },
          {
            id: "yt",
            name: "YT Profile",
            type: "url",
            value: "https://youtube.com/@user",
          },
          {
            id: "li",
            name: "LinkedIn",
            type: "url",
            value: "https://linkedin.com/in/user",
          },
        ],
      };

      const result = transformClickUpTask(clickUpTask);

      expect(result.socials).toHaveLength(4);
      expect(result.socials[0].platform).toBe("Instagram");
      expect(result.socials[1].platform).toBe("TikTok");
      expect(result.socials[2].platform).toBe("YouTube");
      expect(result.socials[3].platform).toBe("LinkedIn");
    });

    it("should handle null/undefined follower count", () => {
      const clickUpTask: ClickUpTask = {
        id: "333",
        name: "No Followers",
        date_created: "1234567890",
        status: { status: "open" },
        custom_fields: [
          {
            id: "approval",
            name: "Client Approval",
            type: "dropdown",
            value: 0,
            type_config: { options: [{ id: "1", name: "For Review" }] },
          },
        ],
      };

      const result = transformClickUpTask(clickUpTask);
      expect(result.followerCount).toBeNull();
    });

    it("should use value_richtext when available", () => {
      const clickUpTask: ClickUpTask = {
        id: "444",
        name: "Rich Text Test",
        date_created: "1234567890",
        status: { status: "open" },
        custom_fields: [
          {
            id: "approval",
            name: "Client Approval",
            type: "dropdown",
            value: 0,
            type_config: { options: [{ id: "1", name: "For Review" }] },
          },
          {
            id: "rich",
            name: "ER",
            type: "text",
            value: "plain",
            value_richtext: "rich_text_version",
          },
        ],
      };

      const result = transformClickUpTask(clickUpTask);
      expect(result.er.text).toBe("rich_text_version");
    });
  });
});

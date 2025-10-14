import { describe, expect, it } from "vitest";
import type { ApprovalLabel } from "@/types";
import { getDisplayLabel, STATUS_CONFIG } from "./index";

describe("STATUS_CONFIG", () => {
  it("should have correct configuration structure", () => {
    expect(STATUS_CONFIG).toHaveLength(5);

    for (const config of STATUS_CONFIG) {
      expect(config).toHaveProperty("label");
      expect(config).toHaveProperty("displayLabel");
      expect(typeof config.label).toBe("string");
      expect(typeof config.displayLabel).toBe("string");
    }
  });

  it("should have all expected status labels", () => {
    const labels = STATUS_CONFIG.map(c => c.label);

    expect(labels).toContain("Perfect (Approved)");
    expect(labels).toContain("Good (Approved)");
    expect(labels).toContain("Sufficient (Backup)");
    expect(labels).toContain("Poor Fit (Rejected)");
    expect(labels).toContain("For Review");
  });

  it("should have correct display labels", () => {
    const displayLabels = STATUS_CONFIG.map(c => c.displayLabel);

    expect(displayLabels).toContain("Perfect");
    expect(displayLabels).toContain("Good");
    expect(displayLabels).toContain("Backups");
    expect(displayLabels).toContain("Rejected");
    expect(displayLabels).toContain("Needs review");
  });

  it("should have correct task status mappings", () => {
    const perfectConfig = STATUS_CONFIG.find(
      c => c.label === "Perfect (Approved)"
    );
    const goodConfig = STATUS_CONFIG.find(c => c.label === "Good (Approved)");
    const backupConfig = STATUS_CONFIG.find(
      c => c.label === "Sufficient (Backup)"
    );
    const rejectedConfig = STATUS_CONFIG.find(
      c => c.label === "Poor Fit (Rejected)"
    );
    const reviewConfig = STATUS_CONFIG.find(c => c.label === "For Review");

    expect(perfectConfig?.taskStatus).toBe("selected");
    expect(goodConfig?.taskStatus).toBe("selected");
    expect(backupConfig?.taskStatus).toBe("backup");
    expect(rejectedConfig?.taskStatus).toBe("declined (client)");
    expect(reviewConfig?.taskStatus).toBeUndefined();
  });

  it("should have unique labels", () => {
    const labels = STATUS_CONFIG.map(c => c.label);
    const uniqueLabels = new Set(labels);

    expect(labels.length).toBe(uniqueLabels.size);
  });

  it("should have unique display labels", () => {
    const displayLabels = STATUS_CONFIG.map(c => c.displayLabel);
    const uniqueDisplayLabels = new Set(displayLabels);

    expect(displayLabels.length).toBe(uniqueDisplayLabels.size);
  });
});

describe("getDisplayLabel", () => {
  it("should return correct display label for Perfect (Approved)", () => {
    const result = getDisplayLabel("Perfect (Approved)" as ApprovalLabel);
    expect(result).toBe("Perfect");
  });

  it("should return correct display label for Good (Approved)", () => {
    const result = getDisplayLabel("Good (Approved)" as ApprovalLabel);
    expect(result).toBe("Good");
  });

  it("should return correct display label for Sufficient (Backup)", () => {
    const result = getDisplayLabel("Sufficient (Backup)" as ApprovalLabel);
    expect(result).toBe("Backups");
  });

  it("should return correct display label for Poor Fit (Rejected)", () => {
    const result = getDisplayLabel("Poor Fit (Rejected)" as ApprovalLabel);
    expect(result).toBe("Rejected");
  });

  it("should return correct display label for For Review", () => {
    const result = getDisplayLabel("For Review" as ApprovalLabel);
    expect(result).toBe("Needs review");
  });

  it("should return original label for unknown status", () => {
    const unknownLabel = "Unknown Status" as ApprovalLabel;
    const result = getDisplayLabel(unknownLabel);

    expect(result).toBe("Unknown Status");
  });

  it("should handle empty string", () => {
    const result = getDisplayLabel("" as ApprovalLabel);
    expect(result).toBe("");
  });

  it("should be case-sensitive", () => {
    const result = getDisplayLabel("perfect (approved)" as ApprovalLabel);
    expect(result).toBe("perfect (approved)");
    expect(result).not.toBe("Perfect");
  });

  it("should handle labels with extra whitespace", () => {
    const result = getDisplayLabel(" Perfect (Approved) " as ApprovalLabel);
    expect(result).toBe(" Perfect (Approved) ");
  });

  it("should return display label for all configured statuses", () => {
    for (const config of STATUS_CONFIG) {
      const result = getDisplayLabel(config.label as ApprovalLabel);
      expect(result).toBe(config.displayLabel);
    }
  });
});

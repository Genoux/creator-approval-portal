import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Task } from "@/types";
import { useTaskCounts } from "./useTaskCounts";

const createMockTask = (
  id: string,
  statusLabel: Task["status"]["label"]
): Task => ({
  id,
  taskStatus: "open",
  title: `Task ${id}`,
  followerCount: "1000",
  date_created: "2024-01-01",
  status: {
    label: statusLabel,
    fieldId: "field-123",
  },
  er: {
    text: "5.2%",
    formula: "0.052",
  },
  socials: [],
  portfolio: {
    example: null,
    whyGoodFit: null,
    inBeatPortfolio: null,
  },
});

describe("useTaskCounts", () => {
  describe("without filter (returns all counts)", () => {
    it("should return correct counts for all statuses", () => {
      const tasks: Task[] = [
        createMockTask("1", "For Review"),
        createMockTask("2", "For Review"),
        createMockTask("3", "Perfect (Approved)"),
        createMockTask("4", "Good (Approved)"),
        createMockTask("5", "Sufficient (Backup)"),
        createMockTask("6", "Poor Fit (Rejected)"),
      ];

      const { result } = renderHook(() => useTaskCounts(tasks));

      expect(result.current).toEqual({
        "For Review": 2,
        "Perfect (Approved)": 1,
        "Good (Approved)": 1,
        "Sufficient (Backup)": 1,
        "Poor Fit (Rejected)": 1,
        Selected: 2, // Perfect + Good
        All: 6,
      });
    });

    it("should return zero counts for empty task array", () => {
      const { result } = renderHook(() => useTaskCounts([]));

      expect(result.current).toEqual({
        "For Review": 0,
        "Perfect (Approved)": 0,
        "Good (Approved)": 0,
        "Sufficient (Backup)": 0,
        "Poor Fit (Rejected)": 0,
        Selected: 0,
        All: 0,
      });
    });

    it("should calculate Selected count as sum of Perfect and Good", () => {
      const tasks: Task[] = [
        createMockTask("1", "Perfect (Approved)"),
        createMockTask("2", "Perfect (Approved)"),
        createMockTask("3", "Good (Approved)"),
        createMockTask("4", "Sufficient (Backup)"),
      ];

      const { result } = renderHook(() => useTaskCounts(tasks));

      expect(result.current.Selected).toBe(3); // 2 Perfect + 1 Good
      expect(result.current.All).toBe(4);
    });
  });

  describe("with filter (returns specific count)", () => {
    const tasks: Task[] = [
      createMockTask("1", "For Review"),
      createMockTask("2", "For Review"),
      createMockTask("3", "Perfect (Approved)"),
      createMockTask("4", "Good (Approved)"),
      createMockTask("5", "Sufficient (Backup)"),
    ];

    it('should return count for "For Review" status', () => {
      const { result } = renderHook(() => useTaskCounts(tasks, "For Review"));

      expect(result.current).toBe(2);
    });

    it('should return count for "Perfect (Approved)" status', () => {
      const { result } = renderHook(() =>
        useTaskCounts(tasks, "Perfect (Approved)")
      );

      expect(result.current).toBe(1);
    });

    it('should return count for "Selected" virtual status', () => {
      const { result } = renderHook(() => useTaskCounts(tasks, "Selected"));

      expect(result.current).toBe(2); // Perfect + Good
    });

    it('should return count for "All" virtual status', () => {
      const { result } = renderHook(() => useTaskCounts(tasks, "All"));

      expect(result.current).toBe(5);
    });

    it("should return 0 for status with no tasks", () => {
      const { result } = renderHook(() =>
        useTaskCounts(tasks, "Poor Fit (Rejected)")
      );

      expect(result.current).toBe(0);
    });
  });

  describe("memoization", () => {
    it("should memoize results for same task array reference", () => {
      const tasks: Task[] = [
        createMockTask("1", "For Review"),
        createMockTask("2", "Perfect (Approved)"),
      ];

      const { result, rerender } = renderHook(() => useTaskCounts(tasks));

      const firstResult = result.current;
      rerender();
      const secondResult = result.current;

      // Should be the same object reference
      expect(firstResult).toBe(secondResult);
    });

    it("should recalculate when task array changes", () => {
      const initialTasks: Task[] = [createMockTask("1", "For Review")];

      const { result, rerender } = renderHook(
        ({ tasks }) => useTaskCounts(tasks),
        {
          initialProps: { tasks: initialTasks },
        }
      );

      expect(result.current.All).toBe(1);

      const updatedTasks = [
        ...initialTasks,
        createMockTask("2", "Perfect (Approved)"),
      ];

      rerender({ tasks: updatedTasks });

      expect(result.current.All).toBe(2);
    });
  });

  describe("edge cases", () => {
    it("should handle tasks with only one status type", () => {
      const tasks: Task[] = [
        createMockTask("1", "For Review"),
        createMockTask("2", "For Review"),
        createMockTask("3", "For Review"),
      ];

      const { result } = renderHook(() => useTaskCounts(tasks));

      expect(result.current["For Review"]).toBe(3);
      expect(result.current["Perfect (Approved)"]).toBe(0);
      expect(result.current.Selected).toBe(0);
      expect(result.current.All).toBe(3);
    });

    it("should handle large number of tasks", () => {
      const tasks: Task[] = Array.from({ length: 1000 }, (_, i) =>
        createMockTask(
          `task-${i}`,
          i % 2 === 0 ? "For Review" : "Perfect (Approved)"
        )
      );

      const { result } = renderHook(() => useTaskCounts(tasks));

      expect(result.current["For Review"]).toBe(500);
      expect(result.current["Perfect (Approved)"]).toBe(500);
      expect(result.current.Selected).toBe(500);
      expect(result.current.All).toBe(1000);
    });
  });
});

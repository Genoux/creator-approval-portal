import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { formatFollowerCount, formatTimeAgo } from "./formatting";

describe("formatFollowerCount", () => {
  it("should format millions correctly", () => {
    expect(formatFollowerCount(1000000)).toBe("1.0M");
    expect(formatFollowerCount(1500000)).toBe("1.5M");
    expect(formatFollowerCount(2234567)).toBe("2.2M");
    expect(formatFollowerCount(10000000)).toBe("10.0M");
  });

  it("should format thousands correctly", () => {
    expect(formatFollowerCount(1000)).toBe("1.0K");
    expect(formatFollowerCount(1500)).toBe("1.5K");
    expect(formatFollowerCount(45678)).toBe("45.7K");
    expect(formatFollowerCount(999999)).toBe("1000.0K");
  });

  it("should return raw number for under 1000", () => {
    expect(formatFollowerCount(0)).toBe("0");
    expect(formatFollowerCount(1)).toBe("1");
    expect(formatFollowerCount(999)).toBe("999");
    expect(formatFollowerCount(500)).toBe("500");
  });
});

describe("formatTimeAgo", () => {
  beforeEach(() => {
    // Mock Date.now() to return a fixed timestamp: Jan 1, 2024 00:00:00
    const mockNow = new Date("2024-01-01T00:00:00Z").getTime();
    vi.useFakeTimers();
    vi.setSystemTime(mockNow);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return 'just now' for very recent timestamps", () => {
    const now = Date.now();
    const thirtySecondsAgo = new Date(now - 30 * 1000).getTime();

    expect(formatTimeAgo(thirtySecondsAgo.toString())).toBe("just now");
    expect(formatTimeAgo(now.toString())).toBe("just now");
  });

  it("should format minutes ago", () => {
    const now = Date.now();
    const twoMinutesAgo = new Date(now - 2 * 60 * 1000).getTime();
    const thirtyMinutesAgo = new Date(now - 30 * 60 * 1000).getTime();

    expect(formatTimeAgo(twoMinutesAgo.toString())).toBe("2m ago");
    expect(formatTimeAgo(thirtyMinutesAgo.toString())).toBe("30m ago");
  });

  it("should format hours ago", () => {
    const now = Date.now();
    const oneHourAgo = new Date(now - 1 * 60 * 60 * 1000).getTime();
    const twelveHoursAgo = new Date(now - 12 * 60 * 60 * 1000).getTime();

    expect(formatTimeAgo(oneHourAgo.toString())).toBe("1h ago");
    expect(formatTimeAgo(twelveHoursAgo.toString())).toBe("12h ago");
  });

  it("should format days ago", () => {
    const now = Date.now();
    const oneDayAgo = new Date(now - 1 * 24 * 60 * 60 * 1000).getTime();
    const threeDaysAgo = new Date(now - 3 * 24 * 60 * 60 * 1000).getTime();

    expect(formatTimeAgo(oneDayAgo.toString())).toBe("1d ago");
    expect(formatTimeAgo(threeDaysAgo.toString())).toBe("3d ago");
  });

  it("should return formatted date for over a week", () => {
    const now = Date.now();
    const eightDaysAgo = new Date(now - 8 * 24 * 60 * 60 * 1000).getTime();

    const result = formatTimeAgo(eightDaysAgo.toString());
    // Should be a localized date string
    expect(result).toContain("2023");
  });

  it("should handle Date objects", () => {
    const now = new Date();
    const twoMinutesAgo = new Date(now.getTime() - 2 * 60 * 1000);

    expect(formatTimeAgo(twoMinutesAgo)).toBe("2m ago");
  });

  it("should handle string timestamps", () => {
    const now = Date.now();
    const fiveMinutesAgo = (now - 5 * 60 * 1000).toString();

    expect(formatTimeAgo(fiveMinutesAgo)).toBe("5m ago");
  });
});

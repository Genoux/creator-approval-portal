import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { getS3ImageUrl } from "./s3";

describe("getS3ImageUrl", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset env before each test
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_S3_BUCKET_NAME: "inbeat-project-creator-approval-portal",
      NEXT_PUBLIC_S3_REGION: "us-east-1",
    };
  });

  afterEach(() => {
    // Restore original env
    process.env = originalEnv;
  });

  it("should generate correct S3 URL for simple task name", () => {
    const url = getS3ImageUrl("TestTask");
    expect(url).toBe(
      "https://inbeat-project-creator-approval-portal.s3.us-east-1.amazonaws.com/testtask",
    );
  });

  it("should clean task name by removing special characters", () => {
    const url = getS3ImageUrl("Test-Task_123");
    expect(url).toBe(
      "https://inbeat-project-creator-approval-portal.s3.us-east-1.amazonaws.com/testtask123",
    );
  });

  it("should convert to lowercase", () => {
    const url = getS3ImageUrl("UPPERCASE");
    expect(url).toBe(
      "https://inbeat-project-creator-approval-portal.s3.us-east-1.amazonaws.com/uppercase",
    );
  });

  it("should handle task names with spaces", () => {
    const url = getS3ImageUrl("Task With Spaces");
    expect(url).toBe(
      "https://inbeat-project-creator-approval-portal.s3.us-east-1.amazonaws.com/taskwithspaces",
    );
  });

  it("should throw error if bucket name is missing", () => {
    delete process.env.NEXT_PUBLIC_S3_BUCKET_NAME;
    expect(() => getS3ImageUrl("test")).toThrow(
      "S3 bucket name or region is not set",
    );
  });

  it("should throw error if region is missing", () => {
    delete process.env.NEXT_PUBLIC_S3_REGION;
    expect(() => getS3ImageUrl("test")).toThrow(
      "S3 bucket name or region is not set",
    );
  });
});

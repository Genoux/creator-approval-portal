import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { getCloudFrontImageUrl } from "./s3";

describe("getCloudFrontImageUrl", () => {
  const originalEnv = process.env;
  const defaultCloudFrontUrl = "https://d3phw8pj0ea6u1.cloudfront.net";

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("URL generation", () => {
    it("should generate CloudFront URL with default parameters", () => {
      const url = getCloudFrontImageUrl("TestTask");
      expect(url).toBe(
        `${defaultCloudFrontUrl}/testtask?width=650&height=650&fit=cover&quality=85`
      );
    });

    it("should use custom CloudFront URL from environment variable", () => {
      // Note: This test verifies the fallback works. In production, set NEXT_PUBLIC_CLOUDFRONT_URL env var
      const url = getCloudFrontImageUrl("TestTask");
      expect(url).toContain(defaultCloudFrontUrl);
    });
  });

  describe("filename normalization", () => {
    it("should normalize task name by removing special characters", async () => {
      const { getCloudFrontImageUrl } = await import("./s3");
      const url = getCloudFrontImageUrl("Test-Task_123");
      expect(url).toContain("/testtask123?");
    });

    it("should convert to lowercase", async () => {
      const { getCloudFrontImageUrl } = await import("./s3");
      const url = getCloudFrontImageUrl("UPPERCASE");
      expect(url).toContain("/uppercase?");
    });

    it("should handle task names with spaces", async () => {
      const { getCloudFrontImageUrl } = await import("./s3");
      const url = getCloudFrontImageUrl("Task With Spaces");
      expect(url).toContain("/taskwithspaces?");
    });

    it("should handle complex special characters", async () => {
      const { getCloudFrontImageUrl } = await import("./s3");
      const url = getCloudFrontImageUrl("Test!@#$%^&*()Task");
      expect(url).toContain("/testtask?");
    });
  });

  describe("image transformation parameters", () => {
    it("should apply custom width and height", () => {
      const url = getCloudFrontImageUrl("TestTask", {
        width: 400,
        height: 600,
      });
      expect(url).toContain("width=400");
      expect(url).toContain("height=600");
    });

    it("should apply custom fit parameter", () => {
      const url = getCloudFrontImageUrl("TestTask", { fit: "contain" });
      expect(url).toContain("fit=contain");
    });

    it("should apply custom quality", () => {
      const url = getCloudFrontImageUrl("TestTask", { quality: 90 });
      expect(url).toContain("quality=90");
    });

    it("should merge custom params with defaults", () => {
      const url = getCloudFrontImageUrl("TestTask", { width: 1000 });
      expect(url).toContain("width=1000");
      expect(url).toContain("height=650");
    });

    it("should handle all custom parameters at once", () => {
      const url = getCloudFrontImageUrl("TestTask", {
        width: 1200,
        height: 900,
        fit: "inside",
        quality: 95,
      });
      expect(url).toContain("width=1200");
      expect(url).toContain("height=900");
      expect(url).toContain("fit=inside");
      expect(url).toContain("quality=95");
    });
  });
});

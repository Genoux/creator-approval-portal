import { describe, expect, it } from "vitest";
import { buildSocials } from "./social";

describe("buildSocials", () => {
  describe("Instagram URL handling", () => {
    it("should extract handle from standard Instagram URL", () => {
      const result = buildSocials({
        instagram: "https://instagram.com/username",
        tiktok: null,
        youtube: null,
        linkedin: null,
      });

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        platform: "Instagram",
        handle: "@username",
        url: "https://instagram.com/username",
      });
    });

    it("should extract handle from Instagram URL with query parameters", () => {
      const result = buildSocials({
        instagram: "https://instagram.com/username?utm_source=test",
        tiktok: null,
        youtube: null,
        linkedin: null,
      });

      expect(result[0].handle).toBe("@username");
    });

    it("should extract handle from Instagram URL with trailing slash", () => {
      const result = buildSocials({
        instagram: "https://instagram.com/username/",
        tiktok: null,
        youtube: null,
        linkedin: null,
      });

      expect(result[0].handle).toBe("@username");
    });

    it("should handle Instagram URL without https", () => {
      const result = buildSocials({
        instagram: "http://instagram.com/username",
        tiktok: null,
        youtube: null,
        linkedin: null,
      });

      expect(result[0].handle).toBe("@username");
    });
  });

  describe("TikTok URL handling", () => {
    it("should extract handle from TikTok URL with @ symbol", () => {
      const result = buildSocials({
        instagram: null,
        tiktok: "https://tiktok.com/@username",
        youtube: null,
        linkedin: null,
      });

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        platform: "TikTok",
        handle: "@username",
        url: "https://tiktok.com/@username",
      });
    });

    it("should extract handle from TikTok URL without @ symbol", () => {
      const result = buildSocials({
        instagram: null,
        tiktok: "https://tiktok.com/username",
        youtube: null,
        linkedin: null,
      });

      expect(result[0].handle).toBe("@username");
    });

    it("should handle TikTok URL with query parameters", () => {
      const result = buildSocials({
        instagram: null,
        tiktok: "https://tiktok.com/@username?is_from_webapp=1",
        youtube: null,
        linkedin: null,
      });

      expect(result[0].handle).toBe("@username");
    });
  });

  describe("YouTube URL handling", () => {
    it("should extract handle from YouTube URL with @ symbol", () => {
      const result = buildSocials({
        instagram: null,
        tiktok: null,
        youtube: "https://youtube.com/@username",
        linkedin: null,
      });

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        platform: "YouTube",
        handle: "@username",
        url: "https://youtube.com/@username",
      });
    });

    it("should extract handle from YouTube channel URL", () => {
      const result = buildSocials({
        instagram: null,
        tiktok: null,
        youtube: "https://youtube.com/c/username",
        linkedin: null,
      });

      expect(result[0].handle).toBe("@username");
    });

    it("should extract handle from YouTube user URL", () => {
      const result = buildSocials({
        instagram: null,
        tiktok: null,
        youtube: "https://youtube.com/user/username",
        linkedin: null,
      });

      expect(result[0].handle).toBe("@username");
    });

    it("should handle YouTube URL with query parameters", () => {
      const result = buildSocials({
        instagram: null,
        tiktok: null,
        youtube: "https://youtube.com/@username?si=abc123",
        linkedin: null,
      });

      expect(result[0].handle).toBe("@username");
    });
  });

  describe("LinkedIn URL handling", () => {
    it("should extract handle from LinkedIn profile URL", () => {
      const result = buildSocials({
        instagram: null,
        tiktok: null,
        youtube: null,
        linkedin: "https://linkedin.com/in/username",
      });

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        platform: "LinkedIn",
        handle: "username",
        url: "https://linkedin.com/in/username",
      });
    });

    it("should not prefix LinkedIn handle with @", () => {
      const result = buildSocials({
        instagram: null,
        tiktok: null,
        youtube: null,
        linkedin: "https://linkedin.com/in/username",
      });

      expect(result[0].handle).toBe("username");
      expect(result[0].handle).not.toContain("@");
    });

    it("should handle LinkedIn URL with query parameters", () => {
      const result = buildSocials({
        instagram: null,
        tiktok: null,
        youtube: null,
        linkedin: "https://linkedin.com/in/username?utm_source=test",
      });

      expect(result[0].handle).toBe("username");
    });

    it("should handle LinkedIn URL with trailing slash", () => {
      const result = buildSocials({
        instagram: null,
        tiktok: null,
        youtube: null,
        linkedin: "https://linkedin.com/in/username/",
      });

      expect(result[0].handle).toBe("username");
    });
  });

  describe("Multiple platforms", () => {
    it("should build socials array with all platforms", () => {
      const result = buildSocials({
        instagram: "https://instagram.com/creator",
        tiktok: "https://tiktok.com/@creator",
        youtube: "https://youtube.com/@creator",
        linkedin: "https://linkedin.com/in/creator",
      });

      expect(result).toHaveLength(4);
      expect(result[0].platform).toBe("Instagram");
      expect(result[1].platform).toBe("TikTok");
      expect(result[2].platform).toBe("YouTube");
      expect(result[3].platform).toBe("LinkedIn");
    });

    it("should build socials array with some platforms", () => {
      const result = buildSocials({
        instagram: "https://instagram.com/creator",
        tiktok: null,
        youtube: "https://youtube.com/@creator",
        linkedin: null,
      });

      expect(result).toHaveLength(2);
      expect(result[0].platform).toBe("Instagram");
      expect(result[1].platform).toBe("YouTube");
    });

    it("should return empty array when no URLs provided", () => {
      const result = buildSocials({
        instagram: null,
        tiktok: null,
        youtube: null,
        linkedin: null,
      });

      expect(result).toEqual([]);
    });

    it("should maintain platform order regardless of which are provided", () => {
      const result = buildSocials({
        instagram: null,
        tiktok: "https://tiktok.com/@creator",
        youtube: null,
        linkedin: "https://linkedin.com/in/creator",
      });

      expect(result).toHaveLength(2);
      expect(result[0].platform).toBe("TikTok");
      expect(result[1].platform).toBe("LinkedIn");
    });
  });

  describe("Invalid URLs", () => {
    it("should return null handle for unrecognized Instagram URL format", () => {
      const result = buildSocials({
        instagram: "https://example.com/profile",
        tiktok: null,
        youtube: null,
        linkedin: null,
      });

      expect(result[0].handle).toBeNull();
      expect(result[0].url).toBe("https://example.com/profile");
    });

    it("should return null handle for malformed TikTok URL", () => {
      const result = buildSocials({
        instagram: null,
        tiktok: "https://example.com/@username",
        youtube: null,
        linkedin: null,
      });

      expect(result[0].handle).toBeNull();
    });

    it("should return null handle for malformed YouTube URL", () => {
      const result = buildSocials({
        instagram: null,
        tiktok: null,
        youtube: "https://example.com/@username",
        linkedin: null,
      });

      expect(result[0].handle).toBeNull();
    });

    it("should return null handle for malformed LinkedIn URL", () => {
      const result = buildSocials({
        instagram: null,
        tiktok: null,
        youtube: null,
        linkedin: "https://linkedin.com/company/example",
      });

      expect(result[0].handle).toBeNull();
    });
  });

  describe("Edge cases", () => {
    it("should handle usernames with dots", () => {
      const result = buildSocials({
        instagram: "https://instagram.com/user.name",
        tiktok: null,
        youtube: null,
        linkedin: null,
      });

      expect(result[0].handle).toBe("@user.name");
    });

    it("should handle usernames with underscores", () => {
      const result = buildSocials({
        instagram: "https://instagram.com/user_name",
        tiktok: null,
        youtube: null,
        linkedin: null,
      });

      expect(result[0].handle).toBe("@user_name");
    });

    it("should handle usernames with numbers", () => {
      const result = buildSocials({
        instagram: "https://instagram.com/user123",
        tiktok: null,
        youtube: null,
        linkedin: null,
      });

      expect(result[0].handle).toBe("@user123");
    });

    it("should handle LinkedIn usernames with hyphens", () => {
      const result = buildSocials({
        instagram: null,
        tiktok: null,
        youtube: null,
        linkedin: "https://linkedin.com/in/user-name-123",
      });

      expect(result[0].handle).toBe("user-name-123");
    });
  });
});

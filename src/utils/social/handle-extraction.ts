const PLATFORM_PATTERNS = [
  {
    platform: "instagram" as const,
    pattern: /^https?:\/\/(www\.)?instagram\.com\/([^/?]+).*/,
    handleIndex: 2,
  },
  {
    platform: "tiktok" as const,
    pattern: /^https?:\/\/(www\.)?tiktok\.com\/@?([^/?]+).*/,
    handleIndex: 2,
  },
  {
    platform: "youtube" as const,
    pattern:
      /^https?:\/\/(www\.)?youtube\.com\/(channel\/|c\/|user\/|@)([^/?]+).*/,
    handleIndex: 3,
  },
];

export function extractHandle(url: string | null | undefined): string | null {
  if (!url || typeof url !== "string") return null;

  for (const { pattern, handleIndex } of PLATFORM_PATTERNS) {
    const match = url.match(pattern);
    if (match?.[handleIndex]) {
      return `@${match[handleIndex]}`;
    }
  }

  return null;
}

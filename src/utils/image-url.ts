/**
 * Extracts image URL from various sources
 */
export default function extractImageUrl(
  input:
    | string
    | { url?: string; avatar?: string; image?: string; profileImage?: string }
    | null
    | undefined
): string | null {
  if (!input) return null;

  let url: string | null = null;

  if (typeof input === "string") {
    url = input.trim() || null;
  } else if (typeof input === "object") {
    // Try different common property names
    url =
      input.url || input.avatar || input.image || input.profileImage || null;
    url = url ? url.trim() : null;
  }

  if (!url) return null;

  // If it's an external URL that might have CORS issues, proxy it
  if (
    url.startsWith("http") &&
    !url.includes("localhost") &&
    !url.startsWith("/")
  ) {
    return `/api/proxy-image?url=${url}`;
  }

  return url;
}

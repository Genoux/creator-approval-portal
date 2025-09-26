import type { Social } from "@/types/creators";

interface UrlData {
  instagram: string | null;
  tiktok: string | null;
  youtube: string | null;
  linkedin: string | null;
}

/**
 * Extract handle from social media URL
 */
function extractHandle(url: string): string | null {
  // Instagram: instagram.com/username
  const instagramMatch = url.match(/instagram\.com\/([^/?]+)/);
  if (instagramMatch) return `@${instagramMatch[1]}`;

  // TikTok: tiktok.com/@username or tiktok.com/username
  const tiktokMatch = url.match(/tiktok\.com\/@?([^/?]+)/);
  if (tiktokMatch) return `@${tiktokMatch[1]}`;

  // YouTube: youtube.com/@username or youtube.com/c/username etc
  const youtubeMatch = url.match(/youtube\.com\/(?:@|c\/|user\/)([^/?]+)/);
  if (youtubeMatch) return `@${youtubeMatch[1]}`;

  // LinkedIn: linkedin.com/in/username
  const linkedinMatch = url.match(/linkedin\.com\/in\/([^/?]+)/);
  if (linkedinMatch) return linkedinMatch[1];

  return null;
}

/**
 * Build socials array - simple and clean
 */
export function buildSocials(urls: UrlData): Social[] {
  const socials: Social[] = [];

  if (urls.instagram) {
    socials.push({
      platform: "Instagram",
      handle: extractHandle(urls.instagram),
      url: urls.instagram,
    });
  }

  if (urls.tiktok) {
    socials.push({
      platform: "TikTok",
      handle: extractHandle(urls.tiktok),
      url: urls.tiktok,
    });
  }

  if (urls.youtube) {
    socials.push({
      platform: "YouTube",
      handle: extractHandle(urls.youtube),
      url: urls.youtube,
    });
  }

  if (urls.linkedin) {
    socials.push({
      platform: "LinkedIn",
      handle: extractHandle(urls.linkedin),
      url: urls.linkedin,
    });
  }

  return socials;
}

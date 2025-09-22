//TODO: CLEANUP. Use functions to remap fields.

import type { Task } from "@/types";
import type {
  CreatorProfile,
  SocialPlatform,
  SocialProfile,
} from "@/types/creators";

// Simple field mapping - add new fields here only
const CREATOR_FIELD_MAP = {
  profileImageUrl: "pic",
  instagramProfile: "ig profile",
  tiktokProfile: "tt profile",
  youtubeProfile: "yt profile",
  linkedinProfile: "linkedin profile",
  inBeatPortfolio: "inbeat portfolio",
  followerCount: "followers",
  example: "example",
  whyGoodFit: "why good fit",
  clientApproval: "client approval",
} as const;

/**
 * Extract creator profile from ClickUp task
 */
export function extractCreator(task: Task): CreatorProfile {
  console.log(task);
  const profileImageUrl = getFieldValue(
    task,
    CREATOR_FIELD_MAP.profileImageUrl
  );
  const instagramProfile = getFieldValue(
    task,
    CREATOR_FIELD_MAP.instagramProfile
  );
  const tiktokProfile = getFieldValue(task, CREATOR_FIELD_MAP.tiktokProfile);
  const youtubeProfile = getFieldValue(task, CREATOR_FIELD_MAP.youtubeProfile);
  const linkedinProfile = getFieldValue(
    task,
    CREATOR_FIELD_MAP.linkedinProfile
  );
  const inBeatPortfolio = getFieldValue(
    task,
    CREATOR_FIELD_MAP.inBeatPortfolio
  );
  const followerCount = getNumericFieldValue(
    task,
    CREATOR_FIELD_MAP.followerCount
  );
  const example = getFieldValue(task, CREATOR_FIELD_MAP.example);
  const whyGoodFit = getFieldValue(task, CREATOR_FIELD_MAP.whyGoodFit);

  return {
    name: task.name,
    avatar: profileImageUrl,
    primaryHandle: extractPrimaryHandle({
      instagramProfile,
      tiktokProfile,
      youtubeProfile,
    }),
    primaryProfileUrl:
      instagramProfile || tiktokProfile || youtubeProfile || null,
    followerCount: formatFollowerCount(followerCount),
    socialProfiles: buildSocialProfiles({
      instagramProfile,
      tiktokProfile,
      youtubeProfile,
      linkedinProfile,
      inBeatPortfolio,
    }),
    portfolio: {
      example,
      whyGoodFit,
      inBeatPortfolio,
    },
  };
}

/**
 * Get field value from task custom fields
 */
function getFieldValue(task: Task, fieldName: string): string | null {
  const field = task.custom_fields?.find(f =>
    f.name?.toLowerCase().includes(fieldName.toLowerCase())
  );

  if (!field?.value) return null;

  const value =
    typeof field.value === "object" && field.value !== null
      ? (field.value as { value?: unknown }).value || null
      : field.value;

  return typeof value === "string" ? value.trim() || null : String(value);
}

/**
 * Get numeric field value
 */
function getNumericFieldValue(task: Task, fieldName: string): number | null {
  const value = getFieldValue(task, fieldName);
  if (!value) return null;

  const cleaned = value.replace(/[^\d.]/g, "");
  const num = parseFloat(cleaned);
  return Number.isNaN(num) ? null : num;
}

/**
 * Get approval field ID for updates
 */
function getApprovalFieldId(task: Task): string | null {
  const field = task.custom_fields?.find(f =>
    f.name?.toLowerCase().includes("client approval")
  );
  return field?.id || null;
}

/**
 * Extract primary handle from profiles (Instagram → TikTok → YouTube)
 */
function extractPrimaryHandle(profiles: {
  instagramProfile: string | null;
  tiktokProfile: string | null;
  youtubeProfile: string | null;
}): string | null {
  const urls = [
    profiles.instagramProfile,
    profiles.tiktokProfile,
    profiles.youtubeProfile,
  ];

  for (const url of urls) {
    if (!url) continue;
    const handle = extractHandle(url);
    if (handle) return handle;
  }

  return null;
}

/**
 * Extract handle from profile URL
 */
function extractHandle(url: string): string | null {
  if (!url) return null;

  const match = url.match(/(?:@|\/)([\w.]+)(?:\/|$|\?)/);
  return match?.[1] || null;
}

/**
 * Format follower count for display
 */
function formatFollowerCount(count: number | null): string | null {
  if (!count || count <= 0) return null;

  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
}

/**
 * Build social profiles array for UI
 */
function buildSocialProfiles(profiles: {
  instagramProfile: string | null;
  tiktokProfile: string | null;
  youtubeProfile: string | null;
  linkedinProfile: string | null;
  inBeatPortfolio: string | null;
}): SocialProfile[] {
  const socialProfiles: SocialProfile[] = [];

  const profileMap: Array<{
    platform: SocialPlatform;
    url: string | null;
    icon: string;
  }> = [
    {
      platform: "Instagram",
      url: profiles.instagramProfile,
      icon: "instagram",
    },
    { platform: "TikTok", url: profiles.tiktokProfile, icon: "tiktok" },
    { platform: "YouTube", url: profiles.youtubeProfile, icon: "youtube" },
    { platform: "LinkedIn", url: profiles.linkedinProfile, icon: "linkedin" },
    {
      platform: "External",
      url: profiles.inBeatPortfolio,
      icon: "external-link",
    },
  ];

  for (const { platform, url, icon } of profileMap) {
    if (url) {
      socialProfiles.push({
        platform,
        handle: extractHandle(url),
        url,
        icon,
      });
    }
  }

  return socialProfiles;
}

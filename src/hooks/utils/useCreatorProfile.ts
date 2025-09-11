import { useMemo } from "react";
import type { Task } from "@/types";
import { extractCreatorData } from "@/utils/creators";
import { extractHandle } from "@/utils/social";
import { formatFollowerCount } from "@/utils/ui";

/**
 * UI-focused hook that transforms task data into clean creator profile for display
 * Returns memoized, UI-ready data optimized for React components
 */
export function useCreatorProfile(task: Task) {
  return useMemo(() => {
    const creatorData = extractCreatorData(task);
    // UI-ready profile data
    const profile = {
      // Basic info
      name: task.name,
      avatar: creatorData.profileImageUrl,

      // Social presence
      primaryHandle:
        extractHandle(creatorData.tiktokProfile) ||
        extractHandle(creatorData.instagramProfile) ||
        extractHandle(creatorData.youtubeProfile),
      
      primaryProfileUrl:
        creatorData.tiktokProfile ||
        creatorData.instagramProfile ||
        creatorData.youtubeProfile,

      followerCount: creatorData.followerCount
        ? formatFollowerCount(creatorData.followerCount)
        : null,

      // Social platforms
      socialProfiles: [
        {
          platform: "TikTok" as const,
          handle: extractHandle(creatorData.tiktokProfile),
          url: creatorData.tiktokProfile,
          icon: "tiktok",
        },
        {
          platform: "Instagram" as const,
          handle: extractHandle(creatorData.instagramProfile),
          url: creatorData.instagramProfile,
          icon: "instagram",
        },
        {
          platform: "YouTube" as const,
          handle: extractHandle(creatorData.youtubeProfile),
          url: creatorData.youtubeProfile,
          icon: "youtube",
        },
      ].filter((profile) => profile.handle && profile.url),

      // Creator details
      type: creatorData.creatorType,
      
      // Content examples
      portfolio: {
        example: creatorData.example,
        whyGoodFit: creatorData.whyGoodFit,
      },
    };

    // UI helpers
    const helpers = {
      hasSocialProfiles: profile.socialProfiles.length > 0,
      hasPortfolio: !!(
        profile.portfolio.example || profile.portfolio.whyGoodFit
      ),
      displayName: profile.name || "Unknown Creator",
      mainPlatform: profile.socialProfiles[0]?.platform || null,
    };

    return {
      ...profile,
      ...helpers,
    };
  }, [task]);
}

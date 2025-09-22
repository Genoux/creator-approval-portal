import { useMemo } from "react";
import type { Task } from "@/types";
import type { CreatorProfile } from "@/types/creators";
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
    const profile: CreatorProfile = {
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
        {
          platform: "LinkedIn" as const,
          handle: extractHandle(creatorData.linkedinProfile),
          url: creatorData.linkedinProfile,
          icon: "linkedin",
        },
      ].filter(profile => profile.handle && profile.url),

      // Content examples
      portfolio: {
        example: creatorData.example,
        whyGoodFit: creatorData.whyGoodFit,
        inBeatPortfolio: creatorData.inBeatPortfolio,
      },
    };

    return {
      ...profile,
    };
  }, [task]);
}

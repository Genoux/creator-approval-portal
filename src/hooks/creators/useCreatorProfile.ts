import type { Task } from "@/types/tasks";
import extractCreatorData from "@/utils/creator-data";
import extractHandle from "@/utils/social-media";

export function useCreatorProfile(task: Task) {
  const creatorData = extractCreatorData(task);
  console.log(creatorData);
  const profileImageUrl = creatorData.profileImageUrl;

  const primaryHandle =
    extractHandle(creatorData.ttProfile) ||
    extractHandle(creatorData.igProfile) ||
    extractHandle(creatorData.ytProfile);

  const socialProfiles = [
    {
      platform: "Instagram",
      handle: extractHandle(creatorData.igProfile),
      url: creatorData.igProfile,
    },
    {
      platform: "TikTok",
      handle: extractHandle(creatorData.ttProfile),
      url: creatorData.ttProfile,
    },
    {
      platform: "YouTube",
      handle: extractHandle(creatorData.ytProfile),
      url: creatorData.ytProfile,
    },
  ].filter((profile) => profile.handle && profile.url);

  const followerCount = creatorData.followerCount
    ? formatFollowerCount(creatorData.followerCount)
    : null;

  return {
    profileImageUrl,
    primaryHandle,
    socialProfiles,
    followerCount,
    name: task.name,
    creatorType: creatorData.creatorType,
    gender: creatorData.gender,
    engagementRate: creatorData.engagementRate,
    example: creatorData.example,
    whyGoodFit: creatorData.whyGoodFit,
    sow: creatorData.sow,
    igProfile: creatorData.igProfile,
    ttProfile: creatorData.ttProfile,
    ytProfile: creatorData.ytProfile,
  };
}

function formatFollowerCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M+`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K+`;
  }
  return count.toString();
}

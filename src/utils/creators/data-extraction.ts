import type { Task } from "@/types/tasks";

const DEFAULT_PROFILE_IMAGE = "https://dummyimage.com/400x500/000/fff";

export interface CreatorData {
  followerCount: number | null;
  igProfile: string | null;
  ttProfile: string | null;
  ytProfile: string | null;
  engagementRate: number | null;
  example: string | null;
  whyGoodFit: string | null;
  creatorType: string | null;
  sow: string | null;
  gender: string | null;
  profileImageUrl: string | null;
}

/**
 * Simple field extractor - gets a field value by name
 */
function getField(task: Task, fieldName: string): any {
  const field = task.custom_fields?.find((f) => f.name === fieldName);
  if (!field?.value) return null;

  // Handle dropdown/label fields
  if (
    (field.type === "labels" || field.type === "drop_down") &&
    field.type_config?.options
  ) {
    const options = field.type_config.options;
    const value = field.value;
    const option =
      typeof value === "number"
        ? options[value]
        : options.find((opt) => opt.id === String(value));
    return option?.name || option?.label || null;
  }

  return field.value;
}

/**
 * Extract creator data from ClickUp task
 */
export default function extractCreatorData(task: Task): CreatorData {
  const followerCount = getField(task, "Follower Count");
  const engagementRate = getField(task, "Engagement Rate");
  const profileImageUrl = getField(task, "Picture Pic URL");

  return {
    followerCount:
      typeof followerCount === "number"
        ? followerCount
        : typeof followerCount === "string"
        ? Number(followerCount) || null
        : null,
    igProfile: getField(task, "IG Profile"),
    ttProfile: getField(task, "TT Profile"),
    ytProfile: getField(task, "YT Profile"),
    engagementRate:
      typeof engagementRate === "number"
        ? engagementRate
        : typeof engagementRate === "string"
        ? Number(engagementRate) || null
        : null,
    example: getField(task, "Example"),
    whyGoodFit: getField(task, "Why good fit"),
    creatorType: getField(task, "Creator Type"),
    sow: getField(task, "SOW"),
    gender: getField(task, "Gender"),
    profileImageUrl: getField(task, "Picture Pic URL") || DEFAULT_PROFILE_IMAGE,
  };
}

import type { Task } from "@/types/tasks";

// Define fields to extract with their ClickUp field names and expected types
const CREATOR_FIELDS = {
  followerCount: {
    fieldNames: ["Follower Count"],
    type: "number" as const,
  },
  // Social media profiles
  igProfile: {
    fieldNames: ["IG Profile"],
    type: "string" as const,
  },
  ttProfile: {
    fieldNames: ["TT Profile"],
    type: "string" as const,
  },
  ytProfile: {
    fieldNames: ["YT Profile"],
    type: "string" as const,
  },
  // Additional creator data
  engagementRate: {
    fieldNames: ["Engagement Rate"],
    type: "number" as const,
  },
  example: {
    fieldNames: ["Example"],
    type: "string" as const,
  },
  whyGoodFit: {
    fieldNames: ["Why good fit"],
    type: "string" as const,
  },
  creatorType: {
    fieldNames: ["Creator Type"],
    type: "string" as const,
  },
  sow: {
    fieldNames: ["SOW"],
    type: "string" as const,
  },
  gender: {
    fieldNames: ["Gender"],
    type: "string" as const,
  },
  profileImageUrl: {
    fieldNames: ["Profile Image URL", "Profile Image", "Avatar URL"],
    type: "string" as const,
  },
} as const;

type CreatorFieldKey = keyof typeof CREATOR_FIELDS;
type CreatorFieldType<T extends CreatorFieldKey> =
  (typeof CREATOR_FIELDS)[T]["type"];

// Auto-generate the CreatorData type from field definitions
export type CreatorData = {
  [K in CreatorFieldKey]: CreatorFieldType<K> extends "number"
    ? number | null
    : CreatorFieldType<K> extends "string"
    ? string | null
    : unknown | null;
};

function findFieldValue(
  customFields: Array<{
    name: string;
    value: string | number | boolean | null;
  }> = [],
  fieldNames: readonly string[]
): string | number | boolean | null {
  for (const fieldName of fieldNames) {
    const field = customFields.find((f) => f.name === fieldName);
    if (field?.value !== null && field?.value !== undefined) {
      return field.value;
    }
  }
  return null;
}

export function extractCreatorData(task: Task): CreatorData {
  const customFields = task.custom_fields || [];
  const result: Record<string, unknown> = {};

  // Auto-extract all defined fields
  for (const [key, config] of Object.entries(CREATOR_FIELDS)) {
    const fieldKey = key as CreatorFieldKey;
    const value = findFieldValue(customFields, config.fieldNames);

    // Type-safe assignment based on expected type
    if (config.type === "number") {
      // Handle both actual numbers and string numbers from ClickUp
      if (typeof value === "number") {
        result[fieldKey] = value;
      } else if (typeof value === "string" && !Number.isNaN(Number(value))) {
        result[fieldKey] = Number(value);
      } else {
        result[fieldKey] = null;
      }
    } else if (config.type === "string") {
      result[fieldKey] = typeof value === "string" ? value : null;
    } else {
      result[fieldKey] = value;
    }
  }

  return result as CreatorData;
}

export function formatFollowerCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M+`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K+`;
  }
  return count.toString();
}

export function formatRate(rate: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(rate);
}

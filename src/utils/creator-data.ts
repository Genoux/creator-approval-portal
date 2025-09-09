import type { Task } from "@/types/tasks";

const DEFAULT_PROFILE_IMAGE = "https://dummyimage.com/400x500/000/fff";

// Define fields to extract with their ClickUp field names and expected types
const CREATOR_FIELDS = {
  followerCount: {
    fieldNames: ["Follower Count"],
    type: "number" as const,
  },
  // Social media profiles (URL fields)
  igProfile: {
    fieldNames: ["IG Profile"],
    type: "url" as const,
  },
  ttProfile: {
    fieldNames: ["TT Profile"],
    type: "url" as const,
  },
  ytProfile: {
    fieldNames: ["YT Profile"],
    type: "url" as const,
  },
  // Additional creator data
  engagementRate: {
    fieldNames: ["Engagement Rate"],
    type: "number" as const,
  },
  example: {
    fieldNames: ["Example"],
    type: "url" as const,
  },
  whyGoodFit: {
    fieldNames: ["Why good fit"],
    type: "string" as const,
  },
  creatorType: {
    fieldNames: ["Creator Type"],
    type: "labels" as const,
  },
  sow: {
    fieldNames: ["SOW"],
    type: "string" as const,
  },
  gender: {
    fieldNames: ["Gender"],
    type: "dropdown" as const,
  },
  profileImageUrl: {
    fieldNames: ["Picture Pic URL"],
    type: "url" as const,
  },
} as const;

type CreatorFieldKey = keyof typeof CREATOR_FIELDS;
type CreatorFieldType<T extends CreatorFieldKey> =
  (typeof CREATOR_FIELDS)[T]["type"];

// Auto-generate the CreatorData type from field definitions
export type CreatorData = {
  [K in CreatorFieldKey]: CreatorFieldType<K> extends "number"
    ? number | null
    : CreatorFieldType<K> extends "string" | "url" | "labels" | "dropdown"
    ? string | null
    : unknown | null;
};

function findFieldValue(
  customFields: Array<{
    name: string;
    value: string | number | boolean | null;
    type?: string;
    type_config?: {
      options?: Array<{
        id: string;
        name?: string;
        label?: string;
      }>;
    };
  }> = [],
  fieldNames: readonly string[]
): string | number | boolean | null {
  for (const fieldName of fieldNames) {
    const field = customFields.find((f) => f.name === fieldName);
    if (field?.value !== null && field?.value !== undefined) {
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
  }
  return null;
}

export default function extractCreatorData(task: Task): CreatorData {
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
    } else if (
      config.type === "string" ||
      config.type === "url" ||
      config.type === "labels" ||
      config.type === "dropdown"
    ) {
      // All these types should return strings (URLs are strings, dropdowns/labels are resolved to string labels)
      result[fieldKey] = typeof value === "string" ? value : null;
    } else {
      result[fieldKey] = value;
    }
  }

  const creatorData = result as CreatorData;

  // Apply default profile image if none exists
  if (!creatorData.profileImageUrl) {
    creatorData.profileImageUrl = DEFAULT_PROFILE_IMAGE;
  }

  return creatorData;
}

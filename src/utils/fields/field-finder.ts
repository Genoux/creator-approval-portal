import type { CustomField, Task } from "@/types";

/**
 * Find a custom field by fuzzy matching patterns
 */
export function findField(
  customFields: Task['custom_fields'],
  patterns: readonly string[]
): CustomField | null {
  if (!customFields) return null;

  for (const pattern of patterns) {
    // First try exact match
    const exactMatch = customFields.find(field => 
      field.name.toLowerCase() === pattern.toLowerCase()
    );
    if (exactMatch) return exactMatch;
    
    // Then try includes match
    const field = customFields.find(field => 
      field.name.toLowerCase().includes(pattern.toLowerCase())
    );
    if (field) return field;
  }
  
  return null;
}

/**
 * Extract dropdown/label field value with proper option resolution
 */
export function getDropdownValue(field: CustomField): string | null {
  if (field?.value === null || field?.value === undefined) return null;

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

  return String(field.value);
}

/**
 * Extract dropdown option ID for updates
 */
export function getDropdownOptionId(field: CustomField, targetLabel: string): string | null {
  if (!field?.type_config?.options) return null;

  const options = field.type_config.options;
  const found = options.find((opt) => {
    const name = (opt.name || opt.label || "").toLowerCase();
    return name.includes(targetLabel.toLowerCase());
  });

  return found?.id || null;
}

/**
 * Common field patterns for creator data
 */
export const FIELD_PATTERNS = {
  // Essential fields only
  profileImageUrl: ['profile pic url'],
  instagramProfile: ['ig profile'],
  tiktokProfile: ['tt profile'],
  youtubeProfile: ['yt profile'],
  linkedinProfile: ['linkedin profile'],
  followerCount: ['follower count'],
  inBeatPortfolio: ['inbeat portfolio'],
  example: ['example'],
  whyGoodFit: ["why they're a good fit"],
  clientApproval: ['client approval', '✅ client approval'],
} as const;
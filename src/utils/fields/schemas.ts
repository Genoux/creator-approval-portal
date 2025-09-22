import { z } from "zod";
import type { CreatorData, CustomField, Task } from "@/types";
import { FIELD_PATTERNS, findField, getDropdownValue } from "./field-finder";

/**
 * Create a smart field extractor function from ClickUp schema
 */
export function createFieldExtractor(customFields: Task["custom_fields"]) {
  const discoveredFields = Object.fromEntries(
    Object.entries(FIELD_PATTERNS).map(([key, patterns]) => [
      key,
      findField(customFields, patterns),
    ])
  ) as Record<keyof typeof FIELD_PATTERNS, CustomField | null>;

  // Create Zod schema with dynamic field extraction
  const creatorSchema = z
    .object({
      custom_fields: z
        .array(
          z.object({
            id: z.string(),
            name: z.string(),
            type: z.string(),
            value: z
              .union([
                z.string(),
                z.number(),
                z.boolean(),
                z.null(),
                z.undefined(),
                z.array(z.any()),
              ])
              .nullable(),
            type_config: z
              .object({
                options: z
                  .array(
                    z.object({
                      id: z.string(),
                      name: z.string().optional(),
                      label: z.string().optional(),
                      color: z.string().nullable().optional(),
                    })
                  )
                  .optional(),
              })
              .optional(),
          })
        )
        .nullable()
        .optional(),
    })
    .transform((task): CreatorData => {
      const fields = task.custom_fields || [];

      // Helper to extract field value by discovered field schema
      const extractFieldValue = (
        discoveredField: CustomField | null
      ): string | null => {
        if (!discoveredField) return null;
        const taskField = fields.find(f => f.id === discoveredField.id);
        if (!taskField?.value) return null;

        // Handle dropdown fields
        if (taskField.type === "labels" || taskField.type === "drop_down") {
          return getDropdownValue(taskField as CustomField);
        }

        return String(taskField.value);
      };

      // Helper to extract number with type coercion
      const extractNumber = (
        discoveredField: CustomField | null
      ): number | null => {
        const value = extractFieldValue(discoveredField);
        if (!value) return null;

        // Clean and parse number (remove common non-numeric chars)
        const cleaned = value.replace(/[,$%\s]/g, "");
        const parsed = Number(cleaned);
        return Number.isNaN(parsed) ? null : parsed;
      };

      // Helper to get dropdown option ID for approval updates
      const getApprovalId = (): string | null => {
        const approvalField = discoveredFields.clientApproval;
        if (!approvalField) return null;
        const taskField = fields.find(f => f.id === approvalField.id);
        return taskField?.value ? String(taskField.value) : null;
      };

      return {
        profileImageUrl: extractFieldValue(discoveredFields.profileImageUrl),
        instagramProfile: extractFieldValue(discoveredFields.instagramProfile),
        tiktokProfile: extractFieldValue(discoveredFields.tiktokProfile),
        youtubeProfile: extractFieldValue(discoveredFields.youtubeProfile),
        linkedinProfile: extractFieldValue(discoveredFields.linkedinProfile),
        inBeatPortfolio: extractFieldValue(discoveredFields.inBeatPortfolio),
        followerCount: extractNumber(discoveredFields.followerCount),
        example: extractFieldValue(discoveredFields.example),
        whyGoodFit: extractFieldValue(discoveredFields.whyGoodFit),
        clientApproval: extractFieldValue(discoveredFields.clientApproval),
        clientApprovalId: getApprovalId(),
      };
    });

  return {
    schema: creatorSchema,
    discoveredFields,
    extractCreatorData: (task: Task): CreatorData => {
      const result = creatorSchema.parse(task);
      return result;
    },
  };
}

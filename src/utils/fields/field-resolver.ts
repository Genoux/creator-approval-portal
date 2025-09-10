import type { Task } from "@/types/tasks";

/**
 * Dynamic field resolver that discovers field schemas from actual ClickUp data
 * No more hardcoded field names or IDs!
 */

interface FieldSchema {
  id: string;
  name: string;
  type: string;
  type_config?: {
    options?: Array<{
      id: string;
      name?: string;
      label?: string;
      color?: string;
    }>;
  };
}

export class FieldResolver {
  private fieldSchema: FieldSchema[];

  constructor(tasks: Task[]) {
    // Extract field schema from the first task (all tasks share same schema)
    this.fieldSchema = tasks[0]?.custom_fields || [];
  }

  /**
   * Get all available fields with their schemas
   */
  getAllFields(): FieldSchema[] {
    return this.fieldSchema;
  }

  /**
   * Find field by name (fuzzy matching)
   */
  findFieldByName(searchName: string): FieldSchema | null {
    const search = searchName.toLowerCase();
    return this.fieldSchema.find(field => 
      field.name.toLowerCase().includes(search) ||
      search.includes(field.name.toLowerCase())
    ) || null;
  }

  /**
   * Find multiple fields by keywords
   */
  findFieldsByKeywords(keywords: string[]): FieldSchema[] {
    return keywords
      .map(keyword => this.findFieldByName(keyword))
      .filter((field): field is FieldSchema => field !== null);
  }

  /**
   * Get approval-related field (looks for "approval", "status", "client")
   */
  getApprovalField(): FieldSchema | null {
    const candidates = ['approval', 'client approval', 'status', 'client status'];
    for (const candidate of candidates) {
      const field = this.findFieldByName(candidate);
      if (field) return field;
    }
    return null;
  }

  /**
   * Get all creator profile fields (social media, follower count, etc.)
   */
  getCreatorFields(): Record<string, FieldSchema> {
    const creatorKeywords = [
      'follower', 'ig profile', 'tiktok', 'tt profile', 'youtube', 'yt profile',
      'engagement', 'example', 'why good fit', 'creator type', 'sow', 'gender',
      'picture', 'image', 'photo', 'avatar'
    ];

    const fields: Record<string, FieldSchema> = {};
    
    creatorKeywords.forEach(keyword => {
      const field = this.findFieldByName(keyword);
      if (field) {
        // Create a clean key name
        const key = keyword.replace(/\s+/g, '').replace(/[^\w]/g, '').toLowerCase();
        fields[key] = field;
      }
    });

    return fields;
  }

  /**
   * Get team rating fields
   */
  getTeamRatingFields(): FieldSchema[] {
    return this.findFieldsByKeywords(['cp/is rating', 'cm rating', 'rating']);
  }

  /**
   * Get field options for dropdown/label fields
   */
  getFieldOptions(fieldId: string): Array<{id: string, name: string}> {
    const field = this.fieldSchema.find(f => f.id === fieldId);
    return field?.type_config?.options?.map(opt => ({
      id: opt.id,
      name: opt.name || opt.label || 'Unknown'
    })) || [];
  }

  /**
   * Debug: Log all fields for inspection
   */
  debugLogFields(): void {
    console.log('🔍 Available Fields:');
    this.fieldSchema.forEach(field => {
      console.log(`  • ${field.name} (${field.type}) - ID: ${field.id}`);
      if (field.type_config?.options) {
        console.log(`    Options:`, field.type_config.options.map(opt => opt.name || opt.label));
      }
    });
  }
}
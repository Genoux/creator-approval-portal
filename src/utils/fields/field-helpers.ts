import type { Task } from "@/types/tasks";

/**
 * Generic field helper utilities for ClickUp custom fields
 */

/**
 * Get a custom field value by field name
 */
export function getFieldByName(task: Task, fieldName: string): any {
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
 * Get a custom field value by field ID
 */
export function getFieldById(task: Task, fieldId: string): any {
  const field = task.custom_fields?.find((f) => f.id === fieldId);
  return field?.value || null;
}

/**
 * Convert field value to number (handles string numbers from ClickUp)
 */
export function getFieldAsNumber(task: Task, fieldName: string): number | null {
  const value = getFieldByName(task, fieldName);

  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return isNaN(parsed) ? null : parsed;
  }

  return null;
}

/**
 * Get field value as string
 */
export function getFieldAsString(task: Task, fieldName: string): string | null {
  const value = getFieldByName(task, fieldName);
  return typeof value === "string" ? value : null;
}

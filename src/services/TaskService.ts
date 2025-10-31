import { transformClickUpTask } from "@/transformers/clickup-transformer";
import type { ClickUpTask, Task } from "@/types";

/**
 * Transform raw ClickUp task to app Task model
 */
export function extractTask(clickUpTask: ClickUpTask): Task {
  return transformClickUpTask(clickUpTask);
}

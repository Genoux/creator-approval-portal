import { ClickUpTransformer } from "@/transformers/clickup-transformer";
import type { ClickUpTask, Task } from "@/types";

const transformer = new ClickUpTransformer();

/**
 * Transform raw ClickUp task to app Task model
 */
export function extractTask(clickUpTask: ClickUpTask): Task {
  return transformer.transform(clickUpTask);
}

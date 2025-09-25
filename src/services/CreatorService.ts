import { ClickUpTransformer } from "@/transformers/clickup-transformer";
import type { Task } from "@/types";
import type { Creator } from "@/types/creators";

const transformer = new ClickUpTransformer();

/**
 * Extract creator profile from ClickUp task
 */
export function extractCreator(task: Task): Creator {
  return transformer.transform(task);
}

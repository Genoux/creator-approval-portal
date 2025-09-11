import type { CreatorData, Task } from "@/types";
import { createFieldExtractor } from "@/utils/fields";

// Cache extractors per unique field schema to avoid recreating
const extractorCache = new WeakMap<Task[], ReturnType<typeof createFieldExtractor>>();

/**
 * Get or create a cached extractor for the given task schema
 */
function getExtractor(allTasks: Task[]) {
  let extractor = extractorCache.get(allTasks);
  if (!extractor) {
    // Use the first task's custom_fields to discover the schema
    extractor = createFieldExtractor(allTasks[0]?.custom_fields || []);
    extractorCache.set(allTasks, extractor);
  }
  return extractor;
}

/**
 * Extract creator data from ClickUp task using dynamic field resolution
 * 
 * @param task - Individual task to extract data from
 * @param allTasks - All tasks (used for field schema discovery, should be provided for performance)
 */
export default function extractCreatorData(task: Task, allTasks?: Task[]): CreatorData {
  const tasks = allTasks || [task];
  const extractor = getExtractor(tasks);
  return extractor.extractCreatorData(task);
}

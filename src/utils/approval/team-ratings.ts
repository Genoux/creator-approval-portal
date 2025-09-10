import type { Task } from "@/types/tasks";

/**
 * Team Rating Logic - Internal team recommendation system
 */

/**
 * Check if a creator is recommended by both CP/IS and CM teams
 * Both ratings need to be 0 (perfect fit) for team recommendation
 */
export function isTeamRecommended(task: Task): boolean {
  const cpIsRatingField = task.custom_fields?.find(
    (field) => field.name === "CP/IS Rating"
  );
  const cmRatingField = task.custom_fields?.find(
    (field) => field.name === "CM Rating"
  );

  const isCpIsPerfectFit = cpIsRatingField?.value === 0;
  const isCmPerfectFit = cmRatingField?.value === 0;

  return isCpIsPerfectFit && isCmPerfectFit;
}

/**
 * Get team rating value for a specific team
 */
export function getTeamRating(
  task: Task,
  teamName: "CP/IS" | "CM"
): number | null {
  const field = task.custom_fields?.find(
    (field) => field.name === `${teamName} Rating`
  );

  return typeof field?.value === "number" ? field.value : null;
}

import { ClickUpAPI } from "@/lib/clickup";
import type { ClickUpList, ClickUpSpace } from "@/types";

export interface ListResult {
  listId: string;
  listName: string;
}

/**
 * Searches for a specific list by name across all teams (OPTIMIZED)
 * Uses parallel requests instead of sequential ones
 */
export async function findListByName(
  listName: string,
  apiToken: string,
  userAccessToken: string
): Promise<ListResult | null> {
  try {
    const clickup = ClickUpAPI.createFromSession(apiToken, userAccessToken);
    const teamsData = await clickup.getTeams();
    const teams = teamsData.teams || [];

    const teamPromises = teams.map(async (team: ClickUpSpace) => {
      try {
        const sharedData = await clickup.getSharedResources(team.id);
        const sharedLists = sharedData.shared?.lists || [];

        const targetList = sharedLists.find(
          (list: ClickUpList) => list.name === listName
        );

        if (targetList) {
          return {
            listId: targetList.id,
            listName: targetList.name,
          };
        }
        return null;
      } catch (error) {
        console.warn(`Error processing team ${team.id}:`, error);
        return null;
      }
    });

    const results = await Promise.all(teamPromises);
    const foundList = results.find(result => result !== null);

    return foundList || null;
  } catch (error) {
    console.error(`Error finding list "${listName}":`, error);
    return null;
  }
}

import { ClickUpAPI } from "@/lib/clickup";

export interface ListResult {
  listId: string;
  listName: string;
}

export async function getSharedLists(
  apiToken: string,
  userAccessToken: string
): Promise<ListResult[]> {
  const clickup = ClickUpAPI.createFromSession(apiToken, userAccessToken);
  const teamsData = await clickup.getTeams();
  const teams = teamsData.teams || [];

  const results: ListResult[] = [];

  for (const team of teams) {
    try {
      const sharedData = await clickup.getSharedResources(team.id);
      const sharedLists = sharedData.shared?.lists || [];

      for (const list of sharedLists) {
        if (list.name === "Creator Management") {
          results.push({
            listId: list.id,
            listName: list.name,
          });
        }
      }
    } catch (error) {
      console.warn(
        `Error fetching shared resources for team ${team.id}:`,
        error
      );
    }
  }

  return results;
}

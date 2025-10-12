import { ClickUpAPI } from "@/lib/clickup";

export interface ListResult {
  listId: string;
  listName: string;
  viewId: string;
  statusFilters: string[];
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
          const viewsData = await clickup.getListViews(list.id);
          const clientView = viewsData.required_views.list;

          //TODO: Verify this is correct
          // Extract status filters from view configuration
          // Note: We skip { "type": "closed" } objects since include_closed=true is already set in the API call
          const statusFilters: string[] = [];

          if (clientView?.filters?.op === "AND") {
            for (const filter of clientView.filters.fields || []) {
              if (filter.field === "status" && filter.values) {
                for (const value of filter.values) {
                  if (typeof value === "string") {
                    statusFilters.push(value);
                  }
                }
              }
            }
          }
          results.push({
            listId: list.id,
            listName: list.name,
            viewId: clientView.id,
            statusFilters,
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

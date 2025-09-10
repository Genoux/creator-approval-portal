import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { ClickUpAPI } from "@/lib/clickup";

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session?.clickupAccessToken) {
      return NextResponse.json(
        { error: "No ClickUp session found" },
        { status: 401 }
      );
    }

    // Use ClickUpAPI wrapper for consistent caching and error handling
    const clickup = ClickUpAPI.createFromSession(
      session.apiToken,
      session.clickupAccessToken
    );

    const teamsData = await clickup.getTeams();
    const teams = teamsData.teams || [];

    const sharedBoards = [];

    // For each team, get shared resources
    for (const team of teams) {
      try {
        const sharedData = await clickup.getSharedResources(team.id);
        const sharedLists = sharedData.shared?.lists || [];

        // Group lists by their space/folder
        const spaceGroups = new Map();
        for (const list of sharedLists) {
          const spaceId = list.space?.id || team.id; // Use team ID if no space
          const spaceName = list.space?.name || `${team.name} - Shared Lists`;

          if (!spaceGroups.has(spaceId)) {
            spaceGroups.set(spaceId, {
              id: spaceId,
              name: spaceName,
              workspace: {
                id: team.id,
                name: team.name,
                color: team.color || "#40BC86",
              },
              lists: [],
            });
          }

          spaceGroups.get(spaceId).lists.push({
            id: list.id,
            name: list.name,
            task_count: list.task_count || 0,
          });
        }

        // Add all grouped spaces to shared boards
        for (const board of spaceGroups.values()) {
          sharedBoards.push(board);
        }
      } catch (error) {
        console.error(`Error processing team ${team.id}:`, error);
      }
    }

    return NextResponse.json({
      boards: sharedBoards,
      user: session.clickupUser,
    });
  } catch (error) {
    console.error("Shared boards API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

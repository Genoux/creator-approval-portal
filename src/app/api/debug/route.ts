import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiToken = process.env.CLICKUP_API_TOKEN;
    if (!apiToken) {
      return NextResponse.json(
        { error: "API token not found" },
        { status: 500 }
      );
    }

    console.log("Fetching user teams...");

    const userResponse = await fetch("https://api.clickup.com/api/v2/user", {
      headers: { Authorization: apiToken },
    });

    if (!userResponse.ok) {
      return NextResponse.json(
        { error: "Failed to get user info" },
        { status: 401 }
      );
    }

    const userData = await userResponse.json();
    console.log("User data:", userData);

    const teamsResponse = await fetch("https://api.clickup.com/api/v2/team", {
      headers: { Authorization: apiToken },
    });

    if (!teamsResponse.ok) {
      return NextResponse.json(
        { error: "Failed to get teams" },
        { status: 401 }
      );
    }

    const teamsData = await teamsResponse.json();
    console.log("Teams data:", teamsData);

    const allSpaces = [];
    for (const team of teamsData.teams || []) {
      try {
        const spacesResponse = await fetch(
          `https://api.clickup.com/api/v2/team/${team.id}/space`,
          {
            headers: { Authorization: apiToken },
          }
        );

        if (spacesResponse.ok) {
          const spacesData = await spacesResponse.json();
          for (const space of spacesData.spaces || []) {
            const foldersResponse = await fetch(
              `https://api.clickup.com/api/v2/space/${space.id}/folder`,
              {
                headers: { Authorization: apiToken },
              }
            );

            let folders = [];
            if (foldersResponse.ok) {
              const foldersData = await foldersResponse.json();

              for (const folder of foldersData.folders || []) {
                const listsResponse = await fetch(
                  `https://api.clickup.com/api/v2/folder/${folder.id}/list`,
                  {
                    headers: { Authorization: apiToken },
                  }
                );

                if (listsResponse.ok) {
                  const listsData = await listsResponse.json();
                  folder.lists = listsData.lists || [];
                }
              }

              folders = foldersData.folders || [];
            }

            const folderlessResponse = await fetch(
              `https://api.clickup.com/api/v2/space/${space.id}/list`,
              {
                headers: { Authorization: apiToken },
              }
            );

            let folderlessLists = [];
            if (folderlessResponse.ok) {
              const folderlessData = await folderlessResponse.json();
              folderlessLists = folderlessData.lists || [];
            }

            allSpaces.push({
              team: team.name,
              space: space.name,
              folders,
              folderlessLists,
            });
          }
        }
      } catch (error) {
        console.error(`Error fetching data for team ${team.id}:`, error);
      }
    }

    return NextResponse.json({
      user: userData.user,
      teams: teamsData.teams,
      hierarchy: allSpaces,
    });
  } catch (error) {
    console.error("Debug endpoint error:", error);
    return NextResponse.json(
      { error: "Failed to fetch ClickUp data" },
      { status: 500 }
    );
  }
}

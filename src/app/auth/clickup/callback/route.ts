import { type NextRequest, NextResponse } from "next/server";
import { COOKIE_OPTIONS, createAuthToken } from "@/lib/auth";
import type { ClickUpAuthResponse, ClickUpTokenResponse } from "@/types";

// Auto-select first available shared list and create auth token
async function autoSelectFirstList(
  sharedData: { shared?: { lists?: Array<{ id: string; name: string }> } },
  tokenData: ClickUpTokenResponse,
  userData: ClickUpAuthResponse
) {
  const sharedLists = sharedData.shared?.lists || [];

  if (sharedLists.length === 0) {
    return null; // No shared lists available
  }

  // Get first available list
  const firstList = sharedLists[0];
  const listId = firstList.id;
  const listName = firstList.name;

  // Verify the list is accessible
  const listResponse = await fetch(
    `https://api.clickup.com/api/v2/list/${listId}`,
    {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    }
  );

  if (!listResponse.ok) {
    console.error("Failed to access first list, falling back to select-board");
    return null;
  }

  // Create auth token with auto-selected list
  const token = await createAuthToken(
    listId,
    process.env.CLICKUP_API_TOKEN || "",
    listName,
    tokenData.access_token,
    {
      id: userData.user.id,
      username: userData.user.username,
      email: userData.user.email,
    }
  );

  return token;
}

// Handle ClickUp OAuth callback
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      return NextResponse.redirect(
        new URL(`/?error=${encodeURIComponent(error)}`, request.url)
      );
    }

    if (!code) {
      return NextResponse.redirect(new URL("/?error=no_code", request.url));
    }

    const clientId = process.env.CLICKUP_CLIENT_ID;
    const clientSecret = process.env.CLICKUP_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return NextResponse.redirect(
        new URL("/?error=oauth_config", request.url)
      );
    }

    // Exchange code for access token
    const tokenResponse = await fetch(
      "https://api.clickup.com/api/v2/oauth/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code: code,
        }),
      }
    );

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("Token exchange failed:", errorText);
      return NextResponse.redirect(
        new URL("/?error=token_exchange", request.url)
      );
    }

    const tokenData: ClickUpTokenResponse = await tokenResponse.json();

    // Get user info with the access token
    const userResponse = await fetch("https://api.clickup.com/api/v2/user", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    if (!userResponse.ok) {
      console.error("Failed to fetch user info");
      return NextResponse.redirect(new URL("/?error=user_info", request.url));
    }

    const userData: ClickUpAuthResponse = await userResponse.json();

    // Get user's teams separately
    const teamsResponse = await fetch("https://api.clickup.com/api/v2/team", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    if (!teamsResponse.ok) {
      const errorText = await teamsResponse.text();
      console.error(
        "Failed to fetch workspaces:",
        teamsResponse.status,
        errorText
      );
    }

    const teamsData = await teamsResponse.json();
    console.log("🚀 ~ GET ~ teamsData:", teamsData.teams[0].id);

    const sharedResponse = await fetch(
      ` https://api.clickup.com/api/v2/team/${teamsData.teams[0].id}/shared`,
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      }
    );

    // const sharedData = await sharedResponse.json();

    // Try to auto-select first available list (comment out this block to disable auto-selection)
    // const autoSelectedToken = await autoSelectFirstList(
    //   sharedData,
    //   tokenData,
    //   userData
    // );

    const token: string = await createAuthToken(
      undefined, // No list selected yet
      process.env.CLICKUP_API_TOKEN || "",
      undefined,
      tokenData.access_token,
      {
        id: userData.user.id,
        username: userData.user.username,
        email: userData.user.email,
      }
    );
    const redirectUrl: string = "/dashboard/select-board";

    // if (autoSelectedToken) {
    // Auto-selection successful - redirect to dashboard
    //token = autoSelectedToken;
    //  redirectUrl = "/dashboard";
    // } else {
    // Auto-selection code removed - always redirect to board selection
    //}

    const response = NextResponse.redirect(new URL(redirectUrl, request.url));

    response.cookies.set("auth-token", token, COOKIE_OPTIONS);

    return response;
  } catch (error) {
    console.error("OAuth callback error:", error);
    return NextResponse.redirect(
      new URL("/?error=callback_error", request.url)
    );
  }
}

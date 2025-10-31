import { type NextRequest, NextResponse } from "next/server";

// Initiate ClickUp OAuth flow
export async function GET(request: NextRequest) {
  const clientId = process.env.CLICKUP_CLIENT_ID;

  if (!clientId) {
    return NextResponse.json(
      { error: "ClickUp OAuth not configured" },
      { status: 500 }
    );
  }

  // Build dynamic redirect URI based on current host
  const url = new URL(request.url);
  const redirectUri = `${url.origin}/auth/clickup/callback`;

  // Build ClickUp OAuth URL
  const authUrl = new URL("https://app.clickup.com/api");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");

  // Redirect user to ClickUp OAuth
  return NextResponse.redirect(authUrl.toString());
}

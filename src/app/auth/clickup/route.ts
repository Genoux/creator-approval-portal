import { NextResponse } from "next/server";

// Initiate ClickUp OAuth flow
export async function GET() {
  const clientId = process.env.CLICKUP_CLIENT_ID;
  const redirectUri = process.env.CLICKUP_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return NextResponse.json(
      { error: "ClickUp OAuth not configured" },
      { status: 500 }
    );
  }

  // Build ClickUp OAuth URL
  const authUrl = new URL("https://app.clickup.com/api");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");

  console.log("🔗 OAuth URL:", authUrl.toString());
  console.log("🔑 Client ID:", clientId);
  console.log("📍 Redirect URI:", redirectUri);

  // Redirect user to ClickUp OAuth
  return NextResponse.redirect(authUrl.toString());
}

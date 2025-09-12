import { type NextRequest, NextResponse } from "next/server";
import { COOKIE_OPTIONS, createAuthToken } from "@/lib/auth";
import type { ClickUpAuthResponse, ClickUpTokenResponse } from "@/types";

/**
 * Handle ClickUp OAuth callback
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      return NextResponse.redirect(
        new URL(`/?error=${encodeURIComponent(error)}`, request.url),
      );
    }

    if (!code) {
      return NextResponse.redirect(new URL("/?error=no_code", request.url));
    }

    const clientId = process.env.CLICKUP_CLIENT_ID;
    const clientSecret = process.env.CLICKUP_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return NextResponse.redirect(
        new URL("/?error=oauth_config", request.url),
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
      },
    );

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("Token exchange failed:", errorText);
      return NextResponse.redirect(
        new URL("/?error=token_exchange", request.url),
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

    const token: string = await createAuthToken(
      null,
      process.env.CLICKUP_API_TOKEN || "",
      null,
      tokenData.access_token,
      {
        id: userData.user.id,
        username: userData.user.username,
        email: userData.user.email,
        color: userData.user.color,
        profilePicture: userData.user.profilePicture,
        initials: userData.user.initials,
        week_start_day: userData.user.week_start_day,
        global_font_support: userData.user.global_font_support,
        timezone: userData.user.timezone,
      },
    );

    // For popup login, return a page that closes the popup and notifies parent
    const response = new NextResponse(
      `
        <html>
          <body>
            <script>
              // Set the auth token cookie
              document.cookie = "auth-token=${token}; path=/; max-age=${COOKIE_OPTIONS.maxAge}; ${COOKIE_OPTIONS.secure ? "secure;" : ""} samesite=${COOKIE_OPTIONS.sameSite}";

              // Close popup and notify parent
              if (window.opener) {
                window.opener.postMessage({ type: 'auth_success' }, window.location.origin);
                window.close();
              } else {
                // Fallback for direct navigation
                window.location.href = '/dashboard';
              }
            </script>
          </body>
        </html>
      `,
      {
        status: 200,
        headers: {
          "Content-Type": "text/html",
        },
      },
    );

    response.cookies.set("auth-token", token, COOKIE_OPTIONS);

    return response;
  } catch (error) {
    console.error("OAuth callback error:", error);
    return NextResponse.redirect(
      new URL("/?error=callback_error", request.url),
    );
  }
}

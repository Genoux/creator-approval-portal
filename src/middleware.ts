import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { verifyAuthToken } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;

  // Debug logging for production
  console.log("🔍 Middleware Debug:", {
    path: request.nextUrl.pathname,
    hasToken: !!token,
    tokenPreview: token ? `${token.substring(0, 20)}...` : null,
    cookies: request.cookies.getAll().map((c) => c.name),
  });

  // Handle home page - redirect to dashboard if authenticated
  if (request.nextUrl.pathname === "/") {
    if (token) {
      console.log("🔐 Verifying token for home page redirect...");
      const session = await verifyAuthToken(token);
      console.log("🔐 Token verification result:", { valid: !!session });

      if (session) {
        console.log("✅ Redirecting authenticated user to dashboard");
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
    console.log("➡️ No token or invalid - staying on login page");
    return NextResponse.next();
  }

  // Handle dashboard protection
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Verify token
    const session = await verifyAuthToken(token);
    if (!session) {
      // Invalid token, redirect to login and clean up
      const response = NextResponse.redirect(new URL("/", request.url));
      response.cookies.delete("auth-token");
      return response;
    }

    // If no list selected and not already on select-board page, redirect there
    if (
      !session.listId &&
      !request.nextUrl.pathname.includes("/select-board")
    ) {
      return NextResponse.redirect(
        new URL("/dashboard/select-board", request.url)
      );
    }

    // If list selected but trying to access select-board, redirect to main dashboard
    if (session.listId && request.nextUrl.pathname.includes("/select-board")) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*"],
};

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { verifyAuthToken } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;

  // Handle home page - redirect to dashboard if authenticated
  if (request.nextUrl.pathname === "/") {
    if (token) {
      try {
        const session = await verifyAuthToken(token);
        if (session) {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }
        // Token exists but is invalid - clear it
        const res = NextResponse.next();
        res.cookies.delete("auth-token");
        return res;
      } catch {
        const res = NextResponse.next();
        res.cookies.delete("auth-token");
        return res;
      }
    }
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
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*"],
};

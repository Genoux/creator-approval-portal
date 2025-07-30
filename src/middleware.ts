import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { verifyAuthToken } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  // Only protect dashboard routes
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    const token = request.cookies.get("auth-token")?.value;

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
  matcher: "/dashboard/:path*",
};

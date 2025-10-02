import { NextResponse } from "next/server";
import { COOKIE_OPTIONS } from "@/lib/auth";
import type { ApiResponse } from "@/types/core";

export async function DELETE() {
  const response = NextResponse.json<ApiResponse<null>>(
    { success: true, message: "Logged out successfully", data: null },
    { status: 200 }
  );
  console.log("deleting cookie");
  response.cookies.set("auth-token", "", {
    ...COOKIE_OPTIONS,
    maxAge: 0,
  });

  return response;
}

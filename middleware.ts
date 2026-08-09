import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, expectedSessionToken } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.next();
  }

  const expected = await expectedSessionToken();
  const cookieValue = request.cookies.get(SESSION_COOKIE)?.value;

  if (!expected || cookieValue !== expected) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

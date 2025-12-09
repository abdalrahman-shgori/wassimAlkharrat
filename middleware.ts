import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken, getSessionToken } from "./lib/auth";

export async function middleware(request: NextRequest) {
  // Safety check: ensure nextUrl exists
  if (!request.nextUrl) {
    return NextResponse.next();
  }

  const pathname = request.nextUrl.pathname;

  // Safety check: ensure pathname exists and is a string
  if (!pathname || typeof pathname !== 'string') {
    return NextResponse.next();
  }

  // Only apply middleware to /admin routes
  if (pathname?.startsWith("/admin")) {
    const cookieHeader = request.headers.get("cookie");
    const sessionToken = getSessionToken(cookieHeader);

    // Verify the session token
    const payload = sessionToken ? await verifyToken(sessionToken) : null;
    const isAuthenticated = !!payload;

    // If trying to access login page while authenticated, redirect to dashboard
    if (pathname?.startsWith("/admin/login") && isAuthenticated) {
      console.log("Redirecting authenticated user from login to dashboard");
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    // If trying to access protected admin pages without authentication, redirect to login
    if (!pathname?.startsWith("/admin/login") && !isAuthenticated) {
      console.log("Redirecting unauthenticated user to login");
      const loginUrl = new URL("/admin/login", request.url);
      // Store the original URL to redirect back after login
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};



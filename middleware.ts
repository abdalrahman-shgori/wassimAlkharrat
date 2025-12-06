import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken, getSessionToken } from "./lib/auth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only apply middleware to /admin routes
  if (pathname.startsWith("/admin")) {
    const cookieHeader = request.headers.get("cookie");
    const sessionToken = getSessionToken(cookieHeader);

    // Verify the session token
    const payload = sessionToken ? verifyToken(sessionToken) : null;
    const isAuthenticated = !!payload;

    // If trying to access login page while authenticated, redirect to dashboard
    if (pathname.startsWith("/admin/login") && isAuthenticated) {
      console.log("Redirecting authenticated user from login to dashboard");
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    // If trying to access protected admin pages without authentication, redirect to login
    if (!pathname.startsWith("/admin/login") && !isAuthenticated) {
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
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.webp).*)",
  ],
};


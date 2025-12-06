import { NextRequest, NextResponse } from "next/server";
import { clearSessionCookie, getCurrentAdmin } from "../../../../../lib/auth";
import { redirect } from "next/navigation";

export async function POST(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    
    if (admin) {
      console.log(`Admin logged out: ${admin.email}`);
    }

    await clearSessionCookie();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "An error occurred during logout" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Support GET requests for simple form submissions
  try {
    await clearSessionCookie();
    return NextResponse.redirect(new URL("/admin/login", request.url));
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
}


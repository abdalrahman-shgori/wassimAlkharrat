import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "../../../../../lib/auth";

export async function GET(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    
    if (admin) {
      return NextResponse.json({
        authenticated: true,
        admin: {
          id: admin._id,
          email: admin.email,
          name: admin.name,
        },
      });
    }
    
    return NextResponse.json({ authenticated: false });
  } catch (error) {
    return NextResponse.json({ authenticated: false, error: "Check failed" });
  }
}


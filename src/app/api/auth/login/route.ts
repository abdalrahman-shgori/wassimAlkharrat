import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getAdminsCollection } from "../../../../../lib/db";
import { setSessionCookie } from "../../../../../lib/auth";

// Mark route as dynamic since it uses cookies
export const dynamic = 'force-dynamic';

function getClientIP(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0] || 
         request.headers.get("x-real-ip") || 
         "unknown";
}

export async function POST(request: NextRequest) {
  try {
    const clientIP = getClientIP(request);
    
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find admin by email
    let admin;
    try {
      const adminsCollection = await getAdminsCollection();
      admin = await adminsCollection.findOne({ email: email.toLowerCase() });
    } catch (dbError: any) {
      console.error("Database connection error:", dbError);
      const errorMessage = dbError?.message || "Unknown database error";
      const errorName = dbError?.name || "Unknown";
      
      // Log full error for debugging
      console.error("Full error:", {
        name: errorName,
        message: errorMessage,
        stack: dbError?.stack,
      });
      
      // Check if it's a connection timeout or server selection error
      if (
        errorMessage.includes("timeout") || 
        errorMessage.includes("Server selection") ||
        errorName === "MongoServerSelectionError" ||
        errorName === "MongoTimeoutError"
      ) {
        return NextResponse.json(
          { 
            error: "Cannot connect to MongoDB. Please check:",
            details: [
              "1. Is MongoDB running?",
              "2. Is the MONGODB_URI correct in .env.local?",
              "3. For local MongoDB: Is it running on localhost:27017?",
              "4. For MongoDB Atlas: Check your network access and credentials",
              "5. Try visiting /api/test to test the connection"
            ],
            errorType: errorName,
            errorMessage: errorMessage
          },
          { status: 503 }
        );
      }
      
      return NextResponse.json(
        { 
          error: "Database connection failed", 
          details: errorMessage,
          errorType: errorName
        },
        { status: 503 }
      );
    }

    if (!admin) {
      console.warn(`Failed login attempt for non-existent email: ${email} from IP: ${clientIP}`);
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.passwordHash);

    if (!isValidPassword) {
      console.warn(`Failed login attempt for email: ${email} from IP: ${clientIP}`);
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Success - set session
    await setSessionCookie(admin._id!.toString(), admin.email);

    console.log(`Successful login for: ${email}`);

    return NextResponse.json({
      success: true,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error("Error details:", { errorMessage, errorStack });
    return NextResponse.json(
      { error: "An error occurred during login", details: errorMessage },
      { status: 500 }
    );
  }
}


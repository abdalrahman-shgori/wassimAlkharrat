import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getAdminsCollection } from "../../../../../lib/db";
import { setSessionCookie } from "../../../../../lib/auth";

// Mark route as dynamic since it uses cookies
export const dynamic = 'force-dynamic';

// Rate limiting map (in-memory, simple implementation)
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

function getClientIP(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0] || 
         request.headers.get("x-real-ip") || 
         "unknown";
}

function checkRateLimit(ip: string): { allowed: boolean; resetIn?: number } {
  const now = Date.now();
  const attempt = loginAttempts.get(ip);

  if (!attempt || now > attempt.resetAt) {
    // Reset or first attempt
    loginAttempts.set(ip, { count: 1, resetAt: now + LOCKOUT_DURATION });
    return { allowed: true };
  }

  if (attempt.count >= MAX_ATTEMPTS) {
    const resetIn = Math.ceil((attempt.resetAt - now) / 1000 / 60); // minutes
    return { allowed: false, resetIn };
  }

  attempt.count++;
  return { allowed: true };
}

function resetRateLimit(ip: string): void {
  loginAttempts.delete(ip);
}

export async function POST(request: NextRequest) {
  try {
    const clientIP = getClientIP(request);
    
    // Check rate limit
    const rateLimit = checkRateLimit(clientIP);
    if (!rateLimit.allowed) {
      console.warn(`Rate limit exceeded for IP: ${clientIP}`);
      return NextResponse.json(
        { 
          error: `Too many login attempts. Please try again in ${rateLimit.resetIn} minutes.` 
        },
        { status: 429 }
      );
    }

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
    const adminsCollection = await getAdminsCollection();
    const admin = await adminsCollection.findOne({ email: email.toLowerCase() });

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

    // Success - reset rate limit and set session
    resetRateLimit(clientIP);
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
    return NextResponse.json(
      { error: "An error occurred during login" },
      { status: 500 }
    );
  }
}


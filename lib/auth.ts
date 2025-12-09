import { SignJWT, jwtVerify, type JWTPayload as JosePayload } from "jose";
import { cookies } from "next/headers";
import { getAdminsCollection } from "./db";
import { AdminWithoutPassword, removePassword } from "./models/Admin";
import { ObjectId } from "mongodb";

const AUTH_SECRET = process.env.AUTH_SECRET || "fallback-secret-change-in-production";
const AUTH_SECRET_BYTES = new TextEncoder().encode(AUTH_SECRET);
const SESSION_COOKIE_NAME = "admin_session";
const SESSION_MAX_AGE = 12 * 60 * 60; // 12 hours in seconds

interface JWTPayload {
  adminId: string;
  email: string;
  iat?: number;
  exp?: number;
  [key: string]: unknown;
}

/**
 * Sign a JWT token for an admin user
 */
export async function signToken(adminId: string, email: string): Promise<string> {
  // Use jose to ensure compatibility with the Edge runtime
  return new SignJWT({ adminId, email } as JWTPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(AUTH_SECRET_BYTES);
}

/**
 * Verify and decode a JWT token
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, AUTH_SECRET_BYTES);
    return payload as JWTPayload & JosePayload;
  } catch (error) {
    // Token is invalid or expired
    return null;
  }
}

/**
 * Get the current admin from the session cookie
 * Returns null if not authenticated or token is invalid
 */
export async function getCurrentAdmin(): Promise<AdminWithoutPassword | null> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionToken) {
      return null;
    }

    const payload = await verifyToken(sessionToken);
    if (!payload) {
      return null;
    }

    // Fetch the admin from database
    const adminsCollection = await getAdminsCollection();
    const admin = await adminsCollection.findOne({
      _id: new ObjectId(payload.adminId),
    });

    if (!admin) {
      return null;
    }

    return removePassword(admin);
  } catch (error) {
    console.error("Error getting current admin:", error);
    return null;
  }
}

/**
 * Require authentication - throws error if not authenticated
 * Use this in API routes
 */
export async function requireAdmin(): Promise<AdminWithoutPassword> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    throw new Error("Unauthorized");
  }
  return admin;
}

/**
 * Set the session cookie
 */
export async function setSessionCookie(adminId: string, email: string): Promise<void> {
  const token = await signToken(adminId, email);
  const cookieStore = await cookies();
  
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

/**
 * Clear the session cookie (logout)
 */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Get the session token from cookies (for middleware)
 */
export function getSessionToken(cookieHeader: string | null): string | null {
  if (!cookieHeader || typeof cookieHeader !== 'string') return null;
  
  const cookies = cookieHeader.split(";")
    .map(c => c?.trim())
    .filter((c): c is string => Boolean(c && typeof c === 'string' && c.length > 0));
  
  const sessionCookie = cookies.find(c => c && typeof c === 'string' && c.startsWith(`${SESSION_COOKIE_NAME}=`));
  
  if (!sessionCookie) return null;
  
  return sessionCookie.split("=")[1];
}


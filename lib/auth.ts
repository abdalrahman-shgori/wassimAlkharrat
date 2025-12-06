import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { getAdminsCollection } from "./db";
import { AdminWithoutPassword, removePassword } from "./models/Admin";
import { ObjectId } from "mongodb";

const AUTH_SECRET = process.env.AUTH_SECRET || "fallback-secret-change-in-production";
const SESSION_COOKIE_NAME = "admin_session";
const SESSION_MAX_AGE = 12 * 60 * 60; // 12 hours in seconds

interface JWTPayload {
  adminId: string;
  email: string;
  iat?: number;
  exp?: number;
}

/**
 * Sign a JWT token for an admin user
 */
export function signToken(adminId: string, email: string): string {
  return jwt.sign(
    { adminId, email } as JWTPayload,
    AUTH_SECRET,
    { expiresIn: SESSION_MAX_AGE }
  );
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, AUTH_SECRET) as JWTPayload;
    return decoded;
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

    const payload = verifyToken(sessionToken);
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
  const token = signToken(adminId, email);
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
  if (!cookieHeader) return null;
  
  const cookies = cookieHeader.split(";").map(c => c.trim());
  const sessionCookie = cookies.find(c => c.startsWith(`${SESSION_COOKIE_NAME}=`));
  
  if (!sessionCookie) return null;
  
  return sessionCookie.split("=")[1];
}


import { jwtVerify, type JWTPayload as JosePayload } from "jose";

const AUTH_SECRET = process.env.AUTH_SECRET || "fallback-secret-change-in-production";
const AUTH_SECRET_BYTES = new TextEncoder().encode(AUTH_SECRET);
const SESSION_COOKIE_NAME = "admin_session";

interface JWTPayload {
  adminId: string;
  email: string;
  iat?: number;
  exp?: number;
  [key: string]: unknown;
}

/**
 * Verify and decode a JWT token (Edge-safe for middleware)
 */
export async function verifyMiddlewareToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, AUTH_SECRET_BYTES);
    return payload as JWTPayload & JosePayload;
  } catch {
    return null;
  }
}

/**
 * Get the session token from the raw cookie header (Edge-safe)
 */
export function getSessionToken(cookieHeader: string | null): string | null {
  if (!cookieHeader || typeof cookieHeader !== "string") return null;

  const cookies = cookieHeader
    .split(";")
    .map((c) => c?.trim())
    .filter((c): c is string => Boolean(c && typeof c === "string" && c.length > 0));

  const sessionCookie = cookies.find(
    (c) => c && typeof c === "string" && c.startsWith(`${SESSION_COOKIE_NAME}=`)
  );

  if (!sessionCookie) return null;

  return sessionCookie.split("=")[1];
}


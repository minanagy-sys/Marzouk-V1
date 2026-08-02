import jwt from "jsonwebtoken";

/**
 * Admin session = a signed JWT stored in an httpOnly cookie. Verified on the
 * server for every admin API call and in the admin layout (SSR). Replaces
 * Supabase Auth for the MySQL/Hostinger build.
 */
export const ADMIN_COOKIE = "mz_admin";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export type AdminRole = "admin" | "editor";
export type AdminUser = { id: string; email: string; name?: string; role: AdminRole };

function secret(): string {
  return process.env.ADMIN_JWT_SECRET || "";
}

export function signSession(user: AdminUser): string {
  return jwt.sign(user, secret(), { expiresIn: MAX_AGE });
}

export function verifySession(token: string): AdminUser | null {
  if (!token || !secret()) return null;
  try {
    const decoded = jwt.verify(token, secret()) as jwt.JwtPayload & AdminUser;
    if (!decoded?.email || !decoded?.role) return null;
    return { id: decoded.id, email: decoded.email, name: decoded.name, role: decoded.role };
  } catch {
    return null;
  }
}

/** Parse a single cookie value out of a raw Cookie header. */
export function readCookie(header: string | null, name: string): string {
  if (!header) return "";
  for (const part of header.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === name) return decodeURIComponent(v.join("="));
  }
  return "";
}

/** The Set-Cookie value for a logged-in session. */
export function sessionCookie(token: string): string {
  const secure = process.env.NODE_ENV === "production" ? " Secure;" : "";
  return `${ADMIN_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax;${secure} Max-Age=${MAX_AGE}`;
}

/** The Set-Cookie value that clears the session. */
export function clearCookie(): string {
  return `${ADMIN_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

/** Read the admin user from a request's cookies (or Authorization: Bearer). */
export function adminFromRequest(request: Request): AdminUser | null {
  const bearer = (request.headers.get("authorization") || "").replace(/^Bearer\s+/i, "").trim();
  const cookie = readCookie(request.headers.get("cookie"), ADMIN_COOKIE);
  return verifySession(bearer || cookie);
}

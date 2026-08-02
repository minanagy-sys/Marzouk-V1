import { adminFromRequest, type AdminUser } from "@/lib/adminSession";

/** The logged-in admin for this request, or null. */
export function getAdmin(request: Request): AdminUser | null {
  return adminFromRequest(request);
}

/** True when the request carries a valid admin/editor session. */
export async function verifyAdmin(request: Request): Promise<boolean> {
  const user = adminFromRequest(request);
  return !!user && (user.role === "admin" || user.role === "editor");
}

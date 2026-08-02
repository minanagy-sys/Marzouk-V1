import type { Metadata } from "next";
import { cookies } from "next/headers";
import AdminGate from "@/components/admin/AdminGate";
import { ADMIN_COOKIE, verifySession } from "@/lib/adminSession";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

// Auth is resolved on the server (SSR) — no client-side session lookup.
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const store = await cookies();
  const user = verifySession(store.get(ADMIN_COOKIE)?.value || "");
  const configured = !!process.env.ADMIN_JWT_SECRET && !!process.env.MYSQL_HOST;
  return (
    <AdminGate user={user} configured={configured}>
      {children}
    </AdminGate>
  );
}

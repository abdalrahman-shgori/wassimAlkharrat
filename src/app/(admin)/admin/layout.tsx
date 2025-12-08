import { getCurrentAdmin } from "../../../../lib/auth";
import AdminLayoutClient from "./AdminLayoutClient";
import "../../globals.css";

// Force dynamic rendering since we use cookies for authentication
export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getCurrentAdmin();

  // If not on login page and not authenticated, redirect
  if (!admin) {
    return <>{children}</>;
  }

  return (
    <AdminLayoutClient adminName={admin.name}>
      {children}
    </AdminLayoutClient>
  );
}


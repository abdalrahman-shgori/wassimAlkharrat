import { getCurrentAdmin } from "../../../../lib/auth";
import NavLink from "./NavLink";
import LogoutButton from "./LogoutButton";
import styles from "./layout.module.scss";
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
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.header}>
          <h2 className={styles.title}>Wassim Alkharrat</h2>
          <p className={styles.subtitle}>Events Dashboard</p>
          <div className={styles.divider}></div>
          <p className={styles.adminName}>{admin.name}</p>
        </div>

        <nav className={styles.nav}>
          <ul>
            <li>
              <NavLink href="/admin" icon="📊" label="Dashboard" />
            </li>
            <li>
              <NavLink href="/admin/services" icon="🎯" label="Services" />
            </li>
            <li>
              <NavLink href="/admin/events" icon="🎉" label="Events" />
            </li>
            <li>
              <NavLink href="/admin/bookings" icon="📋" label="Bookings" />
            </li>
            <li>
              <NavLink href="/admin/settings" icon="⚙️" label="Settings" />
            </li>
          </ul>
        </nav>

        <div className={styles.logoutSection}>
          <LogoutButton />
        </div>
      </aside>

      {/* Main content */}
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}


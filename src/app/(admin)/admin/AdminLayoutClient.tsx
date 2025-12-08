"use client";

import { useState } from "react";
import NavLink from "./NavLink";
import LogoutButton from "./LogoutButton";
import MobileMenuToggle from "./MobileMenuToggle";
import styles from "./layout.module.scss";

interface AdminLayoutClientProps {
  adminName: string;
  children: React.ReactNode;
}

export default function AdminLayoutClient({ adminName, children }: AdminLayoutClientProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className={styles.container}>
      {/* Mobile Menu Toggle */}
      <MobileMenuToggle isOpen={isMobileMenuOpen} onToggle={toggleMobileMenu} />

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div className={styles.mobileOverlay} onClick={closeMobileMenu}></div>
      )}

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${isMobileMenuOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.header}>
          <h2 className={styles.title}>Wassim Alkharrat</h2>
          <p className={styles.subtitle}>Events Dashboard</p>
          <div className={styles.divider}></div>
          <p className={styles.adminName}>{adminName}</p>
        </div>

        <nav className={styles.nav}>
          <ul>
            <li>
              <NavLink href="/admin" icon="📊" label="Dashboard" onClick={closeMobileMenu} />
            </li>
            <li>
              <NavLink href="/admin/hero-section" icon="🌅" label="Hero Section" onClick={closeMobileMenu} />
            </li>
            <li>
              <NavLink href="/admin/services" icon="🎯" label="Services" onClick={closeMobileMenu} />
            </li>
            <li>
              <NavLink href="/admin/events" icon="🎉" label="Events" onClick={closeMobileMenu} />
            </li>
            <li>
              <NavLink href="/admin/stories" icon="📖" label="Stories" onClick={closeMobileMenu} />
            </li>
            <li>
              <NavLink href="/admin/bookings" icon="📋" label="Bookings" onClick={closeMobileMenu} />
            </li>
            <li>
              <NavLink href="/admin/settings" icon="⚙️" label="Settings" onClick={closeMobileMenu} />
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


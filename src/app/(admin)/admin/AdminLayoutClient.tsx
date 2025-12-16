"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();

  const servicesPageRoutes = useMemo(
    () => ["/admin/services-page"],
    []
  );
  const isServicesPageActive = servicesPageRoutes.some((route) => pathname?.startsWith(route));
  const [isServicesPageOpen, setIsServicesPageOpen] = useState(isServicesPageActive);

  const homepageRoutes = useMemo(
    () => ["/admin/hero-section", "/admin/services", "/admin/events", "/admin/stories"],
    []
  );
  // Check homepage routes, but exclude services-page routes to avoid conflicts
  // This prevents /admin/services-page from matching /admin/services
  const isHomepageActive = !isServicesPageActive && homepageRoutes.some((route) => pathname?.startsWith(route));
  const [isHomepageOpen, setIsHomepageOpen] = useState(isHomepageActive);

  useEffect(() => {
    // Update homepage dropdown state
    if (isHomepageActive) {
      setIsHomepageOpen(true);
    } else {
      setIsHomepageOpen(false);
    }
    
    // Update services page dropdown state
    if (isServicesPageActive) {
      setIsServicesPageOpen(true);
    } else {
      setIsServicesPageOpen(false);
    }
  }, [isHomepageActive, isServicesPageActive]);

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
              <div className={styles.dropdown}>
                <button
                  type="button"
                  className={`${styles.dropdownHeader} ${isHomepageActive ? styles.dropdownActive : ""}`}
                  onClick={() => setIsHomepageOpen((prev) => !prev)}
                >
                  <span className={styles.dropdownLabel}>🏠 Homepage</span>
                  <span className={`${styles.chevron} ${isHomepageOpen ? styles.chevronOpen : ""}`}>▸</span>
                </button>
                {isHomepageOpen && (
                  <ul className={styles.dropdownList}>
                    <li>
                      <NavLink
                        href="/admin/hero-section"
                        icon="🌅"
                        label="Hero Section"
                        onClick={closeMobileMenu}
                      />
                    </li>
                    <li>
                      <NavLink
                        href="/admin/services"
                        icon="🎯"
                        label="Services"
                        onClick={closeMobileMenu}
                      />
                    </li>
                    <li>
                      <NavLink
                        href="/admin/events"
                        icon="🎉"
                        label="Events"
                        onClick={closeMobileMenu}
                      />
                    </li>
                    <li>
                      <NavLink
                        href="/admin/stories"
                        icon="📖"
                        label="Stories"
                        onClick={closeMobileMenu}
                      />
                    </li>
                  </ul>
                )}
              </div>
            </li>
            <li>
              <div className={styles.dropdown}>
                <button
                  type="button"
                  className={`${styles.dropdownHeader} ${isServicesPageActive ? styles.dropdownActive : ""}`}
                  onClick={() => setIsServicesPageOpen((prev) => !prev)}
                >
                  <span className={styles.dropdownLabel}>📄 Services Page</span>
                  <span className={`${styles.chevron} ${isServicesPageOpen ? styles.chevronOpen : ""}`}>▸</span>
                </button>
                {isServicesPageOpen && (
                  <ul className={styles.dropdownList}>
                    <li>
                      <NavLink
                        href="/admin/services-page/filters"
                        icon="🔍"
                        label="Services Filters"
                        onClick={closeMobileMenu}
                      />
                    </li>
                  </ul>
                )}
              </div>
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


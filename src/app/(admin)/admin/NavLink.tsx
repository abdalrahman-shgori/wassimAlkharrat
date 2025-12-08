"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./NavLink.module.scss";

interface NavLinkProps {
  href: string;
  icon: string;
  label: string;
  onClick?: () => void;
}

export default function NavLink({ href, icon, label, onClick }: NavLinkProps) {
  const pathname = usePathname();
  
  // Safely determine if link is active with comprehensive checks
  const isActive = (() => {
    // Ensure all values are valid strings before comparison
    if (!pathname || typeof pathname !== 'string') return false;
    if (!href || typeof href !== 'string') return false;
    
    // Direct match
    if (pathname === href) return true;
    
    // Check for nested routes (but not for /admin root)
    if (href !== "/admin" && typeof pathname === "string" && typeof href === "string") {
      return pathname.startsWith(href);
    }
    
    
    return false;
  })();

  return (
    <Link 
      href={href} 
      className={`${styles.navLink} ${isActive ? styles.active : ""}`}
      onClick={onClick}
    >
      {icon} {label}
    </Link>
  );
}


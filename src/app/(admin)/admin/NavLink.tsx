"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./NavLink.module.scss";

interface NavLinkProps {
  href: string;
  icon: string;
  label: string;
}

export default function NavLink({ href, icon, label }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname && typeof pathname === 'string' 
    ? (pathname === href || (href !== "/admin" && pathname.startsWith(href))) 
    : false;

  return (
    <Link 
      href={href} 
      className={`${styles.navLink} ${isActive ? styles.active : ""}`}
    >
      {icon} {label}
    </Link>
  );
}


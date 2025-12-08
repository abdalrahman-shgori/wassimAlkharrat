"use client";

import { useState } from "react";
import styles from "./layout.module.scss";

interface MobileMenuToggleProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function MobileMenuToggle({ isOpen, onToggle }: MobileMenuToggleProps) {
  return (
    <button
      className={styles.mobileMenuToggle}
      onClick={onToggle}
      aria-label="Toggle menu"
    >
      <span className={styles.hamburger}>
        <span className={`${styles.line} ${isOpen ? styles.line1 : ""}`}></span>
        <span className={`${styles.line} ${isOpen ? styles.line2 : ""}`}></span>
        <span className={`${styles.line} ${isOpen ? styles.line3 : ""}`}></span>
      </span>
    </button>
  );
}


"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./LogoutButton.module.scss";

export default function LogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        // Redirect to login page
        router.push("/admin/login");
        router.refresh();
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Still redirect even if there's an error
      router.push("/admin/login");
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={styles.logoutButton}
    >
      {isLoggingOut ? "Logging out..." : "🚪 Logout"}
    </button>
  );
}


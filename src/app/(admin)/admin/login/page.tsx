
"use client";
export const dynamic = "force-dynamic";

import { useState, FormEvent, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./login.module.scss";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/check");
        const data = await response.json();
        
        if (data.authenticated) {
          // User is already logged in, redirect to dashboard
          router.push("/admin");
          router.refresh();
        } else {
          setIsChecking(false);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed");
        setIsLoading(false);
        return;
      }

      // Success - redirect to dashboard or original destination
      const from = searchParams?.get("from") || "/admin";
      router.push(from);
      router.refresh();
    } catch (err) {
      setError("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  // Show loading while checking authentication
  if (isChecking) {
    return (
      <div className={styles.container}>
        <div className={styles.loginBox}>
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <p style={{ color: "#AD8842", fontSize: "1.1rem" }}>Checking authentication...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <div className={styles.header}>
          <h1 className={styles.title}>Wassim Alkharrat</h1>
          <p className={styles.subtitle}>Events Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
              placeholder="admin@eventplanner.com"
              disabled={isLoading}
              autoComplete="email"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
              placeholder="Enter your password"
              disabled={isLoading}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={styles.submitButton}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className={styles.footer}>
          <p className={styles.footerText}>
            Authorized personnel only
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className={styles.container}>
        <div className={styles.loginBox}>
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <p style={{ color: "#AD8842", fontSize: "1.1rem" }}>Loading...</p>
          </div>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}


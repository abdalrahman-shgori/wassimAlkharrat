'use client';

import { useEffect } from 'react';

export default function ScrollToTop() {
  useEffect(() => {
    // Disable browser restoring old scroll position
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // Mobile browsers need a delay before allowing scroll
    const t = setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant" // instant works 100% on mobile
      });
    }, 50); // 50–100ms is ideal

    return () => clearTimeout(t);
  }, []);

  return null;
}

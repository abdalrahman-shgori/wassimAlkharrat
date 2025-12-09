'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Disable browser's automatic scroll restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Function to scroll to top - works better on mobile
    const scrollToTop = () => {
      // Use multiple methods for better mobile compatibility
      if (window.scrollTo) {
        window.scrollTo(0, 0);
      }
      
      // Fallback for older browsers
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    // Use requestAnimationFrame to ensure DOM is ready
    // This is especially important on mobile devices
    const timeoutId = setTimeout(() => {
      requestAnimationFrame(() => {
        scrollToTop();
        // Double check after a short delay for mobile browsers
        setTimeout(scrollToTop, 100);
      });
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [pathname]); // Re-run on route change

  return null;
}


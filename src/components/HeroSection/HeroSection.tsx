'use client';

import Image from "next/image";
import Button from "@/components/UI/Button/Button";
import styles from "./HeroSection.module.scss";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

interface HeroSectionProps {
  imageSrc: string;
  imageAlt?: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  showScrollIndicator?: boolean;
  isHomePage?: boolean;
  sectionTitle?: string;
  nextSectionId?: string;
  onScrollIndicatorClick?: () => void;
}

export default function HeroSection({
  imageSrc,
  imageAlt = "Event services and creative solutions",
  title,
  subtitle,
  ctaText,
  ctaLink,
  showScrollIndicator = true,
  nextSectionId,
  sectionTitle,
  onScrollIndicatorClick,
  isHomePage = false,
}: HeroSectionProps) {
  const t = useTranslations();

  // ✅ SAFE TRANSLATION HANDLER
  const translate = (value?: string) => {
    if (!value) return '';
    return t.has(value) ? t(value) : value;
  };

  const scrollToNext = () => {
    if (!nextSectionId) return;
    const nextElement = document.getElementById(nextSectionId);
    nextElement?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScrollIndicatorClick = () => {
    onScrollIndicatorClick ? onScrollIndicatorClick() : scrollToNext();
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  };
  const sectionRef = useRef<HTMLElement>(null);
  const isScrolling = useRef(false);
  const touchStartY = useRef<number | null>(null);
  const touchScrolled = useRef(false);
  const lastScrollTime = useRef<number>(0);
  const scrollToNextSection = () => {
    const now = Date.now();
    if (isScrolling.current || now - lastScrollTime.current < 1000) return;
    
    isScrolling.current = true;
    lastScrollTime.current = now;
    
    const targetSectionId = nextSectionId || 'new-foundation-section';
    const nextSection = targetSectionId
      ? document.getElementById(targetSectionId)
      : null;
    if (nextSection) {
      // Get the current scroll position
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
      
      // Get the next section's position
      const nextSectionRect = nextSection.getBoundingClientRect();
      const nextSectionTop = nextSectionRect.top + currentScroll;
      
      // Align the next section close to the top of the viewport.
      // Add a small margin to avoid sticking to the very top on desktop.
      const desktopMargin = 0;
      const scrollDistance = nextSectionTop - currentScroll - desktopMargin;
      
      // Smooth scroll to the calculated position
      window.scrollTo({
        top: currentScroll + scrollDistance,
        behavior: 'smooth'
      });
      
      // Increase debounce time for better touch handling
      setTimeout(() => {
        isScrolling.current = false;
        touchScrolled.current = false;
      }, 1200);
    } else {  
      isScrolling.current = false;
      touchScrolled.current = false;
    }
  };

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const now = Date.now();
      if (isScrolling.current || now - lastScrollTime.current < 1000) {
        e.preventDefault();
        return;
      }
      
      // Check if we're in the AboutEthiq section
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        // More permissive condition: if the section is mostly visible
        const isInSection = rect.bottom > window.innerHeight * 0.3;
        
        console.log('Wheel event:', {
          deltaY: e.deltaY,
          isInSection,
          rectTop: rect.top,
          rectBottom: rect.bottom,
          windowHeight: window.innerHeight
        });
        
        if (isInSection && e.deltaY > 0) {
          // User is scrolling down
          e.preventDefault();
          scrollToNextSection();
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isScrolling.current) return;
      
      // Check if we're in the AboutEthiq section
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const isInSection = rect.bottom > window.innerHeight * 0.3;
        
        // Handle arrow down key
        if (isInSection && e.key === 'ArrowDown') {
          e.preventDefault();
          scrollToNextSection();
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (isScrolling.current) return;
      
      const touch = e.touches[0];
      touchStartY.current = touch.clientY;
      touchScrolled.current = false;
      
      const handleTouchMove = (e: TouchEvent) => {
        if (isScrolling.current || touchScrolled.current || !touchStartY.current) {
          e.preventDefault();
          return;
        }
        
        const touch = e.touches[0];
        const currentY = touch.clientY;
        const deltaY = touchStartY.current - currentY;
        
        // Check if we're in the AboutEthiq section and swiping up
        // Lower the swipe threshold so lighter upward swipes trigger scroll on mobile
        const swipeThreshold = 40;
        if (sectionRef.current && deltaY > swipeThreshold) {
          const rect = sectionRef.current.getBoundingClientRect();
          const isInSection = rect.bottom > window.innerHeight * 0.3;
          
          if (isInSection) {
            e.preventDefault();
            touchScrolled.current = true;
            scrollToNextSection();
            return;
          }
        }
      };
      
      const handleTouchEnd = () => {
        touchStartY.current = null;
        touchScrolled.current = false;
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
      
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
    };

    // Add event listeners
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    
    // Prevent default scroll behavior on touch devices when in this section
    const preventDefaultScroll = (e: TouchEvent) => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const isInSection = rect.bottom > window.innerHeight * 0.3;
        
        if (isInSection && !isScrolling.current) {
          e.preventDefault();
        }
      }
    };
    
    document.addEventListener('touchmove', preventDefaultScroll, { passive: false });

    // Cleanup
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', preventDefaultScroll);
    };
  }, [nextSectionId]);

  return (
    <motion.section
      className={styles.heroSection}
      initial="hidden"
      animate="visible"
      transition={{ staggerChildren: 0.15, duration: 0.7, ease: "easeOut" }}
      ref={sectionRef}
    >
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        priority
        className={styles.backgroundImage}
        quality={90}
      />

      <div className={styles.heroContent}>
        {sectionTitle && (
          <motion.h5
            className={styles.heroSectionTitle}
            variants={fadeUp}
          >
            {translate(sectionTitle)}
          </motion.h5>
        )}

        <motion.h1 className={styles.heroTitle} variants={fadeUp}>
          {translate(title)}
        </motion.h1>

        <motion.p className={styles.heroSubtitle} variants={fadeUp}>
          {translate(subtitle)}
        </motion.p>

        {isHomePage && (
          <motion.div variants={fadeUp}>
            <Button href={ctaLink}>
              {translate(ctaText)}
            </Button>
          </motion.div>
        )}
      </div>

      {showScrollIndicator && (
        <motion.div
          className={styles.scrollIndicator}
          onClick={handleScrollIndicatorClick}
          variants={fadeUp}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className={styles.mouse}></div>
        </motion.div>
      )}
    </motion.section>
  );
}

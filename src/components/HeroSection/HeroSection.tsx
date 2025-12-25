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
  const hasScrolledPastHero = useRef(false);
  const heroSectionHeight = useRef<number>(0);


  
  const scrollToNextSection = () => {
    const now = Date.now();
    if (isScrolling.current || now - lastScrollTime.current < 1000) return;
    
    // Check if user is at the top of the hero section
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    const isAtTop = currentScroll <= heroSectionHeight.current * 0.1; // Allow small margin
    
    // Only allow scroll if user is at the top and hasn't scrolled past hero yet
    if (hasScrolledPastHero.current && !isAtTop) {
      return;
    }
    
    isScrolling.current = true;
    lastScrollTime.current = now;
    
    const targetSectionId = nextSectionId || 'new-foundation-section';
    const nextSection = targetSectionId
      ? document.getElementById(targetSectionId)
      : null;
    if (nextSection) {
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
      
      // Mark that user has scrolled past hero
      hasScrolledPastHero.current = true;
      
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
    // Store hero section height
    if (sectionRef.current) {
      heroSectionHeight.current = sectionRef.current.offsetHeight;
    }
    
    // Track scroll position to reset hasScrolledPastHero when back at top
    const handleScroll = () => {
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
      const isAtTop = currentScroll <= heroSectionHeight.current * 0.1;
      
      // Reset flag when user scrolls back to top
      if (isAtTop && hasScrolledPastHero.current) {
        hasScrolledPastHero.current = false;
      }
    };
    
    const handleWheel = (e: WheelEvent) => {
      const now = Date.now();
      if (isScrolling.current || now - lastScrollTime.current < 1000) {
        e.preventDefault();
        return;
      }
      
      // Check if we're in the hero section
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        // More permissive condition: if the section is mostly visible
        const isInSection = rect.bottom > window.innerHeight * 0.3;
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        const isAtTop = currentScroll <= heroSectionHeight.current * 0.1;
        
        // Only allow scroll if user is at the top and hasn't scrolled past hero yet
        if (isInSection && e.deltaY > 0 && (isAtTop || !hasScrolledPastHero.current)) {
          // User is scrolling down
          e.preventDefault();
          scrollToNextSection();
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isScrolling.current) return;
      
      // Check if we're in the hero section
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const isInSection = rect.bottom > window.innerHeight * 0.3;
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        const isAtTop = currentScroll <= heroSectionHeight.current * 0.1;
        
        // Handle arrow down key - only if at top or hasn't scrolled past hero
        if (isInSection && e.key === 'ArrowDown' && (isAtTop || !hasScrolledPastHero.current)) {
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
        
        // Check if we're in the hero section and swiping up
        // Lower the swipe threshold so lighter upward swipes trigger scroll on mobile
        const swipeThreshold = 10;
        if (sectionRef.current && deltaY > swipeThreshold) {
          const rect = sectionRef.current.getBoundingClientRect();
          const isInSection = rect.bottom > window.innerHeight * 0.3;
          const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
          const isAtTop = currentScroll <= heroSectionHeight.current * 0.1;
          
          // Only allow scroll if at top or hasn't scrolled past hero
          if (isInSection && (isAtTop || !hasScrolledPastHero.current)) {


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
    window.addEventListener('scroll', handleScroll, { passive: true });
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
      window.removeEventListener('scroll', handleScroll);
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

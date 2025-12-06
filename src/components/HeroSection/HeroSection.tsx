'use client';

import { useCallback, useRef } from "react";
import Image from "next/image";
import Button from "@/components/Button/Button";
import styles from "./HeroSection.module.scss";
import arrowRight from "../../../public/images/arrowRight.svg"
interface HeroSectionProps {
  imageSrc: string;
  imageAlt?: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  showScrollIndicator?: boolean;
  /**
   * The id of the next section to scroll to when the user
   * scrolls down once or clicks the scroll indicator.
   */
  nextSectionId?: string;
}

export default function HeroSection({
  imageSrc,
  imageAlt = "Hero background",
  title,
  subtitle,
  ctaText,
  ctaLink,
  showScrollIndicator = true,
  nextSectionId,
}: HeroSectionProps) {
  const isSnappingRef = useRef(false);
  const touchStartYRef = useRef<number | null>(null);

  const scrollToNext = useCallback(() => {
    if (!nextSectionId) return;

    const nextElement = document.getElementById(nextSectionId);
    if (!nextElement) return;

    isSnappingRef.current = true;
    nextElement.scrollIntoView({ behavior: "smooth" });

    // allow snapping again after animation finishes
    setTimeout(() => {
      isSnappingRef.current = false;
    }, 800);
  }, [nextSectionId]);

  const handleWheel = (event: React.WheelEvent<HTMLElement>) => {
    if (!nextSectionId || isSnappingRef.current) return;

    if (event.deltaY > 20) {
      event.preventDefault();
      scrollToNext();
    }
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLElement>) => {
    const touch = event.touches[0];
    touchStartYRef.current = touch.clientY;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLElement>) => {
    if (!nextSectionId || isSnappingRef.current || touchStartYRef.current === null) {
      return;
    }

    const touch = event.changedTouches[0];
    const deltaY = touchStartYRef.current - touch.clientY;

    // swipe up
    if (deltaY > 40) {
      scrollToNext();
    }

    touchStartYRef.current = null;
  };

  return (
    <section
      className={styles.heroSection}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        priority
        className={styles.backgroundImage}
        quality={100}
      />

      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>{title}</h1>
        <p className={styles.heroSubtitle}>{subtitle}</p>
        <Button href={ctaLink} >
         {ctaText}  
        </Button>
      </div>

      {showScrollIndicator && (
        <div className={styles.scrollIndicator} onClick={scrollToNext}>
          <div className={styles.mouse}></div>
        </div>
      )}
    </section>
  );
}

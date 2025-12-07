'use client';

import Image from "next/image";
import Button from "@/components/Button/Button";
import styles from "./HeroSection.module.scss";

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
   * clicks the scroll indicator.
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
  const scrollToNext = () => {
    if (!nextSectionId) return;

    const nextElement = document.getElementById(nextSectionId);
    if (!nextElement) return;

    nextElement.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className={styles.heroSection}>
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

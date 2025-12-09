'use client';

import Image from "next/image";
import Button from "@/components/Button/Button";
import styles from "./HeroSection.module.scss";
import { motion } from "framer-motion";

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
  /**
   * Optional override to handle the scroll indicator click,
   * useful when using full-page navigation plugins.
   */
  onScrollIndicatorClick?: () => void;
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
  onScrollIndicatorClick,
}: HeroSectionProps) {
  const scrollToNext = () => {
    if (!nextSectionId) return;

    const nextElement = document.getElementById(nextSectionId);
    if (!nextElement) return;

    nextElement.scrollIntoView({ behavior: "smooth" });
  };

  const handleScrollIndicatorClick = () => {
    if (onScrollIndicatorClick) {
      onScrollIndicatorClick();
      return;
    }

    scrollToNext();
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.section 
      className={styles.heroSection}
      initial="hidden"
      animate="visible"
      transition={{ staggerChildren: 0.15, duration: 0.7, ease: "easeOut" }}
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
        <motion.h1 className={styles.heroTitle} variants={fadeUp}>{title}</motion.h1>
        <motion.p className={styles.heroSubtitle} variants={fadeUp}>{subtitle}</motion.p>
        <motion.div variants={fadeUp}>
          <Button href={ctaLink} >
           {ctaText}  
          </Button>
        </motion.div>
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

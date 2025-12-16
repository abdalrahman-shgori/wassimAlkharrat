'use client';

import Image from "next/image";
import Button from "@/components/UI/Button/Button";
import styles from "./HeroSection.module.scss";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

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

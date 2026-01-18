'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './MissionSection.module.scss';
import { motion, useInView } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
interface CounterProps {
  target: number;
  suffix?: string;
  duration?: number;
}
function Counter({ target, suffix = '', duration = 2000 }: CounterProps) {
    
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeOutQuart * target);
      
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, target, duration]);

  return (
    <div ref={ref}>
      {count}{suffix}
    </div>
  );
}

export default function MissionSection() {
  const t = useTranslations('about.mission');
  const locale = useLocale();

  const fadeIn = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
  };

  // Parse numbers from strings like "500+", "100+", or Arabic numerals "٥٠٠+", etc.
  const parseStatNumber = (numberString: string) => {
    // Map Arabic-Indic numerals to regular digits
    const arabicToEnglish: { [key: string]: string } = {
      '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
      '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9',
    };
    
    // Convert Arabic-Indic numerals to English digits
    let convertedString = numberString;
    Object.keys(arabicToEnglish).forEach(arabic => {
      convertedString = convertedString.replace(new RegExp(arabic, 'g'), arabicToEnglish[arabic]);
    });
    
    // Match digits and suffix
    const match = convertedString.match(/(\d+)(.*)/);
    if (match) {
      return {
        value: parseInt(match[1], 10),
        suffix: match[2] || '',
      };
    }
    return { value: 0, suffix: '' };
  };

  const stats = [
    {
      number: t('stats.events.number'),
      label: t('stats.events.label'),
    },
    {
      number: t('stats.clients.number'),
      label: t('stats.clients.label'),
    },
    {
      number: t('stats.awards.number'),
      label: t('stats.awards.label'),
    },
    {
      number: t('stats.experience.number'),
      label: t('stats.experience.label'),
    },
  ].map(stat => ({
    ...stat,
    ...parseStatNumber(stat.number),
  }));

  return (
    <motion.section 
      className={styles.missionSection}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ staggerChildren: 0.15, duration: 0.6, ease: "easeOut" }}
    >
      <div className={styles.backgroundImageWrapper}>
        <Image
          src="/images/aboutUs/ourMission.webp"
          alt="Wassim Alkharrat Events - Our mission to craft bespoke, unforgettable events"
          fill
          className={styles.backgroundImage}
          quality={90}
          priority={false}
        />
      </div>
      
      <div className={styles.overlay}></div>
      
      <div className={styles.missionContent}>
        <motion.h5 className={styles.missionSubtitle} variants={fadeIn}>
          {t('subtitle')}
        </motion.h5>
        
        <motion.h2 className={styles.missionTitle} variants={fadeIn}>
          <span className={styles.missionTitleBold}>{t('title')}</span>
        {
          locale === 'en' && (
            <span className={styles.missionTitleLight}> {t('titleSuffix')}</span>
          )
        }
          <span className={styles.missionTitleBold}> {t('is')}</span>
        </motion.h2>
        
        <motion.p className={styles.missionStatement} variants={fadeIn}>
          "{t('statement')}"
        </motion.p>
        
        <motion.div className={styles.statsGrid} variants={fadeIn}>
          {stats.map((stat, index) => (
            <div key={index} className={styles.statItem}>
              <div className={styles.statNumber}>
                <Counter target={stat.value} suffix={stat.suffix} duration={2000} />
              </div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}


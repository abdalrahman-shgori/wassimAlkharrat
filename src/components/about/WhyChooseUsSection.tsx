'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { FaRegHeart, FaRegStar } from 'react-icons/fa';
import { HiOutlineSparkles } from 'react-icons/hi';
import Button from '@/components/UI/Button/Button';
import styles from './WhyChooseUsSection.module.scss';

export default function WhyChooseUsSection() {
  const t = useTranslations('about.whyChooseUs');

  const fadeUp = {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0 },
  };

  const features = [
    {
      icon: FaRegHeart,
      title: t('features.personalized.title'),
      description: t('features.personalized.description'),
    },
    {
      icon: FaRegStar,
      title: t('features.detail.title'),
      description: t('features.detail.description'),
    },
    {
      icon: HiOutlineSparkles,
      title: t('features.creative.title'),
      description: t('features.creative.description'),
    },
  ];

  return (
    <motion.section
      className={styles.whyChooseUsSection}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ staggerChildren: 0.15, duration: 0.6, ease: "easeOut" }}
    >
      <motion.h2 className={styles.whyChooseUsTitle} variants={fadeUp}>
        {t('title')}
      </motion.h2>

      <div className={styles.featuresGrid}>
        {features.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <motion.div
              key={index}
              className={styles.featureCard}
              variants={fadeUp}
            >
              <div className={styles.featureIcon}>
                <IconComponent />
              </div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </motion.div>
          );
        })}
      </div>

      {/* <motion.div className={styles.ctaWrapper} variants={fadeUp}>
        <Button href="/contact" className={styles.ctaButton}>
          {t('ctaButton')}
        </Button>
      </motion.div> */}
    </motion.section>
  );
}


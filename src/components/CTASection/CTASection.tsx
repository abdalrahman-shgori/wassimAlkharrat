'use client';

import React from 'react';
import Image from 'next/image';
import Button from '@/components/Button/Button';
import styles from './CTASection.module.scss';
import { motion } from 'framer-motion';

export default function CTASection() {
  const fadeIn = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.section 
      className={styles.ctaSection}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ staggerChildren: 0.15, duration: 0.6, ease: "easeOut" }}
    >
      <div className={styles.backgroundImageWrapper}>
        <Image
          src="/images/homepage/test.webp"
          alt="Luxurious outdoor event with floral arch and ocean backdrop"
          fill
          className={styles.backgroundImage}
          quality={90}
          priority={false}
        />
      </div>
      
      <div className={styles.overlay}></div>
      
      <div className={styles.ctaContent}>
        <motion.div className={styles.ctaCard} variants={fadeIn}>
          <div className={styles.ctaTextContent}>
            <h2 className={styles.ctaTitle}>Ready to Plan Your Dream Event?</h2>
            <p className={styles.ctaDescription}>
              Let's create something extraordinary together. Get in touch with our team to start planning your unforgettable celebration.
            </p>
          </div>
          <motion.div className={styles.ctaButtonWrapper} variants={fadeIn}>
            <Button href="/contact" className={styles.ctaButton}>
              Connect Us
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}


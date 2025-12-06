'use client';

import React from 'react';
import Image from 'next/image';
import Button from '@/components/Button/Button';
import styles from './CTASection.module.scss';

export default function CTASection() {
  return (
    <section className={styles.ctaSection}>
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
        <div className={styles.ctaCard}>
          <div className={styles.ctaTextContent}>
            <h2 className={styles.ctaTitle}>Ready to Plan Your Dream Event?</h2>
            <p className={styles.ctaDescription}>
              Let's create something extraordinary together. Get in touch with our team to start planning your unforgettable celebration.
            </p>
          </div>
          <div className={styles.ctaButtonWrapper}>
            <Button href="/contact" className={styles.ctaButton}>
              Connect Us
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}


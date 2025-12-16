'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import styles from './whatWeDoSection.module.scss';
import { useTranslations } from 'next-intl';

export interface WhatWeDoItem {
  title?: string;
  titleEn?: string;
  titleAr?: string;
  description?: string;
  descriptionEn?: string;
  descriptionAr?: string;
  image?: string;
}

interface WhatWeDoSectionProps {
  items: WhatWeDoItem[];
}

export default function WhatWeDoSection({ items }: WhatWeDoSectionProps) {
    const t = useTranslations('services');
  if (!items || items.length === 0) {
    return null;
  }

  const fadeUp = {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0 },
  };

  const getImageSrc = (image?: string) => {
    if (!image) return null;
    if (image.startsWith('http://') || image.startsWith('https://')) {
      return image;
    }
    return image;
  };

  return (
    <motion.section
      className={styles.whatWeDoSection}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ staggerChildren: 0.15, duration: 0.6, ease: "easeOut" }}
    >
      <h1 className={styles.whatWeDoSectionTitle}>{t('whatWeDo')}</h1>

      <div className={styles.whatWeDoContainer}>
        {items.map((item, index) => {
          const imageSrc = getImageSrc(item.image);
          const isEven = index % 2 === 0;
          const isCloudinaryImage = imageSrc && (imageSrc.startsWith('http://') || imageSrc.startsWith('https://'));

          return (
            <motion.div
              key={index}
              className={`${styles.whatWeDoItem} ${isEven ? styles.itemEven : styles.itemOdd}`}
              variants={fadeUp}
            >
              {isEven ? (
                <>
                  <div className={styles.whatWeDoText}>
                    <h2 className={styles.whatWeDoTitle}>{item.title}</h2>
                    <p className={styles.whatWeDoDescription}>{item.description}</p>
                  </div>
                  {imageSrc && (
                    <div className={styles.whatWeDoImageWrapper}>
                      {isCloudinaryImage ? (
                        <Image
                          src={imageSrc}
                          alt={item.title || ''}
                          className={styles.whatWeDoImage}
                          width={600}
                          height={400}
                          priority={index < 2}
                        />
                      ) : (
                        <Image
                          src={imageSrc}
                          alt={item.title || ''}
                          width={600}
                          height={400}
                          className={styles.whatWeDoImage}
                          priority={index < 2}
                        />
                      )}
                    </div>
                  )}
                </>
              ) : (
                <>
                  {imageSrc && (
                    <div className={styles.whatWeDoImageWrapper}>
                      {isCloudinaryImage ? (
                        <Image
                          src={imageSrc}
                          alt={item.title || ''}
                          className={styles.whatWeDoImage}
                          width={600}
                          height={400}
                          priority={index < 2}
                        />
                      ) : (
                        <Image
                          src={imageSrc}
                          alt={item.title || ''}
                          width={600}
                          height={400}
                          className={styles.whatWeDoImage}
                          priority={index < 2}
                        />
                      )}
                    </div>
                  )}
                  <div className={styles.whatWeDoText}>
                    <h2 className={styles.whatWeDoTitle}>{item.title}</h2>
                    <p className={styles.whatWeDoDescription}>{item.description}</p>
                  </div>
                </>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}


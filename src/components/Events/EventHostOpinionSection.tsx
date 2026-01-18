'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import styles from './EventHostOpinionSection.module.scss';

interface EventHostOpinionSectionProps {
  title?: string;
  quote: string;
  hostName?: string;
  hostRole?: string;
  image?: string;
}

export default function EventHostOpinionSection({
  title = 'Testimonial',
  quote,
  hostName,
  hostRole,
  image,
}: EventHostOpinionSectionProps) {
  if (!quote?.trim()) return null;

  // Get image source - handle Cloudinary URLs
  const getImageSrc = () => {
    if (image) {
      // If it's a Cloudinary URL (starts with http/https), use it directly
      if (image.startsWith('http://') || image.startsWith('https://')) {
        return image;
      }
      // If it's a local path, use it as is
      return image;
    }
    // Fallback image
    return '/images/stories.jpg.webp';
  };

  const imageSrc = getImageSrc();
  const isCloudinaryImage = imageSrc.startsWith('http://') || imageSrc.startsWith('https://');

  return (
    <motion.section 
      className={styles.hostOpinionSection}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <h2 className={styles.titleTop}>{title}</h2>

      <div className={styles.opinionCard}>
        <div className={styles.imageContainer}>
          <div className={styles.imageWrapper}>
            {isCloudinaryImage ? (
              <img
                src={imageSrc}
                alt={hostName || 'Event'}
                className={styles.opinionImage}
                style={{ 
                  objectFit: 'cover', 
                  width: '100%', 
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0
                }}
              />
            ) : (
              <Image
                src={imageSrc}
                alt={hostName || 'Event'}
                fill
                className={styles.opinionImage}
                priority
                quality={90}
              />
            )}
          </div>
        </div>
        
        <div className={styles.textContainer}>
          <h2 className={styles.title}>{title}</h2>
          
          <div className={styles.testimonialWrapper}>
            <div className={styles.testimonialContent}>
              <p className={styles.testimonial}>{quote}</p>
              {(hostName || hostRole) && (
                <p className={styles.names}>
                  {hostName || ''}
                  {hostName && hostRole && ' — '}
                  {hostRole || ''}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}



'use client';

import React from 'react';
import styles from './EventsSection.module.scss';
import Image from 'next/image';
import arrowRight from "../../../public/images/arrowRight.svg";
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface Event {
  _id: string;
  image: string;
  eventTitle: string;
  eventSubtitle: string;
  isActive: boolean;
}

interface EventsSectionProps {
  events: Event[];
}

export default function EventsSection({ events = [] }: EventsSectionProps) {
  const t = useTranslations('events');
  const safeEvents = events || [];

  // Get image source - handle both Cloudinary URLs and local paths
  const getImageSrc = (event: Event) => {
    if (event.image) {
      return event.image;
    }
    return '/images/placeholder.jpg'; // fallback placeholder
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
  };

  // Reset animation key when events change
  const contentKey = safeEvents.length > 0 ? safeEvents.map(e => e._id).join(',') : 'empty';

  return (
    <motion.section 
      id="events-next-section"
      className={styles.eventsSection}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.2 }}
      transition={{ staggerChildren: 0.12, duration: 0.6, ease: "easeOut" }}
    >
      <div className={styles.eventsSectionContent} key={contentKey}>
        {safeEvents.length === 0 ? (
          <motion.div className={styles.error} variants={fadeUp} initial="hidden" animate="visible">
            {t('empty') || 'No events available'}
          </motion.div>
        ) : (
          safeEvents.map((event) => {
            const imageSrc = getImageSrc(event);
            const isCloudinaryImage = event.image && (event.image.startsWith('http://') || event.image.startsWith('https://'));
            
            return (
              <motion.div
                key={event._id}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <div className={styles.eventsSectionContentItem}>
                  <div className={styles.eventImageWrapper}>
                    {isCloudinaryImage ? (
                      <img
                        src={imageSrc}
                        alt={event.eventTitle}
                        className={styles.eventImage}
                        loading="lazy"
                      />
                    ) : (
                      <Image 
                        src={imageSrc} 
                        alt={event.eventTitle}
                        fill
                        className={styles.eventImage}
                        sizes="(max-width: 834px) 50vw, (max-width: 1200px) 33vw, 400px"
                      />
                    )}
                  </div>
                  <h3 className={styles.eventsSectionContentItemTitle}>{event.eventTitle}</h3>
                  <p className={styles.eventsSectionContentItemDescription}>{event.eventSubtitle}</p>
                  <div className={styles.eventsSectionContentItemLink}>
                    learn more
                    <Image src={arrowRight} alt="arrow" className={styles.eventsSectionContentItemLinkArrow} />
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.section>
  );
}

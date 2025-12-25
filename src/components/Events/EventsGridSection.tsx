'use client';

import React from 'react';
import Link from 'next/link';
import styles from './EventsGridSection.module.scss';
import Image from 'next/image';
import arrowRight from '../../../public/images/arrowRight.svg';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface Event {
  _id: string;
  image: string;
  eventTitle: string;
  eventSubtitle: string;
  isActive: boolean;
  eventTitleEn?: string;
  eventTitleAr?: string | null;
}

interface EventsGridSectionProps {
  events: Event[];
  eventTypeSlug?: string; // Optional event type slug for URL routing
}

// Utility function to create slug from event title
// Matches the server-side createSlug function for consistency
const createSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export default function EventsGridSection({ events = [], eventTypeSlug }: EventsGridSectionProps) {
  const t = useTranslations('events');
  const safeEvents = events || [];

  const getImageSrc = (event: Event) => {
    if (event.image) return event.image;
    return '/images/placeholder.jpg';
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
  };

  const contentKey =
    safeEvents.length > 0 ? safeEvents.map(e => e._id).join(',') : 'empty';

  return (
    <motion.section
      id="events-next-section"
      className={styles.eventsSection}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.2 }}
      transition={{ staggerChildren: 0.12, duration: 0.6, ease: 'easeOut' }}
    >
      <div className={styles.eventsSectionContent} key={contentKey}>
        {safeEvents.length === 0 ? (
          <motion.div
            className={styles.error}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            {t('empty') || 'No events available'}
          </motion.div>
        ) : (
          safeEvents.map(event => {
            const imageSrc = getImageSrc(event);
            const isCloudinaryImage =
              event.image &&
              (event.image.startsWith('http://') ||
                event.image.startsWith('https://'));

            // Use original English title for consistent slug generation
            const eventSlug = createSlug(event.eventTitleEn || event.eventTitle);
            // Build the link URL: if eventTypeSlug is provided, use /events/[slug]/[eventName], otherwise use /events/[eventName]
            const eventUrl = eventTypeSlug 
              ? `/events/${eventTypeSlug}/${eventSlug}`
              : `/events/${eventSlug}`;

            return (
              <motion.div
                key={event._id}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                <Link href={eventUrl} className={styles.eventsSectionContentItem}>
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
                  <h3 className={styles.eventsSectionContentItemTitle}>
                    {event.eventTitle}
                  </h3>
                  {
                    event.eventSubtitle && (
                      <p className={styles.eventsSectionContentItemDescription}>
                        {event.eventSubtitle}
                      </p>
                    )
                  }
                  <div className={styles.eventsSectionContentItemLink}>
                   {t('learnMore')}
                    <Image
                      src={arrowRight}
                      alt="arrow"
                      className={styles.eventsSectionContentItemLinkArrow}
                    />
                  </div>
                </Link>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.section>
  );
}


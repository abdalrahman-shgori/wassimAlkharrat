'use client';

import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import Image from 'next/image';
import styles from './EventsSection.module.scss';
import { useTranslations, useLocale } from 'next-intl';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

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

export default function EventsSection({ events }: EventsSectionProps) {
  // Ensure events is always an array
  const safeEvents = events || [];
  const t = useTranslations('events');
  const locale = useLocale();
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  
  // Preserve events during locale transitions to prevent disappearing
  const [preservedEvents, setPreservedEvents] = useState<Event[]>(safeEvents);
  
  // Update preserved events when new events arrive (and they're not empty)
  useEffect(() => {
    if (safeEvents.length > 0) {
      setPreservedEvents(safeEvents);
    }
  }, [safeEvents]);
  
  // Use preserved events to prevent disappearing during locale changes
  const displayEvents = preservedEvents.length > 0 ? preservedEvents : safeEvents;
  
  // ⭐ FIX FOR LOOP STOPPING:
  // Swiper cannot loop unless there are enough slides,
  // so we duplicate your events when the list is small.
  const loopEvents =
    displayEvents.length < 20 ? [...displayEvents, ...displayEvents, ...displayEvents] : displayEvents;

  // Update Swiper when locale changes to prevent whitespace
  useEffect(() => {
    if (swiperInstance && displayEvents.length > 0) {
      // Small delay to ensure translations are updated
      const timeoutId = setTimeout(() => {
        swiperInstance.update();
        swiperInstance.updateSlides();
        swiperInstance.updateSlidesClasses();
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [locale, swiperInstance, displayEvents.length]);

  return (
    <section className={styles.eventsSection}>
      <h1 className={styles.eventsSectionTitle}>{t('title')}</h1>

      <div className={styles.eventsSectionContent}>
        {displayEvents.length === 0 ? (
          <div className={styles.error}>{t('empty')}</div>
        ) : (
          <Swiper
            key={`events-swiper-${locale}-${displayEvents.length}`}
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            centeredSlides={true}
            loop={displayEvents.length > 1}
            slidesPerView={1.2}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 24 },
              768: { slidesPerView: 1.8, spaceBetween: 24 },
              1024: { slidesPerView: 2.2, spaceBetween: 24 },
            }}
            className={styles.eventsSwiper}
            onSwiper={setSwiperInstance}
          >
            {displayEvents.map((event, index) => {
              const isCloudinaryImage =
                event.image &&
                (event.image.startsWith('http://') ||
                  event.image.startsWith('https://'));

              return (
                <SwiperSlide key={event._id + '-' + index} className={styles.eventSlide}>
                  <div className={styles.eventCard}>
                    {isCloudinaryImage ? (
                      <img
                        src={event.image}
                        alt={event.eventTitle}
                        className={styles.eventImage}
                      />
                    ) : (
                      <Image
                        src={event.image}
                        alt={event.eventTitle}
                        className={styles.eventImage}
                        width={736}
                        height={490}
                      />
                    )}

                    <div className={styles.eventInfo}>
                      <h3 className={styles.eventSubtitle}>{event.eventTitle}</h3>
                      <p className={styles.eventDescription}>{event.eventSubtitle}</p>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        )}

        <button className={styles.exploreButton}>{t('explore')}</button>
      </div>
    </section>
  );
}

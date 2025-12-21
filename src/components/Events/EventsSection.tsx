'use client';

import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
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

export default function EventsSection({ events: initialEvents }: EventsSectionProps) {
  const t = useTranslations('events');
  const locale = useLocale();
  const [events, setEvents] = useState<Event[]>(initialEvents || []);
  const [loading, setLoading] = useState(false);
  const [prevLocale, setPrevLocale] = useState<string | null>(null);

  // Fetch events when locale changes
  useEffect(() => {
    // Skip on initial mount
    if (prevLocale === null) {
      setPrevLocale(locale);
      return;
    }

    // Only fetch if locale actually changed
    if (prevLocale !== locale) {
      const fetchEvents = async () => {
        setLoading(true);
        try {
          const response = await fetch('/api/events?active=true', {
            credentials: 'include', // Include cookies to get the correct locale
          });
          const data = await response.json();
          
          if (data.success && data.data) {
            const formattedEvents = data.data.map((event: any) => ({
              _id: event._id?.toString() || event._id,
              image: event.image || '',
              eventTitle: event.eventTitle || '',
              eventSubtitle: event.eventSubtitle || '',
              isActive: event.isActive ?? true,
            }));
            setEvents(formattedEvents);
          } else {
            setEvents([]);
          }
        } catch (error) {
          console.error('Error fetching events:', error);
          setEvents([]);
        } finally {
          setLoading(false);
        }
      };

      fetchEvents();
      setPrevLocale(locale);
    }
  }, [locale, prevLocale]);

  // Update events when initialEvents prop changes (from server re-render)
  useEffect(() => {
    if (initialEvents && initialEvents.length > 0) {
      setEvents(initialEvents);
    }
  }, [initialEvents]);

  const safeEvents = events || [];

  return (
    <section className={styles.eventsSection}>
      <h1 className={styles.eventsSectionTitle}>{t('title')}</h1>

      <div className={styles.eventsSectionContent}>
        {safeEvents.length === 0 && !loading ? (
          <div className={styles.error}>{t('empty')}</div>
        ) : safeEvents.length > 0 ? (
          <Swiper
            key={`events-swiper-${locale}-${safeEvents.map(e => e._id).join('-')}`}
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            centeredSlides={true}
            loop={safeEvents.length > 1}
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
          >
            {safeEvents.map((event, index) => {
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
        ) : null}

        <button className={styles.exploreButton}>{t('explore')}</button>
      </div>
    </section>
  );
}

'use client';

import React, { useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';

import styles from './EventsSection.module.scss';

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

export default function EventsSection({ events = [] }: EventsSectionProps) {
  const t = useTranslations('events');
  const locale = useLocale();

  /**
   * 🔁 Swiper loop fix
   * Swiper cannot loop correctly with few slides,
   * so we duplicate slides when the list is small.
   */
  const loopEvents = useMemo(() => {
    if (events.length < 6) {
      return [...events, ...events, ...events];
    }
    return events;
  }, [events]);

  /**
   * ⭐ KEY POINT
   * Changing this key forces Swiper to fully remount
   * when language OR data changes (production-safe)
   */
  const swiperKey = useMemo(
    () => `events-swiper-${locale}-${loopEvents.length}`,
    [locale, loopEvents.length]
  );

  return (
    <section className={styles.eventsSection}>
      <h1 className={styles.eventsSectionTitle}>{t('title')}</h1>

      <div className={styles.eventsSectionContent}>
        {events.length === 0 ? (
          <div className={styles.error}>{t('empty')}</div>
        ) : (
          <Swiper
            key={swiperKey}
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            centeredSlides
            loop
            slidesPerView={1.2}
            dir={locale === 'ar' ? 'rtl' : 'ltr'}
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
            {loopEvents.map((event, index) => {
              const isExternalImage =
                event.image?.startsWith('http://') ||
                event.image?.startsWith('https://');

              return (
                <SwiperSlide
                  key={`${event._id}-${index}`}
                  className={styles.eventSlide}
                >
                  <div className={styles.eventCard}>
                    {isExternalImage ? (
                      <img
                        src={event.image}
                        alt={event.eventTitle}
                        className={styles.eventImage}
                        loading="lazy"
                      />
                    ) : (
                      <Image
                        src={event.image}
                        alt={event.eventTitle}
                        className={styles.eventImage}
                        width={736}
                        height={490}
                        priority={index === 0}
                      />
                    )}

                    <div className={styles.eventInfo}>
                      <h3 className={styles.eventSubtitle}>
                        {event.eventTitle}
                      </h3>
                      <p className={styles.eventDescription}>
                        {event.eventSubtitle}
                      </p>
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

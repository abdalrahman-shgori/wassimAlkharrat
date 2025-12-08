'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import Image from 'next/image';
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
  order: number;
}

interface EventsSectionProps {
  events: Event[];
}

export default function EventsSection({ events }: EventsSectionProps) {
  
  // ⭐ FIX FOR LOOP STOPPING:
  // Swiper cannot loop unless there are enough slides,
  // so we duplicate your events when the list is small.
  const loopEvents =
    events.length < 4 ? [...events, ...events, ...events] : events;

  return (
    <section className={styles.eventsSection}>
      <h1 className={styles.eventsSectionTitle}>Events</h1>

      <div className={styles.eventsSectionContent}>
        {events.length === 0 ? (
          <div className={styles.error}>No events available at the moment.</div>
        ) : (
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            centeredSlides={true}
            loop={true}
            loopAdditionalSlides={5}   // ⭐ FIX: forces proper looping
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
            {loopEvents.map((event, index) => {
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

        <button className={styles.exploreButton}>Explore Events</button>
      </div>
    </section>
  );
}

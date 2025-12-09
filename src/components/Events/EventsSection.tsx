'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import Image from 'next/image';
import styles from './EventsSection.module.scss';
import { motion } from 'framer-motion';

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
  // Ensure events is always an array
  const safeEvents = events || [];
  
  // ⭐ FIX FOR LOOP STOPPING:
  // Swiper cannot loop unless there are enough slides,
  // so we duplicate your events when the list is small.
  const loopEvents =
    safeEvents.length < 4 ? [...safeEvents, ...safeEvents, ...safeEvents] : safeEvents;

  const container = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.section 
      className={styles.eventsSection}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ staggerChildren: 0.15, duration: 0.6, ease: "easeOut" }}
    >
      <motion.h1 className={styles.eventsSectionTitle} variants={container}>Events</motion.h1>

      <motion.div className={styles.eventsSectionContent} variants={container}>
        {safeEvents.length === 0 ? (
          <motion.div className={styles.error} variants={container}>No events available at the moment.</motion.div>
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
                  <motion.div 
                    className={styles.eventCard}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.45, ease: "easeOut", delay: 0.05 }}
                  >
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
                  </motion.div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        )}

        <motion.button 
          className={styles.exploreButton}
          variants={container}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          Explore Events
        </motion.button>
      </motion.div>
    </motion.section>
  );
}

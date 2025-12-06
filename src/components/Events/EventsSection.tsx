'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import Image from 'next/image';
import styles from './EventsSection.module.scss';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Button from '../Button';


const events = [
  {
    id: 1,
    image: '/images/homepage/test.webp',
    alt: 'Birthday or Anniversary Celebration',
    title: 'Birthday or Anniversary Celebration',
    subtitle: 'BIRTHDAY',
    description: 'CELEBRATE LIFE\'S PRECIOUS MOMENTS WITH STYLE AND JOY. WE CREATE MEMORABLE EXPERIENCES FOR YOUR SPECIAL OCCASIONS, FROM INTIMATE GATHERINGS TO GRAND CELEBRATIONS, ENSURING EVERY DETAIL REFLECTS YOUR UNIQUE STORY AND BRINGS SMILES TO EVERY GUEST.',
  },
  {
    id: 2,
    image: '/images/homepage/test.webp',
    alt: 'Wedding Dance',
    title: 'Wedding Dance',
    subtitle: 'WEDDING',
    description: 'THIS IS WHERE TWO STORIES MERGE INTO ONE BEAUTIFUL FUTURE. WE HANDLE EVERY DETAIL, FROM THE FIRST LOOK TO THE LAST DANCE, ENSURING YOUR DAY IS FILLED WITH GENUINE JOY, EFFORTLESS ELEGANCE, AND PURE, UNFORGETTABLE EMOTION.',
  },
  {
    id: 3,
    image: '/images/homepage/test.webp',
    alt: 'Wedding Reception Setup',
    title: 'Corporate Event',
    subtitle: 'CORPORATE EVENTS',
    description: 'ELEVATE YOUR BUSINESS GATHERINGS WITH PROFESSIONAL EXCELLENCE. WE DELIVER SEAMLESS CORPORATE EVENTS THAT IMPRESS CLIENTS, MOTIVATE TEAMS, AND CREATE LASTING BUSINESS CONNECTIONS, ALL WHILE MAINTAINING THE HIGHEST STANDARDS OF SERVICE AND ATTENTION TO DETAIL.',
  },
  {
    id: 4,
    image: '/images/homepage/test.webp',
    alt: 'Wedding Reception Setup',
    title: 'Special Celebration',
    subtitle: 'SPECIAL CELEBRATIONS',
    description: 'TURN YOUR VISION INTO REALITY WITH OUR EXPERT EVENT PLANNING. WHETHER IT\'S A MILESTONE ACHIEVEMENT, GRADUATION, OR ANY SPECIAL MOMENT WORTH CELEBRATING, WE BRING CREATIVITY, PRECISION, AND PASSION TO MAKE YOUR EVENT TRULY UNFORGETTABLE.',
  },
];

export default function EventsSection() {
  return (
    <section className={styles.eventsSection}>
      <h1 className={styles.eventsSectionTitle}>Events</h1>
      <div className={styles.eventsSectionContent}>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={24}
          centeredSlides={true}
          loop={true}
          slidesPerView={1.2}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 24,
            },
            768: {
              slidesPerView: 1.8,
              spaceBetween: 24,
            },
            1024: {
              slidesPerView: 2.2,
              spaceBetween: 24,
            },
          }}
          className={styles.eventsSwiper}
        >
          {events.map((event) => (
            <SwiperSlide key={event.id} className={styles.eventSlide}>
              <div className={styles.eventCard}>
                <Image 
                  src={event.image} 
                  alt={event.alt}  
                  className={styles.eventImage} 
                  width={736}
                  height={490} 
                />
                <div className={styles.eventInfo}>
                  <h3 className={styles.eventSubtitle}>{event.subtitle}</h3>
                  <p className={styles.eventDescription}>{event.description}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <button className={styles.exploreButton}>Explore Events</button>

      </div>
    </section>
  );
}
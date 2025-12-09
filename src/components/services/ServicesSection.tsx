'use client';

import React from 'react';
import styles from './services.module.scss';
import Link from 'next/link';
import venue from "../../../public/images/homepage/venue.svg";
import arrowRight from "../../../public/images/arrowRight.svg";
import Image from 'next/image';
import { motion } from 'framer-motion';

interface Service {
  _id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image?: string;
  isActive: boolean;
  order: number;
}

interface ServicesSectionProps {
  services: Service[];
}

export default function ServicesSection({ services }: ServicesSectionProps) {
  // Ensure services is always an array
  const safeServices = services || [];

  // Get image source - use Cloudinary image if available, otherwise fallback to venue icon
  const getImageSrc = (service: Service) => {
    if (service.image) {
      // If it's a Cloudinary URL (starts with http/https), use it directly
      if (service.image.startsWith('http://') || service.image.startsWith('https://')) {
        return service.image;
      }
      // If it's a local path, prepend it
      return service.image;
    }
    return venue;
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.section 
      className={styles.servicesSection}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ staggerChildren: 0.12, duration: 0.6, ease: "easeOut" }}
    >
      <div className={styles.servicesSectionHeader}>
        <motion.h1 className={styles.servicesSectionTitle} variants={fadeUp}>Services</motion.h1>
        <motion.div variants={fadeUp}>
          <Link href='/services' className={styles.servicesSectionLink}>View All</Link>
        </motion.div>
      </div>
      <div className={styles.servicesSectionContent}>
        {safeServices.length === 0 ? (
          <motion.div className={styles.error} variants={fadeUp}>
            No services available at the moment.
          </motion.div>
        ) : (
          safeServices.map((service) => {
            const imageSrc = getImageSrc(service);
            const isCloudinaryImage = service.image && (service.image.startsWith('http://') || service.image.startsWith('https://'));
            
            return (
              <motion.div
                key={service._id}
                variants={fadeUp}
                transition={{ duration: 0.5, ease: "easeOut" }}
                whileHover={{ translateY: -6, scale: 1.01 }}
              >
              <Link 
                href={`/services/${service.slug}`} 
                className={styles.servicesSectionContentItem} 
              >
                {isCloudinaryImage ? (
                  <Image 
                    src={imageSrc} 
                    alt={service.name}
                    className={styles.serviceImage}
                    width={400}
                    height={300}
                  />
                ) : (
                  <Image 
                    src={imageSrc} 
                    alt={service.name}
                    width={400}
                    height={300}
                    className={styles.serviceImage}
                  />
                )}
                <h3 className={styles.servicesSectionContentItemTitle}>{service.name}</h3>
                <p className={styles.servicesSectionContentItemDescription}>{service.description}</p>
                <div className={styles.servicesSectionContentItemLink}>
                  Learn more
                  <Image src={arrowRight} alt="arrow" className={styles.servicesSectionContentItemLinkArrow} />
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
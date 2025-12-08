'use client';

import React from 'react';
import styles from './services.module.scss';
import Link from 'next/link';
import venue from "../../../public/images/homepage/venue.svg";
import arrowRight from "../../../public/images/arrowRight.svg";
import Image from 'next/image';

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

  return (
    <section className={styles.servicesSection}>
      <div className={styles.servicesSectionHeader}>
        <h1 className={styles.servicesSectionTitle}>Services</h1>
        <Link href='/services' className={styles.servicesSectionLink}>View All</Link>
      </div>
      <div className={styles.servicesSectionContent}>
        {services.length === 0 ? (
          <div className={styles.error}>
            No services available at the moment.
          </div>
        ) : (
          services.map((service) => {
            const imageSrc = getImageSrc(service);
            const isCloudinaryImage = service.image && (service.image.startsWith('http://') || service.image.startsWith('https://'));
            
            return (
              <Link 
                href={`/services/${service.slug}`} 
                className={styles.servicesSectionContentItem} 
                key={service._id}
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
            );
          })
        )}
      </div>
    </section>
  );
}
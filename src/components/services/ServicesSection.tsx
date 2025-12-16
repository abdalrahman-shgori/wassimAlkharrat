'use client';

import React, { useState, useMemo, useEffect } from 'react';
import styles from './services.module.scss';
import Link from 'next/link';
import venue from "../../../public/images/homepage/venue.svg";
import arrowRight from "../../../public/images/arrowRight.svg";
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface Service {
  _id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image?: string;
  filterKey?: string;
  isActive: boolean;
}

interface ServiceFilter {
  _id: string;
  key: string;
  name: string;
  nameEn: string;
  nameAr: string;
}

interface ServicesSectionProps {
  services: Service[];
  filters?: ServiceFilter[];
  isHomePage?: boolean;
}

export default function ServicesSection({ services, filters = [], isHomePage = false }: ServicesSectionProps) {
  // Ensure services is always an array
  const safeServices = services || [];
  const t = useTranslations('services');
  const [filteredServices, setFilteredServices] = useState<Service[]>(safeServices);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Update filtered services when services prop changes
  useEffect(() => {
    setFilteredServices(safeServices);
  }, [safeServices]);

  const handleFilterClick = async (filterKey: string | null) => {
    setActiveFilter(filterKey);
    setLoading(true);

    try {
      const url = filterKey 
        ? `/api/services?active=true&filterKey=${encodeURIComponent(filterKey)}`
        : '/api/services?active=true';
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success && data.data) {
        // Ensure data structure matches Service interface
        const formattedServices = data.data.map((service: any) => ({
          _id: service._id?.toString() || service._id,
          name: service.name || '',
          slug: service.slug || '',
          description: service.description || '',
          icon: service.icon || '🎉',
          image: service.image,
          filterKey: service.filterKey,
          isActive: service.isActive ?? true,
        }));
        setFilteredServices(formattedServices);
      } else {
        setFilteredServices([]);
      }
    } catch (error) {
      console.error('Error fetching filtered services:', error);
      setFilteredServices([]);
    } finally {
      setLoading(false);
    }
  };
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

  // Reset animation key when filtered services change
  const contentKey = filteredServices.length > 0 ? filteredServices.map(s => s._id).join(',') : 'empty';

  return (
    <motion.section 
    id="services-next-section"
      className={`${styles.servicesSection} ${isHomePage ? styles.servicesSectionHomePage : styles.servicesSectionNotHomePage}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.2 }}
      transition={{ staggerChildren: 0.12, duration: 0.6, ease: "easeOut" }}
    >
      {isHomePage && (
      <div className={styles.servicesSectionHeader}>
          <motion.h1 className={styles.servicesSectionTitle} variants={fadeUp}>{t('title')}</motion.h1>
          <motion.div variants={fadeUp}>
            <Link href='/services' className={styles.servicesSectionLink}>{t('viewAll')}</Link>
          </motion.div>
        </div>
      )}
      
      {!isHomePage && filters.length > 0 && (
        <div className={styles.filtersContainer}>
          <button
            className={`${styles.filterButton} ${activeFilter === null ? styles.filterButtonActive : ''}`}
            onClick={() => handleFilterClick(null)}
            disabled={loading}
          >
            {t('allFilters') || 'All'}
          </button>
          {filters.map((filter) => (
            <button
              key={filter._id}
              className={`${styles.filterButton} ${activeFilter === filter.key ? styles.filterButtonActive : ''}`}
              onClick={() => handleFilterClick(filter.key)}
              disabled={loading}
            >
              {filter.name}
            </button>
          ))}
        </div>
      )}

      <div className={styles.servicesSectionContent} key={contentKey}>
        {loading ? (
          // Show skeleton loaders matching the card design
          Array.from({ length: safeServices.length > 0 ? safeServices.length : 6 }).map((_, index) => (
            <div key={`skeleton-${index}`} className={styles.skeletonCard}>
              <div className={styles.skeletonImage}></div>
              <div className={styles.skeletonTitle}></div>
              <div className={styles.skeletonDescription}></div>
              <div className={styles.skeletonDescription} style={{ width: '60%' }}></div>
            </div>
          ))
        ) : filteredServices.length === 0 ? (
          <motion.div className={styles.error} variants={fadeUp} initial="hidden" animate="visible">
            {t('empty')}
          </motion.div>
        ) : (
          filteredServices.map((service) => {
            const imageSrc = getImageSrc(service);
            const isCloudinaryImage = service.image && (service.image.startsWith('http://') || service.image.startsWith('https://'));
            
            return (
              <motion.div
                key={service._id}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
              <Link 
                href={`/services/${service.slug}`} 
                className={styles.servicesSectionContentItem} 
              >
                <div className={styles.serviceImageWrapper}>
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
                </div>
                <h3 className={styles.servicesSectionContentItemTitle}>{service.name}</h3>
                <p className={styles.servicesSectionContentItemDescription}>{service.description}</p>
                <div className={styles.servicesSectionContentItemLink}>
                  {t('learnMore')}
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
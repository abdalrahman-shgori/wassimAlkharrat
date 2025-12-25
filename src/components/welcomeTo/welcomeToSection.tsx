'use client';

import  React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import styles from './welcomeToSection.module.scss';
import logo from "../../../public/images/welcomeLogo.svg";
import Image from 'next/image';
import { FaMapMarkerAlt, FaClock, FaHeart } from 'react-icons/fa';

interface WelcomeToSectionProps {
  id?: string;
  title: string;
  description: string;
  author?: string;
  services?: string[];
  location?: string;
  date?: string;
  eventType?: string;
}

export default function WelcomeToSection({
  id,
  title,
  description,
  author,
  services = [],
  location,
  date,
  eventType,
}: WelcomeToSectionProps) {
  const t = useTranslations('welcome');

  const fadeUp = {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0 },
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    
    // Try to parse various date formats
    try {
      // If it's already in DD/MM/YYYY format, return as is
      if (dateString.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
        return dateString;
      }
      
      // Try to parse ISO format or YYYY-MM-DD
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      }
    } catch {
      // Return as is if parsing fails
    }
    
    return dateString;
  };

  return (
    <>
        <motion.section 
          id={id}
          className={styles.welcomeToSection}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ staggerChildren: 0.15, duration: 0.6, ease: "easeOut" }}
        >
        <motion.div className={styles.welcomeToSectionLogo} variants={fadeUp}>
            <Image src={logo} alt="logo" className={styles.welcomeToSectionLogoImage} />
        </motion.div>
        <motion.div className={styles.welcomeToSectionContent} variants={fadeUp}>
          <h1 className={styles.welcomeToSectionTitle}>{title}</h1>
          <p className={styles.welcomeToSectionDescription}>{description}</p>
          <h5 className={styles.welcomeToSectionAuthor}>{author}</h5>
          
          {services && services.length > 0 && (
            <div className={styles.servicesSection}>
              <h3 className={styles.servicesHeading}>{t('services')}</h3>
              <ul className={styles.servicesList}>
                {services.map((service, index) => (
                  <li key={index}>{service}</li>
                ))}
              </ul>
            </div>
          )}

          <div className={styles.eventMetaInfo}>
            {location && (
              <div className={styles.metaItem}>
                <FaMapMarkerAlt className={styles.metaIcon} />
                <span>{location}</span>
              </div>
            )}
            {date && (
              <div className={styles.metaItem}>
                <FaClock className={styles.metaIcon} />
                <span>{formatDate(date)}</span>
              </div>
            )}
            {eventType && (
              <div className={styles.metaItem}>
                <FaHeart className={styles.metaIcon} />
                <span>{eventType}</span>
              </div>
            )}
          </div>
        </motion.div>

     
    </motion.section>

    
    </>

  );
}
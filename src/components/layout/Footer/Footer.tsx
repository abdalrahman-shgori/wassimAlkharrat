'use client';

import React from 'react';
import Link from 'next/link';
import { FaFacebookF, FaInstagram, FaYoutube, FaTiktok, FaWhatsapp, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import styles from './Footer.module.scss';
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        {/* Left Section - Company Info and Social Media */}
        <div className={styles.leftSection}>
          <h2 className={styles.companyName}>{t('companyName')}</h2>
          <p className={styles.slogan}>
            {t('slogan')}
          </p>
          <div className={styles.socialMedia}>
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.socialIcon}
              aria-label="Facebook"
            >
              <FaFacebookF />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.socialIcon}
              aria-label="X (Twitter)"
            >
              <FaXTwitter />
            </a>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.socialIcon}
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
            <a 
              href="https://youtube.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.socialIcon}
              aria-label="YouTube"
            >
              <FaYoutube />
            </a>
            <a 
              href="https://tiktok.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.socialIcon}
              aria-label="TikTok"
            >
              <FaTiktok />
            </a>
            <a 
              href="https://wa.me/1234567890" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.socialIcon}
              aria-label="WhatsApp"
            >
              <FaWhatsapp />
            </a>
          </div>
        </div>

        {/* Middle Section - Quick Links */}
        <div className={styles.middleSection}>
          <h3 className={styles.sectionHeading}>{t('quickLinks')}</h3>
          <nav className={styles.quickLinks}>
            <Link href="/" className={styles.link}>{t('home')}</Link>
            <Link href="/services" className={styles.link}>{t('services')}</Link>
            <Link href="/events" className={styles.link}>{t('events')}</Link>
            <Link href="/accessories" className={styles.link}>{t('accessories')}</Link>
            <Link href="/about" className={styles.link}>{t('about')}</Link>
          </nav>
        </div>

        {/* Right Section - Connect Us */}
        <div className={styles.rightSection}>
          <h3 className={styles.sectionHeading}>{t('connect')}</h3>
          <div className={styles.contactInfo}>
          <a href="tel:+963944406638" className={styles.contactItem}>
              <FaPhone className={styles.contactIcon} />
              <span>+963 9444 06638</span>
            </a>
           
            <a href="mailto:hello@wassimalkharratevents.com" className={styles.contactItem}>
              <FaEnvelope className={styles.contactIcon} />
              <span>hello@wassimalkharratevents.com</span>
            </a>
            <a 
              href="https://www.google.com/maps/search/?api=1&query=123+Elegant+Boulevard,+Luxury+District,+NY+10001" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.contactItem}
            >
              <FaMapMarkerAlt className={styles.contactIcon} />
              <span>123 Elegant Boulevard, Luxury District, NY 10001</span>
            </a>
            
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className={styles.copyrightSection}>
        <div className={styles.copyrightLine}></div>
        <p className={styles.copyright}>{t('copyright')}</p>
      </div>
    </footer>
  );
}


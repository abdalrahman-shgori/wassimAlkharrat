'use client';

import React from 'react';
import Link from 'next/link';
import { FaFacebookF, FaInstagram, FaYoutube, FaTiktok, FaWhatsapp, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import styles from './Footer.module.scss';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        {/* Left Section - Company Info and Social Media */}
        <div className={styles.leftSection}>
          <h2 className={styles.companyName}>Wassim Alkharrat </h2>
          <p className={styles.slogan}>
            Creating unforgettable moments with elegance, creativity, and precision. Your dream event awaits.
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
          <h3 className={styles.sectionHeading}>Quick Links</h3>
          <nav className={styles.quickLinks}>
            <Link href="/" className={styles.link}>Home</Link>
            <Link href="/services" className={styles.link}>Services</Link>
            <Link href="/events" className={styles.link}>Events</Link>
            <Link href="/accessories" className={styles.link}>Accessories</Link>
            <Link href="/about" className={styles.link}>About us</Link>
          </nav>
        </div>

        {/* Right Section - Connect Us */}
        <div className={styles.rightSection}>
          <h3 className={styles.sectionHeading}>Connect Us</h3>
          <div className={styles.contactInfo}>
          <div className={styles.contactItem}>
              <FaPhone className={styles.contactIcon} />
              <span>+1 (212) 555-1234</span>
            </div>
           
            <div className={styles.contactItem}>
              <FaEnvelope className={styles.contactIcon} />
              <span>hello@wassimalkharratevents.com</span>
            </div>
            <div className={styles.contactItem}>
              <FaMapMarkerAlt className={styles.contactIcon} />
              <span>123 Elegant Boulevard, Luxury District, NY 10001</span>
            </div>
            
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className={styles.copyrightSection}>
        <div className={styles.copyrightLine}></div>
        <p className={styles.copyright}>© All rights reserved, 2025</p>
      </div>
    </footer>
  );
}


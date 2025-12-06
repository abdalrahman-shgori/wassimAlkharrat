'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FaFacebookF, FaInstagram, FaYoutube, FaTiktok, FaWhatsapp } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import styles from './Navbar.module.scss';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPosition = window.scrollY;
          
          // Always show navbar at the top
          if (scrollPosition === 0) {
            setIsVisible(true);
            setIsScrolled(false);
          } else {
            // Determine scroll direction
            const scrollDirection = scrollPosition > lastScrollY ? 'down' : 'up';
            
            // Hide navbar when scrolling down, show when scrolling up
            setIsVisible(scrollDirection === 'up');
            
            // Update background based on scroll position
            setIsScrolled(scrollPosition > 50);
          }
          
          lastScrollY = scrollPosition > 0 ? scrollPosition : 0;
          ticking = false;
        });
        
        ticking = true;
      }
    };

    // Check initial scroll position
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <>
      <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''} ${!isVisible ? styles.hidden : ''}`}>
        <div className={styles.container}>
          {/* Logo */}
          <Link href="/" className={styles.logo}>
            <Image
              src="/images/navLogo.svg"
              alt="Logo"
              width={109}
              height={60}
              priority
            />
          </Link>

          {/* Burger Menu Icon */}
          <button
            className={`${styles.burger} ${isOpen ? styles.active : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* Overlay */}
      <div
        className={`${styles.overlay} ${isOpen ? styles.open : ''}`}
        onClick={closeMenu}
      ></div>

      {/* Slide Menu */}
      <div className={`${styles.slideMenu} ${isOpen ? styles.open : ''}`}>
        <button
          className={styles.closeButton}
          onClick={closeMenu}
          aria-label="Close menu"
        >
          <span></span>
          <span></span>
        </button>
        <div className={styles.menuContent}>
          <nav className={styles.menuLinks}>
            <Link 
              href="/" 
              onClick={closeMenu} 
              className={`${styles.menuItem} ${isActive('/') ? styles.active : ''}`}
            >
              Home
            </Link>
            <Link 
              href="/events" 
              onClick={closeMenu} 
              className={`${styles.menuItem} ${isActive('/events') ? styles.active : ''}`}
            >
              Events
            </Link>
            <Link 
              href="/services" 
              onClick={closeMenu} 
              className={`${styles.menuItem} ${isActive('/services') ? styles.active : ''}`}
            >
              Services
            </Link>
            <Link 
              href="/about" 
              onClick={closeMenu} 
              className={`${styles.menuItem} ${isActive('/about') ? styles.active : ''}`}
            >
              About
            </Link>
            <Link 
              href="/contact" 
              onClick={closeMenu} 
              className={`${styles.menuItem} ${isActive('/contact') ? styles.active : ''}`}
            >
              Contact
            </Link>
          </nav>

          {/* Social Media Icons */}
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
      </div>
    </>
  );
}


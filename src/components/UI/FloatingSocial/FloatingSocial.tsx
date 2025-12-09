'use client';

import { useState, type ComponentType } from 'react';
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaWhatsapp,
  FaYoutube,
  FaShareAlt,
  FaTimes,
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import styles from './FloatingSocial.module.scss';

type SocialLink = {
  href: string;
  label: string;
  Icon: ComponentType;
};

const socialLinks: SocialLink[] = [
  { href: 'https://facebook.com', label: 'Facebook', Icon: FaFacebookF },
  { href: 'https://twitter.com', label: 'X (Twitter)', Icon: FaXTwitter },
  { href: 'https://instagram.com', label: 'Instagram', Icon: FaInstagram },
  { href: 'https://youtube.com', label: 'YouTube', Icon: FaYoutube },
  { href: 'https://tiktok.com', label: 'TikTok', Icon: FaTiktok },
  { href: 'https://wa.me/1234567890', label: 'WhatsApp', Icon: FaWhatsapp },
];

export default function FloatingSocial() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen((prev) => !prev);

  return (
    <div className={styles.fab} data-open={isOpen}>
      <div className={styles.actions} aria-hidden={!isOpen}>
        {socialLinks.map(({ href, label, Icon }, index) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.action}
            style={{
              transitionDelay: isOpen
                ? `${index * 50}ms` // open bottom to top
                : `${(socialLinks.length - index) * 50}ms`, // close top to bottom
            }}
            aria-label={label}
          >
            <Icon />
          </a>
        ))}
      </div>

      <button
        type="button"
        className={styles.toggle}
        onClick={toggleOpen}
        aria-label={isOpen ? 'Close social links' : 'Open social links'}
        aria-expanded={isOpen}
      >
        {isOpen ? <FaTimes /> : <FaShareAlt />}
      </button>
    </div>
  );
}


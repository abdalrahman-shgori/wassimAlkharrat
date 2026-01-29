'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaVideo } from 'react-icons/fa';
import styles from './EventGallerySection.module.scss';
import GalleryShowcase from '../Gallery/GalleryShowcase';

type GalleryItem = string | { type: 'video'; url: string; thumbnail?: string };

interface EventGallerySectionProps {
  images: Array<string | { type: 'video'; url: string; thumbnail?: string }>;
  title?: string;
}

export default function EventGallerySection({ 
  images, 
  title = "Gallery" 
}: EventGallerySectionProps) {
  const [showcaseOpen, setShowcaseOpen] = useState(false);
  const [showcaseIndex, setShowcaseIndex] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  const isVideo = (item: GalleryItem): item is { type: 'video'; url: string; thumbnail?: string } => {
    return typeof item === 'object' && item !== null && 'type' in item && item.type === 'video';
  };

  const getItemUrl = (item: GalleryItem): string => {
    if (typeof item === 'string') return item;
    return item.thumbnail || '';
  };

  const handleImageClick = (index: number) => {
    setShowcaseIndex(index);
    setShowcaseOpen(true);
  };

  const handleShowcaseClose = () => {
    setShowcaseOpen(false);
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <motion.section
        className={styles.gallerySection}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        transition={{ staggerChildren: 0.1, duration: 0.6, ease: "easeOut" }}
      >
        <div className={styles.galleryContainer}>
          <motion.h2 className={styles.galleryTitle} variants={fadeUp}>
            {title}
          </motion.h2>
          
          <div className={styles.galleryGrid}>
            {images.map((item, index) => {
              const itemUrl = getItemUrl(item);
              const isVideoItem = isVideo(item);
              
              return (
                <motion.div
                  key={index}
                  className={`${styles.galleryItem} ${index === 0 ? styles.firstItem : ''}`}
                  variants={fadeUp}
                  onClick={() => handleImageClick(index)}
                >
                  <div className={styles.imageWrapper}>
                    {itemUrl && (
                      isVideoItem ? (
                        <img
                          src={itemUrl}
                          alt={`Gallery video ${index + 1}`}
                          className={styles.galleryImage}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }}
                        />
                      ) : (
                        <Image
                          src={itemUrl}
                          alt={`Gallery image ${index + 1}`}
                          fill
                          className={styles.galleryImage}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 23vw"
                        />
                      )
                    )}
                    {isVideoItem && (
                      <div className={styles.videoBadge}>
                        <FaVideo />
                      </div>
                    )}
                    <div className={styles.imageOverlay}>
                      <span className={styles.viewIcon}>
                        {isVideoItem ? '▶' : '👁'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Gallery Showcase */}
      {showcaseOpen && images.length > 0 && (
        <GalleryShowcase
          images={images}
          initialIndex={showcaseIndex}
          isOpen={showcaseOpen}
          onClose={handleShowcaseClose}
        />
      )}
    </>
  );
}


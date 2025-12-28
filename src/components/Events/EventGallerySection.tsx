'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaVideo } from 'react-icons/fa';
import styles from './EventGallerySection.module.scss';
import YouTubeEmbed from './YouTubeEmbed';

type GalleryItem = string | { type: 'video'; url: string; thumbnail?: string };

interface EventGallerySectionProps {
  images: Array<string | { type: 'video'; url: string; thumbnail?: string }>;
  title?: string;
}

export default function EventGallerySection({ 
  images, 
  title = "Gallery" 
}: EventGallerySectionProps) {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

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

  const openLightbox = (item: GalleryItem, index: number) => {
    setSelectedItem(item);
    setSelectedIndex(index);
  };

  const closeLightbox = () => {
    setSelectedItem(null);
    setSelectedIndex(null);
  };

  const navigateItem = (direction: 'prev' | 'next') => {
    if (selectedIndex === null) return;
    
    let newIndex: number;
    if (direction === 'prev') {
      newIndex = selectedIndex > 0 ? selectedIndex - 1 : images.length - 1;
    } else {
      newIndex = selectedIndex < images.length - 1 ? selectedIndex + 1 : 0;
    }
    
    setSelectedIndex(newIndex);
    setSelectedItem(images[newIndex]);
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (selectedItem === null || selectedIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedItem(null);
        setSelectedIndex(null);
      } else if (e.key === 'ArrowLeft') {
        const newIndex = selectedIndex > 0 ? selectedIndex - 1 : images.length - 1;
        setSelectedIndex(newIndex);
        setSelectedItem(images[newIndex]);
      } else if (e.key === 'ArrowRight') {
        const newIndex = selectedIndex < images.length - 1 ? selectedIndex + 1 : 0;
        setSelectedIndex(newIndex);
        setSelectedItem(images[newIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedItem, selectedIndex, images]);

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
                  onClick={() => openLightbox(item, index)}
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

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedItem && selectedIndex !== null && (
          <motion.div
            className={styles.lightbox}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            <motion.button
              className={styles.closeButton}
              onClick={closeLightbox}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <FaTimes />
            </motion.button>

            {images.length > 1 && (
              <>
                <motion.button
                  className={`${styles.navButton} ${styles.navButtonPrev}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateItem('prev');
                  }}
                  aria-label="Previous item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: 0.2 }}
                >
                  ←
                </motion.button>

                <motion.button
                  className={`${styles.navButton} ${styles.navButtonNext}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateItem('next');
                  }}
                  aria-label="Next item"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: 0.2 }}
                >
                  →
                </motion.button>
              </>
            )}

            <motion.div
              className={styles.lightboxContent}
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              {isVideo(selectedItem) ? (
                <div className={styles.lightboxVideo}>
                  <YouTubeEmbed url={selectedItem.url} title={`Gallery video ${selectedIndex + 1}`} />
                </div>
              ) : (
                <div className={styles.lightboxImage}>
                  <Image
                    src={selectedItem}
                    alt={`Gallery image ${selectedIndex + 1}`}
                    fill
                    className={styles.lightboxImg}
                    sizes="90vw"
                    priority
                  />
                </div>
              )}
            </motion.div>

            <div className={styles.imageCounter}>
              {selectedIndex + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}


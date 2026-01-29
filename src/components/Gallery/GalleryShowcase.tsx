'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import styles from './GalleryShowcase.module.scss';
import { GalleryImage } from '../../../lib/models/Gallery';
import YouTubeEmbed from '../Events/YouTubeEmbed';

// Support both gallery images and event items (images/videos)
type EventItem = string | { type: 'video'; url: string; thumbnail?: string };
type ShowcaseItem = GalleryImage | EventItem;

interface GalleryShowcaseProps {
  images: ShowcaseItem[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function GalleryShowcase({
  images,
  initialIndex,
  isOpen,
  onClose,
}: GalleryShowcaseProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Helper functions to detect item types
  const isGalleryImage = (item: ShowcaseItem): item is GalleryImage => {
    return typeof item === 'object' && item !== null && 'image' in item && !('type' in item);
  };

  const isVideo = (item: ShowcaseItem): item is { type: 'video'; url: string; thumbnail?: string } => {
    return typeof item === 'object' && item !== null && 'type' in item && item.type === 'video';
  };

  const isEventImage = (item: ShowcaseItem): item is string => {
    return typeof item === 'string';
  };

  const getImageUrl = (item: ShowcaseItem): string => {
    if (isGalleryImage(item)) {
      return item.image;
    }
    if (isVideo(item)) {
      return item.thumbnail || '';
    }
    if (isEventImage(item)) {
      return item;
    }
    return '';
  };

  // Update current index when initialIndex changes
  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  // Auto-play functionality (skip videos)
  useEffect(() => {
    if (!isOpen || !isAutoPlay || images.length <= 1) return;

    const currentItem = images[currentIndex];
    // Skip auto-play if current item is a video
    if (isVideo(currentItem)) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const nextIndex = (prev + 1) % images.length;
        const nextItem = images[nextIndex];
        // Skip videos in auto-play
        if (isVideo(nextItem)) {
          return (nextIndex + 1) % images.length;
        }
        return nextIndex;
      });
    }, 2000); // 2 seconds

    return () => clearInterval(interval);
  }, [isOpen, isAutoPlay, images, currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        setIsLoading(true);
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
        setIsAutoPlay(false);
        setTimeout(() => setIsLoading(false), 300);
      } else if (e.key === 'ArrowRight') {
        setIsLoading(true);
        setCurrentIndex((prev) => (prev + 1) % images.length);
        setIsAutoPlay(false);
        setTimeout(() => setIsLoading(false), 300);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, images.length, onClose]);

  // Prevent body scroll when showcase is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleNext = useCallback(() => {
    setIsLoading(true);
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setIsAutoPlay(false); // Pause auto-play when manually navigating
    setTimeout(() => setIsLoading(false), 300);
  }, [images.length]);

  const handlePrevious = useCallback(() => {
    setIsLoading(true);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setIsAutoPlay(false); // Pause auto-play when manually navigating
    setTimeout(() => setIsLoading(false), 300);
  }, [images.length]);

  const handleImageClick = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlay(false);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlay((prev) => !prev);
  };

  if (!isOpen || images.length === 0) return null;

  const currentItem = images[currentIndex];
  const isVideoItem = isVideo(currentItem);
  const imageUrl = getImageUrl(currentItem);
  const isCloudinaryImage = imageUrl && (
    imageUrl.startsWith('http://') || imageUrl.startsWith('https://')
  );

  return (
    <div className={styles.showcaseOverlay} onClick={onClose}>
      <div
        className={styles.showcaseContainer}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close gallery"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <button
              className={`${styles.navButton} ${styles.navButtonPrev}`}
              onClick={handlePrevious}
              aria-label="Previous image"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <button
              className={`${styles.navButton} ${styles.navButtonNext}`}
              onClick={handleNext}
              aria-label="Next image"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </>
        )}

        {/* Main Content */}
        <div className={styles.contentContainer}>
          {isLoading && <div className={styles.loadingOverlay}>Loading...</div>}
          {isVideoItem ? (
            <div className={styles.videoContainer}>
              <YouTubeEmbed
                url={currentItem.url}
                title={`Gallery video ${currentIndex + 1}`}
              />
            </div>
          ) : (
            <div className={styles.imageContainer}>
              {isCloudinaryImage ? (
                <img
                  src={imageUrl}
                  alt={
                    isGalleryImage(currentItem)
                      ? currentItem.category || `Gallery image ${currentIndex + 1}`
                      : `Gallery image ${currentIndex + 1}`
                  }
                  className={styles.showcaseImage}
                />
              ) : (
                <Image
                  src={imageUrl}
                  alt={
                    isGalleryImage(currentItem)
                      ? currentItem.category || `Gallery image ${currentIndex + 1}`
                      : `Gallery image ${currentIndex + 1}`
                  }
                  fill
                  className={styles.showcaseImage}
                  sizes="90vw"
                  priority
                />
              )}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className={styles.controls}>
          {/* Image Counter */}
          <div className={styles.counter}>
            {currentIndex + 1} / {images.length}
          </div>

          {/* Auto-play Toggle (only show for images, not videos) */}
          {images.length > 1 && !isVideoItem && (
            <button
              className={`${styles.autoPlayButton} ${
                isAutoPlay ? styles.autoPlayActive : ''
              }`}
              onClick={toggleAutoPlay}
              aria-label={isAutoPlay ? 'Pause slideshow' : 'Play slideshow'}
            >
              {isAutoPlay ? (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <rect x="6" y="4" width="4" height="16"></rect>
                  <rect x="14" y="4" width="4" height="16"></rect>
                </svg>
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              )}
            </button>
          )}
        </div>

        {/* Thumbnail Strip */}
        {images.length > 1 && (
          <div className={styles.thumbnailStrip}>
            {images.map((item, index) => {
              const thumbUrl = getImageUrl(item);
              const isThumbVideo = isVideo(item);
              const isThumbCloudinary = thumbUrl && (
                thumbUrl.startsWith('http://') || thumbUrl.startsWith('https://')
              );
              const itemKey = isGalleryImage(item) 
                ? item._id?.toString() || index 
                : index;

              return (
                <div
                  key={itemKey}
                  className={`${styles.thumbnail} ${
                    index === currentIndex ? styles.thumbnailActive : ''
                  }`}
                  onClick={() => handleImageClick(index)}
                >
                  {isThumbVideo ? (
                    <div className={styles.videoThumbnail}>
                      {thumbUrl ? (
                        isThumbCloudinary ? (
                          <img
                            src={thumbUrl}
                            alt={`Video thumbnail ${index + 1}`}
                            className={styles.thumbnailImage}
                          />
                        ) : (
                          <div className={styles.thumbnailImageWrapper}>
                            <Image
                              src={thumbUrl}
                              alt={`Video thumbnail ${index + 1}`}
                              fill
                              className={styles.thumbnailImage}
                              sizes="80px"
                            />
                          </div>
                        )
                      ) : null}
                      <div className={styles.videoBadge}>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                      </div>
                    </div>
                  ) : (
                    <>
                      {isThumbCloudinary ? (
                        <img
                          src={thumbUrl}
                          alt={`Thumbnail ${index + 1}`}
                          className={styles.thumbnailImage}
                        />
                      ) : (
                        <div className={styles.thumbnailImageWrapper}>
                          <Image
                            src={thumbUrl}
                            alt={`Thumbnail ${index + 1}`}
                            fill
                            className={styles.thumbnailImage}
                            sizes="80px"
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

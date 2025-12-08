'use client';

import React, { useState, useEffect } from 'react';
import styles from './StoriesSection.module.scss';
import Image from 'next/image';

interface Story {
  _id: string;
  image: string;
  names: string;
  testimonial: string;
  isActive: boolean;
  order: number;
}

interface StoriesSectionProps {
  stories: Story[];
}

export default function StoriesSection({ stories }: StoriesSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imageKey, setImageKey] = useState(0);
  const [displayedNames, setDisplayedNames] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Filter active stories and sort by order
  const activeStories = stories
    .filter(story => story.isActive)
    .sort((a, b) => a.order - b.order);

  const currentStory = activeStories[currentIndex];

  // Reset to first story if current index is out of bounds
  useEffect(() => {
    if (activeStories.length > 0 && currentIndex >= activeStories.length) {
      setCurrentIndex(0);
    }
  }, [activeStories.length, currentIndex]);

  // Typing animation effect
  useEffect(() => {
    if (!currentStory) return;

    const fullNames = currentStory.names;
    setDisplayedNames('');
    setIsTyping(true);
    
    let currentCharIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentCharIndex < fullNames.length) {
        setDisplayedNames(fullNames.substring(0, currentCharIndex + 1));
        currentCharIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typingInterval);
      }
    }, 100); // Adjust speed here (lower = faster)

    return () => {
      clearInterval(typingInterval);
    };
  }, [currentIndex, currentStory?.names]);

  const handleNext = () => {
    if (isTransitioning || activeStories.length === 0) return;
    setIsTransitioning(true);
    
    // Blur current image and fade text
    setTimeout(() => {
      const nextIndex = (currentIndex + 1) % activeStories.length;
      setCurrentIndex(nextIndex);
      setImageKey(prev => prev + 1);
      
      // Remove blur and fade in new content
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    }, 200);
  };

  const handlePrevious = () => {
    if (isTransitioning || activeStories.length === 0) return;
    setIsTransitioning(true);
    
    // Blur current image and fade text
    setTimeout(() => {
      const prevIndex = (currentIndex - 1 + activeStories.length) % activeStories.length;
      setCurrentIndex(prevIndex);
      setImageKey(prev => prev + 1);
      
      // Remove blur and fade in new content
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    }, 200);
  };

  // Get image source - handle Cloudinary URLs
  const getImageSrc = (story: Story) => {
    if (story.image) {
      // If it's a Cloudinary URL (starts with http/https), use it directly
      if (story.image.startsWith('http://') || story.image.startsWith('https://')) {
        return story.image;
      }
      // If it's a local path, use it as is
      return story.image;
    }
    // Fallback image
    return '/images/stories.jpg.webp';
  };

  // Show empty state if no stories
  if (activeStories.length === 0) {
    return (
      <section className={styles.storiesSection}>
        <h2 className={styles.storiesTitleTop}>Stories</h2>
        <div className={styles.storiesCard}>
          <div className={styles.textContainer}>
            <h2 className={styles.storiesTitle}>Stories</h2>
            <p className={styles.error}>No stories available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  const isCloudinaryImage = currentStory.image && 
    (currentStory.image.startsWith('http://') || currentStory.image.startsWith('https://'));

  return (
    <section className={styles.storiesSection}>
      <h2 className={styles.storiesTitleTop}>Stories</h2>

      <div className={styles.storiesCard}>
        <div className={styles.imageContainer}>
          <div className={`${styles.imageWrapper} ${isTransitioning ? styles.blurring : ''}`}>
            {isCloudinaryImage ? (
              <img
                key={imageKey}
                src={getImageSrc(currentStory)}
                alt={currentStory.names}
                className={styles.storyImage}
                style={{ 
                  objectFit: 'cover', 
                  width: '100%', 
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0
                }}
              />
            ) : (
              <Image
                key={imageKey}
                src={getImageSrc(currentStory)}
                alt={currentStory.names}
                fill
                className={styles.storyImage}
                priority={currentIndex === 0}
                quality={90}
              />
            )}
          </div>
        </div>
        
        <div className={styles.textContainer}>
          <h2 className={styles.storiesTitle}>Stories</h2>
          
          <div className={styles.testimonialWrapper}>
            <div className={`${styles.testimonialContent} ${isTransitioning ? styles.fading : ''}`}>
              <p className={styles.testimonial}>{currentStory.testimonial}</p>
              <p className={styles.names}>
                {displayedNames}
                {isTyping && <span className={styles.cursor}>|</span>}
              </p>
            </div>
          </div>
          
          <div className={styles.navigation}>
            <button 
              className={styles.navButton}
              onClick={handlePrevious}
              aria-label="Previous story"
              disabled={activeStories.length <= 1}
            >
              ←
            </button>
            <span className={styles.navIndicator}>
              {currentIndex + 1}/{activeStories.length}
            </span>
            <button 
              className={styles.navButton}
              onClick={handleNext}
              aria-label="Next story"
              disabled={activeStories.length <= 1}
            >
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import styles from './StoriesSection.module.scss';
import Image from 'next/image';

const stories = [
  {
    id: 1,
    image: '/images/stories.jpg.webp',
    alt: 'Wedding celebration',
    testimonial: 'From the very first moment, every detail was flawlessly managed, We didn\'t worry about a thing; we just laughed, danced, and lived every precious moment. Thank you for giving us a wedding that was not just beautiful, but profoundly meaningful. ',
    names: 'Chris & Elena',
  },
  {
    id: 2,
    image: '/images/stories.jpg.webp',
    alt: 'Wedding celebration',
    testimonial: 'Our wedding day exceeded all expectations. The attention to detail and seamless coordination allowed us to fully immerse ourselves in the joy of the moment. Every guest felt the love and care that went into making our day perfect.',
    names: 'Michael & Sarah',
  },
  {
    id: 3,
    image: '/images/stories.jpg.webp',
    alt: 'Wedding celebration',
    testimonial: 'The team transformed our vision into reality with such grace and professionalism. We were able to relax and enjoy every second, knowing that everything was being handled with the utmost care and attention.',
    names: 'David & Maria',
  },
  {
    id: 4,
    image: '/images/stories.jpg.webp',
    alt: 'Wedding celebration',
    testimonial: 'What we thought would be a stressful day turned into the most magical experience of our lives. The flawless execution and warm, personal touch made our wedding truly unforgettable.',
    names: 'James & Anna',
  },
];

export default function StoriesSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imageKey, setImageKey] = useState(0);
  const [displayedNames, setDisplayedNames] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const currentStory = stories[currentIndex];

  // Typing animation effect
  useEffect(() => {
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
  }, [currentIndex, currentStory.names]);

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    
    // Blur current image and fade text
    setTimeout(() => {
      const nextIndex = (currentIndex + 1) % stories.length;
      setCurrentIndex(nextIndex);
      setImageKey(prev => prev + 1);
      
      // Remove blur and fade in new content
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    }, 200);
  };

  const handlePrevious = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    
    // Blur current image and fade text
    setTimeout(() => {
      const prevIndex = (currentIndex - 1 + stories.length) % stories.length;
      setCurrentIndex(prevIndex);
      setImageKey(prev => prev + 1);
      
      // Remove blur and fade in new content
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    }, 200);
  };

  return (
    <section className={styles.storiesSection}>
      <h2 className={styles.storiesTitleTop}>Stories</h2>

      <div className={styles.storiesCard}>

        <div className={styles.imageContainer}>
          <div className={`${styles.imageWrapper} ${isTransitioning ? styles.blurring : ''}`}>
            <Image
              key={imageKey}
              src={currentStory.image}
              alt={currentStory.alt}
              fill
              className={styles.storyImage}
              priority={currentIndex === 0}
              quality={90}
            />
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
            >
              ←
            </button>
            <span className={styles.navIndicator}>
              {currentIndex + 1}/{stories.length}
            </span>
            <button 
              className={styles.navButton}
              onClick={handleNext}
              aria-label="Next story"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}


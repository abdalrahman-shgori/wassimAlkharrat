'use client';

import React from 'react';
import styles from './EventsGridSkeleton.module.scss';

interface EventsGridSkeletonProps {
  count?: number;
}

export default function EventsGridSkeleton({ count = 3 }: EventsGridSkeletonProps) {
  return (
    <section className={styles.eventsGrid}>
      <div className={styles.gridContainer}>
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className={styles.skeletonCard}>
            <div className={styles.skeletonImage} />
            <div className={styles.skeletonContent}>
              <div className={styles.skeletonTitle} />
              <div className={styles.skeletonSubtitle} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}


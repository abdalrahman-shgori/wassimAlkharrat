'use client';

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import styles from './Pagination.module.scss';
import CustomDropdown from './CustomDropdown';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  hasNext: boolean;
  hasPrev: boolean;
}

export default function Pagination({
  currentPage,
  totalPages,
  total,
  limit,
  onPageChange,
  onLimitChange,
  hasNext,
  hasPrev,
}: PaginationProps) {
  const t = useTranslations('events');
  const locale = useLocale();

  // Don't render if no items
  if (total === 0) return null;

  // Calculate current range
  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, total);

  // Items per page options
  const limitOptions = [
    { value: '5', label: '5' },
    { value: '10', label: '10' },
    { value: '20', label: '20' },
    { value: '50', label: '50' },
  ];

  // Calculate page numbers to show (max 5)
  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show 5 pages around current
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, start + maxVisible - 1);
      
      // Adjust if we're near the end
      if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className={styles.paginationWrapper} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      {/* Items range */}
      <div className={styles.itemsInfo}>
        {startItem}-{endItem < 10 ? `0${endItem}` : endItem} of {total} items
      </div>

      {/* Pagination controls */}
      <div className={styles.paginationControls}>
        {/* First page */}
        <button
          className={styles.navButton}
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          aria-label="First page"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M13 5L8 10L13 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 5L3 10L8 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Previous page */}
        <button
          className={styles.navButton}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrev}
          aria-label={t('previousPage') || 'Previous page'}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12 5L7 10L12 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Page numbers */}
        {pageNumbers.map((page) => (
          <button
            key={page}
            className={`${styles.pageButton} ${page === currentPage ? styles.active : ''}`}
            onClick={() => onPageChange(page)}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        ))}

        {/* Next page */}
        <button
          className={styles.navButton}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNext}
          aria-label={t('nextPage') || 'Next page'}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M8 5L13 10L8 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Last page */}
        <button
          className={styles.navButton}
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          aria-label="Last page"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M7 5L12 10L7 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 5L17 10L12 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Items per page */}
      <div className={styles.itemsPerPage}>
        <CustomDropdown
          options={limitOptions}
          placeholder="10"
          value={limit.toString()}
          onChange={(value) => onLimitChange(Number(value))}
          showReset={false}
          className={styles.limitDropdown}
        />
        <span className={styles.limitLabel}>Items per page</span>
      </div>
    </div>
  );
}


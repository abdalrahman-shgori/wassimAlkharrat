'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import styles from './EventsFilterBar.module.scss';
import CustomDropdown from './CustomDropdown';

interface FilterOption {
  value: string;
  label: string;
}

interface EventsFilterBarProps {
  typeOptions: FilterOption[];
  themeOptions: FilterOption[];
  sizeOptions: FilterOption[];
  onFilterChange: (filters: { type: string; theme: string; size: string; placeSearch: string }) => void;
  totalResults: number;
}

export default function EventsFilterBar({
  typeOptions,
  themeOptions,
  sizeOptions,
  onFilterChange,
  totalResults,
}: EventsFilterBarProps) {
  const t = useTranslations('events');
  const locale = useLocale();
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedTheme, setSelectedTheme] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [placeSearch, setPlaceSearch] = useState<string>('');

  useEffect(() => {
    onFilterChange({
      type: selectedType,
      theme: selectedTheme,
      size: selectedSize,
      placeSearch: placeSearch,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedType, selectedTheme, selectedSize, placeSearch]);

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
  };

  const handleThemeChange = (value: string) => {
    setSelectedTheme(value);
  };

  const handleSizeChange = (value: string) => {
    setSelectedSize(value);
  };

  const handleResetAll = () => {
    setSelectedType('');
    setSelectedTheme('');
    setSelectedSize('');
    setPlaceSearch('');
  };

  const hasAnyFilter = selectedType !== '' || selectedTheme !== '' || selectedSize !== '' || placeSearch !== '';

  return (
    <div className={styles.filterBar} id="events-next-section" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <div className={styles.filterSection}>
        <span className={styles.filterLabel}>{t('filterBy') || 'Filter by:'}</span>
        <div className={styles.filterDropdowns}>
          <CustomDropdown
            options={typeOptions}
            placeholder={t('eventType') || 'Event Type'}
            value={selectedType}
            onChange={handleTypeChange}
            onReset={() => setSelectedType('')}
            className={styles.filterSelect}
          />
          <CustomDropdown
            options={themeOptions}
            placeholder={t('theme') || 'Theme'}
            value={selectedTheme}
            onChange={handleThemeChange}
            onReset={() => setSelectedTheme('')}
            className={styles.filterSelect}
          />
          <CustomDropdown
            options={sizeOptions}
            placeholder={t('size') || 'Size'}
            value={selectedSize}
            onChange={handleSizeChange}
            onReset={() => setSelectedSize('')}
            className={styles.filterSelect}
          />
          <div className={styles.searchInputWrapper}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder={t('searchPlace') || 'Search by place (e.g., Dama Rose)'}
              value={placeSearch}
              onChange={(e) => setPlaceSearch(e.target.value)}
              aria-label="Search by place"
            />
            {placeSearch && (
              <button
                type="button"
                className={styles.clearSearchButton}
                onClick={() => setPlaceSearch('')}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>
      <div className={styles.resultsSection}>
        {hasAnyFilter && (
          <button
            type="button"
            className={styles.resetAllButton}
            onClick={handleResetAll}
            aria-label="Reset all filters"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 0C3.58 0 0 3.58 0 8C0 12.42 3.58 16 8 16C12.42 16 16 12.42 16 8C16 3.58 12.42 0 8 0ZM11 10.5L9.5 12L8 10.5L6.5 12L5 10.5L6.5 9L5 7.5L6.5 6L8 7.5L9.5 6L11 7.5L9.5 9L11 10.5Z" fill="currentColor"/>
            </svg>
            <span>{t('resetAll')}</span>
          </button>
        )}
        <div className={styles.resultsCount}>
          {t('showing') || 'Showing:'} <span className={styles.resultsNumber}>({totalResults}) {t('results') || 'results'}</span>
        </div>
      </div>
    </div>
  );
}


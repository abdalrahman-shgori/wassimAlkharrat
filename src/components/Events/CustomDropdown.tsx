'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './CustomDropdown.module.scss';
import { useTranslations } from 'next-intl';

interface FilterOption {
  value: string;
  label: string;
}

interface CustomDropdownProps {
  options: FilterOption[];
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onReset?: () => void;
  className?: string;
  showReset?: boolean;
}

export default function CustomDropdown({
  options,
  placeholder,
  value,
  onChange,
  onReset,
  className = '',
  showReset = true,
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((opt) => opt.value === value);
  const hasSelection = value !== '';
  const t = useTranslations('events');

  // Detect dropdown direction based on viewport space
  useEffect(() => {
    if (isOpen && dropdownRef.current && menuRef.current) {
      const buttonRect = dropdownRef.current.getBoundingClientRect();
      const menuHeight = menuRef.current.scrollHeight;
      const viewportHeight = window.innerHeight;
      
      const spaceBelow = viewportHeight - buttonRect.bottom;
      const spaceAbove = buttonRect.top;
      
      // Open upward if there's not enough space below but enough space above
      setOpenUpward(spaceBelow < menuHeight && spaceAbove > spaceBelow);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onReset) {
      onReset();
    } else {
      onChange('');
    }
    setIsOpen(false);
  };

  return (
    <div className={`${styles.dropdown} ${className}`} ref={dropdownRef}>
      <button
        type="button"
        className={styles.dropdownButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className={styles.dropdownText}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          className={`${styles.dropdownArrow} ${isOpen ? styles.open : ''}`}
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M6 8L0 0h12L6 8z" fill="currentColor" />
        </svg>
      </button>
      {isOpen && (
        <div 
          ref={menuRef}
          className={`${styles.dropdownMenu} ${openUpward ? styles.openUpward : ''}`}
        >
          <div className={styles.dropdownMenuInner}>
            {showReset && hasSelection && (
              <button
                type="button"
                className={styles.resetButton}
                onClick={handleReset}
                aria-label="Reset filter"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 0C3.13 0 0 3.13 0 7C0 10.87 3.13 14 7 14C10.87 14 14 10.87 14 7C14 3.13 10.87 0 7 0ZM9.8 9.1L8.4 10.5L7 9.1L5.6 10.5L4.2 9.1L5.6 7.7L4.2 6.3L5.6 4.9L7 6.3L8.4 4.9L9.8 6.3L8.4 7.7L9.8 9.1Z" fill="currentColor"/>
                </svg>
                <span> {t('reset')} </span>
              </button>
            )}
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`${styles.dropdownItem} ${value === option.value ? styles.selected : ''}`}
                onClick={() => handleSelect(option.value)}
                role="option"
                aria-selected={value === option.value}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


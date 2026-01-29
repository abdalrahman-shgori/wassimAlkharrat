'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import styles from './GallerySection.module.scss';
import Pagination from '../Events/Pagination';
import GalleryShowcase from './GalleryShowcase';
import { GalleryImage } from '../../../lib/models/Gallery';

interface GallerySectionProps {
  initialCategory?: string;
}

export default function GallerySection({ initialCategory }: GallerySectionProps) {
  const locale = useLocale();
  const t = useTranslations('gallery');
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [categories, setCategories] = useState<Array<{ value: string; label: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [showcaseOpen, setShowcaseOpen] = useState(false);
  const [showcaseIndex, setShowcaseIndex] = useState(0);

  // Fetch categories from API
  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch(`/api/gallery-categories?active=true`, {
        headers: {
          'Accept-Language': locale,
        },
      });

      const data = await response.json();

      if (data.success && data.data) {
        const categoryOptions = [
          { value: 'All', label: t('categories.all') || 'All' },
          ...data.data.map((cat: any) => ({
            value: cat.key,
            label: cat.name,
          })),
        ];
        setCategories(categoryOptions);
      } else {
        // Fallback to default categories if API fails
        setCategories([
          { value: 'All', label: t('categories.all') || 'All' },
        ]);
      }
    } catch (error) {
      console.error('Error fetching gallery categories:', error);
      // Fallback to default categories
      setCategories([
        { value: 'All', label: t('categories.all') || 'All' },
      ]);
    } finally {
      setLoadingCategories(false);
    }
  }, [locale, t]);

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Fetch gallery images from API
  const fetchImages = useCallback(async (page: number, category: string, limit: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        active: 'true',
        page: page.toString(),
        limit: limit.toString(),
      });

      if (category && category !== 'All') {
        params.append('category', category); // This will be the category key
      }

      const response = await fetch(`/api/gallery?${params.toString()}`, {
        headers: {
          'Accept-Language': locale,
        },
      });

      const data = await response.json();

      if (data.success && data.data) {
        setImages(data.data);
        if (data.pagination) {
          setPagination(data.pagination);
        }
      } else {
        setImages([]);
      }
    } catch (error) {
      console.error('Error fetching gallery images:', error);
      setImages([]);
    } finally {
      setLoading(false);
    }
  }, [locale]);

  // Fetch images when component mounts or locale changes
  useEffect(() => {
    setCurrentPage(1);
    fetchImages(1, selectedCategory, itemsPerPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    setLoading(true);
    fetchImages(1, category, itemsPerPage);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchImages(page, selectedCategory, itemsPerPage);
    document.getElementById('gallery-content')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle limit change
  const handleLimitChange = (newLimit: number) => {
    setItemsPerPage(newLimit);
    setCurrentPage(1);
    fetchImages(1, selectedCategory, newLimit);
    document.getElementById('gallery-content')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle image click to open showcase
  const handleImageClick = (index: number) => {
    setShowcaseIndex(index);
    setShowcaseOpen(true);
  };

  // Handle showcase close
  const handleShowcaseClose = () => {
    setShowcaseOpen(false);
  };

  return (
    <section id="gallery-content" className={styles.gallerySection}>
      {/* Category Filter Buttons */}
      {!loadingCategories && categories.length > 0 && (
        <div className={styles.filtersContainer}>
          {categories.map((category) => (
            <button
              key={category.value}
              className={`${styles.filterButton} ${selectedCategory === category.value ? styles.filterButtonActive : ''}`}
              onClick={() => handleCategoryChange(category.value)}
              disabled={loading}
              aria-pressed={selectedCategory === category.value}
            >
              {category.label}
            </button>
          ))}
        </div>
      )}

      {/* Gallery Grid */}
      {loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : images.length === 0 ? (
        <div className={styles.empty}>{t('empty') || 'No images available'}</div>
      ) : (
        <>
          <div className={styles.galleryGrid}>
            {images.map((image, index) => {
              const isCloudinaryImage = image.image && (
                image.image.startsWith('http://') || image.image.startsWith('https://')
              );

              return (
                <div
                  key={image._id?.toString() || index}
                  className={styles.galleryItem}
                  onClick={() => handleImageClick(index)}
                >
                  {isCloudinaryImage ? (
                    <>
                      <img
                        src={image.image}
                        alt={image.category || 'Gallery image'}
                        className={styles.galleryImage}
                        loading="lazy"
                      />
                      <div className={styles.imageOverlay}>
                        <span className={styles.viewIcon}>👁</span>
                      </div>
                    </>
                  ) : (
                    <div className={styles.imageWrapper}>
                      <Image
                        src={image.image}
                        alt={image.category || 'Gallery image'}
                        fill
                        className={styles.galleryImage}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className={styles.imageOverlay}>
                        <span className={styles.viewIcon}>👁</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={pagination.totalPages}
              total={pagination.total}
              limit={itemsPerPage}
              onPageChange={handlePageChange}
              onLimitChange={handleLimitChange}
              hasNext={pagination.hasNext}
              hasPrev={pagination.hasPrev}
            />
          )}
        </>
      )}

      {/* Gallery Showcase */}
      {showcaseOpen && images.length > 0 && (
        <GalleryShowcase
          images={images}
          initialIndex={showcaseIndex}
          isOpen={showcaseOpen}
          onClose={handleShowcaseClose}
        />
      )}
    </section>
  );
}

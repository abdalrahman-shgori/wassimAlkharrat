'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useLocale } from 'next-intl';
import EventsGridSection from '@/components/Events/EventsGridSection';
import EventsGridSkeleton from '@/components/Events/EventsGridSkeleton';
import EventsFilterBar from '@/components/Events/EventsFilterBar';
import Pagination from '@/components/Events/Pagination';
import { fetchEventsApi } from '../../../lib/api/client';

interface Event {
  _id: string;
  image: string;
  eventTitle: string;
  eventSubtitle: string;
  isActive: boolean;
  eventType?: string | null;
  type?: string | null;
  typeEn?: string | null;
  theme?: string | null;
  themeEn?: string | null;
  size?: string | null;
  sizeEn?: string | null;
  place?: string | null;
  placeEn?: string | null;
  placeAr?: string | null;
}

interface FilterOption {
  value: string;
  label: string;
}

interface FilteredEventsSectionProps {
  eventType: string; // The event type to filter by (Wedding, Birthday, etc.)
  eventTypeSlug: string; // The slug for the event type (for URL routing)
  typeOptions: FilterOption[];
  themeOptions: FilterOption[];
  sizeOptions: FilterOption[];
}

export default function FilteredEventsSection({
  eventType,
  eventTypeSlug,
  typeOptions,
  themeOptions,
  sizeOptions,
}: FilteredEventsSectionProps) {
  const locale = useLocale();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    theme: '',
    size: '',
    placeSearch: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });

  // Debounce timer for place search
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  // Fetch events from API
  const fetchEvents = useCallback(async (page: number, currentFilters: typeof filters, limit: number) => {
    setLoading(true);
    try {
      const result = await fetchEventsApi({
        active: true,
        eventType: eventType,
        type: currentFilters.type || undefined,
        theme: currentFilters.theme || undefined,
        size: currentFilters.size || undefined,
        placeSearch: currentFilters.placeSearch || undefined,
        page,
        limit,
      });

      if (result.success && result.data) {
        setEvents(result.data);
        if (result.pagination) {
          setPagination(result.pagination);
        }
      } else {
        setEvents([]);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [eventType, itemsPerPage]);

  // Fetch events when component mounts or locale changes
  useEffect(() => {
    setCurrentPage(1);
    fetchEvents(1, filters, itemsPerPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  // Handle filter change with debouncing for search
  const handleFilterChange = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters);

    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Debounce place search (500ms), fetch immediately for dropdowns
    const hasSearchChanged = newFilters.placeSearch !== filters.placeSearch;
    const hasDropdownChanged = 
      newFilters.type !== filters.type ||
      newFilters.theme !== filters.theme ||
      newFilters.size !== filters.size;

    if (hasDropdownChanged) {
      // Immediate fetch for dropdown changes
      setCurrentPage(1);
      fetchEvents(1, newFilters, itemsPerPage);
    } else if (hasSearchChanged) {
      // Debounced fetch for search input
      const timeout = setTimeout(() => {
        setCurrentPage(1);
        fetchEvents(1, newFilters, itemsPerPage);
      }, 500);
      setSearchTimeout(timeout);
    }
  }, [filters, searchTimeout, fetchEvents, itemsPerPage]);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    fetchEvents(page, filters, itemsPerPage);
    // Scroll to top of events section
    document.getElementById('events-next-section')?.scrollIntoView({ behavior: 'smooth' });
  }, [filters, fetchEvents, itemsPerPage]);

  // Handle items per page change
  const handleLimitChange = useCallback((newLimit: number) => {
    setItemsPerPage(newLimit);
    setCurrentPage(1);
    fetchEvents(1, filters, newLimit);
    // Scroll to top of events section
    document.getElementById('events-next-section')?.scrollIntoView({ behavior: 'smooth' });
  }, [filters, fetchEvents]);

  return (
    <>
      <EventsFilterBar
        typeOptions={typeOptions}
        themeOptions={themeOptions}
        sizeOptions={sizeOptions}
        onFilterChange={handleFilterChange}
        totalResults={pagination.total}
      />
      
      {loading ? (
        <EventsGridSkeleton count={6} />
      ) : (
        <>
          <EventsGridSection events={events} eventTypeSlug={eventTypeSlug} />
          
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
        </>
      )}
    </>
  );
}

'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import EventsGridSection from '@/components/Events/EventsGridSection';
import EventsFilterBar from '@/components/Events/EventsFilterBar';

interface Event {
  _id: string;
  image: string;
  eventTitle: string;
  eventSubtitle: string;
  isActive: boolean;
  eventType?: string | null;
  type?: string | null; // Localized value for display
  typeEn?: string | null; // EN value for filtering
  theme?: string | null; // Localized value for display
  themeEn?: string | null; // EN value for filtering
  size?: string | null; // Localized value for display
  sizeEn?: string | null; // EN value for filtering
}

interface FilterOption {
  value: string;
  label: string;
}

interface FilteredEventsSectionProps {
  events: Event[];
  typeOptions: FilterOption[];
  themeOptions: FilterOption[];
  sizeOptions: FilterOption[];
  defaultEventType?: string;
}

export default function FilteredEventsSection({
  events,
  typeOptions,
  themeOptions,
  sizeOptions,
  defaultEventType,
}: FilteredEventsSectionProps) {
  const [filters, setFilters] = useState({
    type: '',
    theme: '',
    size: '',
  });

  // Filter events based on selected filters
  // Note: filters contain EN values, but events have both localized (type, theme, size) and EN (typeEn, themeEn, sizeEn) values
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      // Filter by type (match by EN value)
      if (filters.type && event.typeEn !== filters.type) {
        return false;
      }

      // Filter by theme (match by EN value)
      if (filters.theme && event.themeEn !== filters.theme) {
        return false;
      }

      // Filter by size (match by EN value)
      if (filters.size && event.sizeEn !== filters.size) {
        return false;
      }

      return true;
    });
  }, [events, filters]);

  const handleFilterChange = useCallback((newFilters: { type: string; theme: string; size: string }) => {
    setFilters(newFilters);
  }, []);

  return (
    <>
      <EventsFilterBar
        typeOptions={typeOptions}
        themeOptions={themeOptions}
        sizeOptions={sizeOptions}
        onFilterChange={handleFilterChange}
        totalResults={filteredEvents.length}
      />
      <EventsGridSection events={filteredEvents} />
    </>
  );
}


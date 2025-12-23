/**
 * Client-side API utilities for client components
 * Used in 'use client' components for dynamic data fetching
 */

import { ApiResponse, FetchOptions } from './types';

/**
 * Base API fetch utility with error handling
 */
async function apiFetch<T = any>(
  endpoint: string, 
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(endpoint, {
      credentials: 'include', // Include cookies for auth
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`[apiFetch] Error fetching ${endpoint}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Build query string from options object
 */
function buildQueryString(options: FetchOptions = {}): string {
  const params = new URLSearchParams();
  
  Object.entries(options).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, String(value));
    }
  });

  const queryString = params.toString();
  return queryString ? `?${queryString}` : '';
}

// ==========================================
// SERVICES API
// ==========================================

/**
 * Fetch services from API
 */
export async function fetchServicesApi(options: FetchOptions = {}) {
  const queryString = buildQueryString(options);
  return apiFetch(`/api/services${queryString}`);
}

/**
 * Fetch single service by ID
 */
export async function fetchServiceByIdApi(id: string) {
  return apiFetch(`/api/services/${id}`);
}

/**
 * Fetch single service by slug
 */
export async function fetchServiceBySlugApi(slug: string) {
  return apiFetch(`/api/services/slug/${slug}`);
}

/**
 * Fetch service filters
 */
export async function fetchServiceFiltersApi(options: FetchOptions = {}) {
  const queryString = buildQueryString(options);
  return apiFetch(`/api/service-filters${queryString}`);
}

// ==========================================
// EVENTS API
// ==========================================

/**
 * Fetch events from API
 */
export async function fetchEventsApi(options: FetchOptions = {}) {
  const queryString = buildQueryString(options);
  return apiFetch(`/api/events${queryString}`);
}

/**
 * Fetch single event by ID
 */
export async function fetchEventByIdApi(id: string) {
  return apiFetch(`/api/events/${id}`);
}

/**
 * Fetch event types (categories)
 */
export async function fetchEventTypesApi(options: FetchOptions = {}) {
  const queryString = buildQueryString(options);
  return apiFetch(`/api/event-types${queryString}`);
}

/**
 * Fetch event types for dropdown options
 */
export async function fetchEventTypeOptionsApi() {
  return apiFetch(`/api/events/types`);
}

// ==========================================
// STORIES API
// ==========================================

/**
 * Fetch stories from API
 */
export async function fetchStoriesApi(options: FetchOptions = {}) {
  const queryString = buildQueryString(options);
  return apiFetch(`/api/stories${queryString}`);
}

/**
 * Fetch single story by ID
 */
export async function fetchStoryByIdApi(id: string) {
  return apiFetch(`/api/stories/${id}`);
}

// ==========================================
// SETTINGS API
// ==========================================

/**
 * Fetch homepage settings
 */
export async function fetchHomepageSettingsApi() {
  return apiFetch('/api/homepage-settings');
}

/**
 * Fetch services page settings
 */
export async function fetchServicesPageSettingsApi() {
  return apiFetch('/api/services-page-settings');
}

/**
 * Fetch events page settings
 */
export async function fetchEventsPageSettingsApi() {
  return apiFetch('/api/events-page-settings');
}

// ==========================================
// BOOKINGS API
// ==========================================

/**
 * Submit a booking
 */
export async function submitBookingApi(bookingData: any) {
  return apiFetch('/api/bookings', {
    method: 'POST',
    body: JSON.stringify(bookingData),
  });
}

/**
 * Fetch bookings (admin only)
 */
export async function fetchBookingsApi(options: FetchOptions = {}) {
  const queryString = buildQueryString(options);
  return apiFetch(`/api/bookings${queryString}`);
}

// ==========================================
// ADMIN API
// ==========================================

/**
 * Create/Update/Delete service
 */
export async function createServiceApi(serviceData: any) {
  return apiFetch('/api/services', {
    method: 'POST',
    body: JSON.stringify(serviceData),
  });
}

export async function updateServiceApi(id: string, serviceData: any) {
  return apiFetch(`/api/services/${id}`, {
    method: 'PUT',
    body: JSON.stringify(serviceData),
  });
}

export async function deleteServiceApi(id: string) {
  return apiFetch(`/api/services/${id}`, {
    method: 'DELETE',
  });
}

/**
 * Create/Update/Delete event
 */
export async function createEventApi(eventData: any) {
  return apiFetch('/api/events', {
    method: 'POST',
    body: JSON.stringify(eventData),
  });
}

export async function updateEventApi(id: string, eventData: any) {
  return apiFetch(`/api/events/${id}`, {
    method: 'PUT',
    body: JSON.stringify(eventData),
  });
}

export async function deleteEventApi(id: string) {
  return apiFetch(`/api/events/${id}`, {
    method: 'DELETE',
  });
}

/**
 * Create/Update/Delete story
 */
export async function createStoryApi(storyData: any) {
  return apiFetch('/api/stories', {
    method: 'POST',
    body: JSON.stringify(storyData),
  });
}

export async function updateStoryApi(id: string, storyData: any) {
  return apiFetch(`/api/stories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(storyData),
  });
}

export async function deleteStoryApi(id: string) {
  return apiFetch(`/api/stories/${id}`, {
    method: 'DELETE',
  });
}

/**
 * Upload file
 */
export async function uploadFileApi(endpoint: string, file: File) {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`[uploadFileApi] Error uploading to ${endpoint}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}


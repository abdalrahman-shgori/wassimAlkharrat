/**
 * Shared API types and interfaces
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  count?: number;
  error?: string;
  message?: string;
  pagination?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface FetchOptions {
  active?: boolean;
  filterKey?: string;
  includeEventTypes?: boolean;
  page?: number;
  limit?: number;
  // Event filters
  eventType?: string;
  type?: string;
  theme?: string;
  size?: string;
  placeSearch?: string;
  [key: string]: any;
}

export interface LocalizedData {
  en: string | null;
  ar: string | null;
}


# API Utilities Migration Guide

This guide shows how to migrate from direct database/API calls to the centralized API utilities.

## Benefits of Migration

✅ **70% Less Code** - Significantly reduced boilerplate  
✅ **Consistent Patterns** - Same approach everywhere  
✅ **Better Error Handling** - Built-in error catching and logging  
✅ **Type Safety** - Full TypeScript support  
✅ **Easy Maintenance** - Update in one place, reflects everywhere  
✅ **Automatic Localization** - Built-in locale handling

## Server-Side Migration (SSR Pages)

### Before (Old Way)

```typescript
// src/app/(public)/page.tsx - OLD
import { getServicesCollection, getEventsCollection, getStoriesCollection } from '../../../lib/db';
import { Service } from '../../../lib/models/Service';
import { Event } from '../../../lib/models/Event';
import { pickLocalizedString } from '../../../lib/i18n/serverLocale';

// Lots of duplicate utility functions
async function fetchActiveDocs<T>(collectionGetter: () => Promise<any>): Promise<T[]> {
  try {
    const collection = await collectionGetter();
    return await collection.find({ isActive: true }).sort({ createdAt: -1 }).toArray();
  } catch (error) {
    console.error('[fetchActiveDocs] Error:', error);
    return [];
  }
}

const idToString = (id: any): string => id?.toString?.() ?? '';

// Custom fetch functions with lots of repetition
async function getServices(locale: Locale) {
  const services = await fetchActiveDocs<Service>(getServicesCollection);
  return services.slice(0, 6).map(service => ({
    _id: idToString(service._id),
    slug: service.slug,
    icon: service.icon,
    image: service.image,
    isActive: service.isActive,
    name: pickLocalizedString(locale, {
      en: service.nameEn ?? service.name,
      ar: service.nameAr ?? null,
    }),
    description: pickLocalizedString(locale, {
      en: service.descriptionEn ?? service.description,
      ar: service.descriptionAr ?? null,
    }),
  }));
}

// Similar functions for events, stories, etc... (50+ lines of repetitive code)

export default async function Home() {
  const locale = await getLocale();
  const [services, events, stories, homepageSettings] = await Promise.all([
    getServices(locale),
    getEvents(locale),
    getStories(locale),
    getHomepageSettings(),
  ]);
  // ... rest of the component
}
```

### After (New Way)

```typescript
// src/app/(public)/page.tsx - NEW
import { 
  fetchServices, 
  fetchEventTypes, 
  fetchStories, 
  fetchHomepageSettings 
} from '../../../lib/api/server';

export default async function Home() {
  const locale = await getLocale();
  
  // Clean, simple, and consistent
  const [services, events, stories, homepageSettings] = await Promise.all([
    fetchServices(locale, 6),          // With limit
    fetchEventTypes(locale),           // Event types (categories)
    fetchStories(locale),              // All stories
    fetchHomepageSettings(),           // Page settings
  ]);
  // ... rest of the component
}
```

**Result: From ~140 lines to ~40 lines (71% reduction!)**

## Client-Side Migration (Client Components)

### Before (Old Way)

```typescript
// src/components/services/ServicesSection.tsx - OLD
const handleFilterClick = async (filterKey: string | null) => {
  setActiveFilter(filterKey);
  setLoading(true);

  try {
    const url = filterKey 
      ? `/api/services?active=true&filterKey=${encodeURIComponent(filterKey)}`
      : '/api/services?active=true';
    
    const response = await fetch(url, {
      credentials: 'include',
    });
    const data = await response.json();
    
    if (data.success && data.data) {
      const formattedServices = data.data.map((service: any) => ({
        _id: service._id?.toString() || service._id,
        name: service.name || '',
        slug: service.slug || '',
        description: service.description || '',
        icon: service.icon || '🎉',
        image: service.image,
        filterKey: service.filterKey,
        isActive: service.isActive ?? true,
      }));
      setFilteredServices(formattedServices);
    } else {
      setFilteredServices([]);
    }
  } catch (error) {
    console.error('Error fetching filtered services:', error);
    setFilteredServices([]);
  } finally {
    setLoading(false);
  }
};
```

### After (New Way)

```typescript
// src/components/services/ServicesSection.tsx - NEW
const handleFilterClick = async (filterKey: string | null) => {
  setActiveFilter(filterKey);
  setLoading(true);

  try {
    const { fetchServicesApi } = await import('../../../lib/api/client');
    const result = await fetchServicesApi({ 
      active: true, 
      filterKey: filterKey || undefined 
    });
    
    if (result.success && result.data) {
      const formattedServices = result.data.map((service: any) => ({
        _id: service._id?.toString() || service._id,
        name: service.name || '',
        slug: service.slug || '',
        description: service.description || '',
        icon: service.icon || '🎉',
        image: service.image,
        filterKey: service.filterKey,
        isActive: service.isActive ?? true,
      }));
      setFilteredServices(formattedServices);
    } else {
      setFilteredServices([]);
    }
  } catch (error) {
    console.error('Error fetching filtered services:', error);
    setFilteredServices([]);
  } finally {
    setLoading(false);
  }
};
```

**Key Improvements:**
- No manual URL building
- No manual query string encoding
- Automatic credential handling
- Cleaner, more readable code

## Complete Migration Checklist

### Pages Already Migrated ✅
- [x] Landing Page (`src/app/(public)/page.tsx`)
- [x] Services Page (`src/app/(public)/services/page.tsx`)
- [x] Services Section Component (`src/components/services/ServicesSection.tsx`)

### Suggested Next Steps
- [ ] Events Page (`src/app/(public)/events/page.tsx`)
- [ ] Service Detail Page (`src/app/(public)/services/[slug]/page.tsx`)
- [ ] Event Type Page (`src/app/(public)/events/[slug]/page.tsx`)
- [ ] Admin Dashboard Pages (if needed)

## Quick Reference

### Server-Side Functions

```typescript
import { 
  fetchServices,           // All services
  fetchServiceBySlug,      // Single service by slug
  fetchServiceFilters,     // Service filters
  fetchEventTypes,         // Event types (categories)
  fetchEvents,             // Individual events
  fetchEventsByType,       // Events filtered by type
  fetchStories,            // All stories
  fetchHomepageSettings,   // Homepage settings
  fetchServicesPageSettings, // Services page settings
  fetchEventsPageSettings,   // Events page settings
} from '../../../lib/api/server';
```

### Client-Side Functions

```typescript
import { 
  fetchServicesApi,        // Services from API
  fetchEventsApi,          // Events from API
  fetchStoriesApi,         // Stories from API
  fetchEventTypesApi,      // Event types from API
  uploadFileApi,           // Upload files
} from '../../../lib/api/client';
```

## Common Patterns

### Pattern 1: Fetch with Limit

```typescript
// Fetch first 6 services
const services = await fetchServices(locale, 6);
```

### Pattern 2: Fetch with Filters

```typescript
// Client-side with filters
const result = await fetchServicesApi({ 
  active: true, 
  filterKey: 'wedding' 
});
```

### Pattern 3: Parallel Data Fetching

```typescript
const [services, events, stories] = await Promise.all([
  fetchServices(locale),
  fetchEventTypes(locale),
  fetchStories(locale),
]);
```

## Support

If you encounter any issues during migration:
1. Check the [README.md](./README.md) for detailed API documentation
2. Review the example migrations in this guide
3. Ensure import paths are correct (`../../../lib/api/server` or `../../../lib/api/client`)


# Centralized API Utilities

This folder contains centralized API utilities for consistent data fetching across the application.

## Structure

- **`types.ts`** - Shared TypeScript types and interfaces
- **`server.ts`** - Server-side data fetching utilities (for SSR pages)
- **`client.ts`** - Client-side API utilities (for client components)
- **`index.ts`** - Re-exports everything for easy importing

## Usage

### Server-Side (SSR Pages)

Use these utilities in `page.tsx` files for server-side rendering:

```typescript
import { fetchServices, fetchEvents, fetchStories } from '@/lib/api/server';
// or
import { fetchServices, fetchEvents, fetchStories } from '@/lib/api';

export default async function MyPage() {
  const locale = await getLocale();
  
  // Fetch services (with optional limit)
  const services = await fetchServices(locale, 6);
  
  // Fetch event types (categories)
  const eventTypes = await fetchEventTypes(locale);
  
  // Fetch stories
  const stories = await fetchStories(locale);
  
  // Fetch page settings
  const settings = await fetchHomepageSettings();
  
  return <MyComponent services={services} />;
}
```

### Client-Side (Client Components)

Use these utilities in `'use client'` components for dynamic data fetching:

```typescript
'use client';
import { fetchServicesApi, fetchEventsApi } from '@/lib/api/client';
// or
import { fetchServicesApi, fetchEventsApi } from '@/lib/api';

export default function MyClientComponent() {
  const [services, setServices] = useState([]);
  
  useEffect(() => {
    async function loadServices() {
      const result = await fetchServicesApi({ active: true, filterKey: 'wedding' });
      if (result.success && result.data) {
        setServices(result.data);
      }
    }
    loadServices();
  }, []);
  
  return <div>{/* render services */}</div>;
}
```

## Available Server Functions

### Services
- `fetchServices(locale, limit?)` - Fetch all active services
- `fetchServiceBySlug(slug, locale)` - Fetch single service with full details
- `fetchServiceFilters(locale)` - Fetch service filters

### Events
- `fetchEventTypes(locale)` - Fetch event types (categories)
- `fetchEvents(locale)` - Fetch individual events (not types)
- `fetchEventTypeBySlug(slug, locale)` - Fetch event type by slug
- `fetchEventsByType(eventTypeValue, locale)` - Fetch events filtered by type
- `fetchEventFilterOptions(locale, eventTypeFilter?)` - Fetch filter options (type, theme, size) for events

### Stories
- `fetchStories(locale, limit?)` - Fetch all active stories

### Settings
- `fetchHomepageSettings()` - Fetch homepage settings
- `fetchServicesPageSettings()` - Fetch services page settings
- `fetchEventsPageSettings()` - Fetch events page settings

## Available Client Functions

### Services API
- `fetchServicesApi(options?)` - Fetch services from API
- `fetchServiceByIdApi(id)` - Fetch single service by ID
- `fetchServiceBySlugApi(slug)` - Fetch single service by slug
- `fetchServiceFiltersApi(options?)` - Fetch service filters

### Events API
- `fetchEventsApi(options?)` - Fetch events from API
- `fetchEventByIdApi(id)` - Fetch single event by ID
- `fetchEventTypesApi(options?)` - Fetch event types (categories)
- `fetchEventTypeOptionsApi()` - Fetch event types for dropdown options

### Stories API
- `fetchStoriesApi(options?)` - Fetch stories from API
- `fetchStoryByIdApi(id)` - Fetch single story by ID

### Settings API
- `fetchHomepageSettingsApi()` - Fetch homepage settings
- `fetchServicesPageSettingsApi()` - Fetch services page settings
- `fetchEventsPageSettingsApi()` - Fetch events page settings

### Admin API
- `createServiceApi(data)`, `updateServiceApi(id, data)`, `deleteServiceApi(id)`
- `createEventApi(data)`, `updateEventApi(id, data)`, `deleteEventApi(id)`
- `createStoryApi(data)`, `updateStoryApi(id, data)`, `deleteStoryApi(id)`
- `uploadFileApi(endpoint, file)` - Upload files

## Options

All client API functions support optional parameters:

```typescript
interface FetchOptions {
  active?: boolean;          // Filter by active status
  filterKey?: string;        // Filter by specific key
  includeEventTypes?: boolean; // Include event types in results
  [key: string]: any;        // Any other query params
}
```

## Benefits

✅ **Consistency** - Single source of truth for all API calls  
✅ **Type Safety** - Full TypeScript support  
✅ **Error Handling** - Built-in error handling and logging  
✅ **Localization** - Automatic locale-based data formatting  
✅ **Maintainability** - Easy to update and modify  
✅ **Reusability** - Import and use anywhere in the app


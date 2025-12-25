/**
 * Server-side data fetching utilities for SSR pages
 * Used in page.tsx files for server-side rendering
 */

import { 
  getServicesCollection, 
  getEventsCollection, 
  getStoriesCollection,
  getServiceFiltersCollection,
  getHomepageSettingsCollection,
  getServicesPageSettingsCollection,
  getEventsPageSettingsCollection
} from '../db';
import { Service } from '../models/Service';
import { Event } from '../models/Event';
import { Story } from '../models/Story';
import { ServiceFilter } from '../models/ServiceFilter';
import { HomepageSettings } from '../models/HomepageSettings';
import { ServicesPageSettings } from '../models/ServicesPageSettings';
import { EventsPageSettings } from '../models/EventsPageSettings';
import { Locale } from '@/lib/i18n/config';
import { pickLocalizedString } from '../i18n/serverLocale';

/**
 * Safe string ID converter for Mongo documents
 */
export const idToString = (id: any): string => id?.toString?.() ?? '';

/**
 * Generic fetch active documents from MongoDB collection
 */
export async function fetchActiveDocs<T>(
  collectionGetter: () => Promise<any>,
  additionalQuery: any = {}
): Promise<T[]> {
  try {
    const collection = await collectionGetter();
    const query = { isActive: true, ...additionalQuery };
    return await collection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();
  } catch (error) {
    console.error('[fetchActiveDocs] Error:', error);
    return [];
  }
}

/**
 * Fetch active event types only (categories)
 */
export async function fetchActiveEventTypes<T>(
  collectionGetter: () => Promise<any>
): Promise<T[]> {
  try {
    const collection = await collectionGetter();
    return await collection
      .find({ isActive: true, isEventType: true })
      .sort({ createdAt: -1 })
      .toArray();
  } catch (error) {
    console.error('[fetchActiveEventTypes] Error:', error);
    return [];
  }
}

/**
 * Fetch active events only (exclude event types)
 */
export async function fetchActiveEventsOnly<T>(
  collectionGetter: () => Promise<any>
): Promise<T[]> {
  try {
    const collection = await collectionGetter();
    return await collection
      .find({ isActive: true, isEventType: { $ne: true } })
      .sort({ createdAt: -1 })
      .toArray();
  } catch (error) {
    console.error('[fetchActiveEventsOnly] Error:', error);
    return [];
  }
}

// ==========================================
// SERVICES
// ==========================================

/**
 * Fetch all active services with localization
 */
export async function fetchServices(locale: Locale, limit?: number) {
  const services = await fetchActiveDocs<Service>(getServicesCollection);
  const servicesToMap = limit ? services.slice(0, limit) : services;

  return servicesToMap.map(service => ({
    _id: idToString(service._id),
    slug: service.slug,
    icon: service.icon,
    image: service.image,
    filterKey: service.filterKey,
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

/**
 * Fetch service by slug with full details
 */
export async function fetchServiceBySlug(slug: string, locale: Locale) {
  try {
    const servicesCollection = await getServicesCollection();
    const service = await servicesCollection.findOne({
      slug,
      isActive: true,
    });

    if (!service) return null;

    return {
      _id: idToString(service._id),
      slug: service.slug,
      icon: service.icon,
      image: service.image,
      filterKey: service.filterKey,
      isActive: service.isActive,

      title: pickLocalizedString(locale, {
        en: service.titleEn ?? service.title,
        ar: service.titleAr ?? null,
      }),

      details: pickLocalizedString(locale, {
        en: service.detailsEn ?? service.details,
        ar: service.detailsAr ?? null,
      }),

      name: pickLocalizedString(locale, {
        en: service.nameEn ?? service.name,
        ar: service.nameAr ?? null,
      }),

      description: pickLocalizedString(locale, {
        en: service.descriptionEn ?? service.description,
        ar: service.descriptionAr ?? null,
      }),

      whatWeDo: service.whatWeDo
        ? service.whatWeDo.map((item: any) => ({
          title: pickLocalizedString(locale, {
            en: item.titleEn ?? item.title,
            ar: item.titleAr ?? null,
          }),
          description: pickLocalizedString(locale, {
            en: item.descriptionEn ?? item.description,
            ar: item.descriptionAr ?? null,
          }),
          image: item.image,
        }))
        : [],
    };
  } catch (error) {
    console.error('[fetchServiceBySlug] Error:', error);
    return null;
  }
}

/**
 * Fetch service filters with localization
 */
export async function fetchServiceFilters(locale: Locale) {
  try {
    const collection = await getServiceFiltersCollection();
    const filters = await collection
      .find({ isActive: true })
      .sort({ order: 1 })
      .toArray();

    return filters.map((filter: ServiceFilter) => ({
      _id: idToString(filter._id),
      nameEn: filter.nameEn,
      nameAr: filter.nameAr,
      name: pickLocalizedString(locale, {
        en: filter.nameEn,
        ar: filter.nameAr ?? null,
      }),
      key: filter.key,
      isActive: filter.isActive,
    }));
  } catch (error) {
    console.error('[fetchServiceFilters] Error:', error);
    return [];
  }
}

// ==========================================
// EVENTS
// ==========================================

/**
 * Fetch all active event types (categories) with localization
 */
export async function fetchEventTypes(locale: Locale) {
  const eventTypes = await fetchActiveEventTypes<Event>(getEventsCollection);

  return eventTypes.map((event: Event) => ({
    _id: idToString(event._id),
    image: event.image,
    isActive: event.isActive,
    eventTitle: pickLocalizedString(locale, {
      en: event.eventTitleEn ?? event.eventTitle,
      ar: event.eventTitleAr ?? null,
    }),
    eventSubtitle: pickLocalizedString(locale, {
      en: event.eventSubtitleEn ?? event.eventSubtitle,
      ar: event.eventSubtitleAr ?? null,
    }),
    // Keep original titles for slug generation and filtering
    eventTitleEn: event.eventTitleEn ?? event.eventTitle,
    eventTitleAr: event.eventTitleAr ?? null,
    eventType: event.eventType,
  }));
}

/**
 * Fetch all active individual events (not event types) with localization
 */
export async function fetchEvents(locale: Locale) {
  const events = await fetchActiveEventsOnly<Event>(getEventsCollection);

  return events.map((event: Event) => ({
    _id: idToString(event._id),
    image: event.image,
    isActive: event.isActive,
    eventTitle: pickLocalizedString(locale, {
      en: event.eventTitleEn ?? event.eventTitle,
      ar: event.eventTitleAr ?? null,
    }),
    eventSubtitle: pickLocalizedString(locale, {
      en: event.eventSubtitleEn ?? event.eventSubtitle,
      ar: event.eventSubtitleAr ?? null,
    }),
    eventTitleEn: event.eventTitleEn ?? event.eventTitle,
    eventTitleAr: event.eventTitleAr ?? null,
    eventType: event.eventType,
    type: pickLocalizedString(locale, {
      en: event.type ?? null,
      ar: event.typeAr ?? null,
    }),
    typeEn: event.type,
    typeAr: event.typeAr,
    theme: pickLocalizedString(locale, {
      en: event.theme ?? null,
      ar: event.themeAr ?? null,
    }),
    themeEn: event.theme,
    themeAr: event.themeAr,
    size: pickLocalizedString(locale, {
      en: event.size ?? null,
      ar: event.sizeAr ?? null,
    }),
    sizeEn: event.size,
    sizeAr: event.sizeAr,
    place: pickLocalizedString(locale, {
      en: event.place ?? null,
      ar: event.placeAr ?? null,
    }),
    placeEn: event.place,
    placeAr: event.placeAr,
    servicesUsed: event.servicesUsed || [],
    eventDate: event.eventDate || null,
  }));
}

/**
 * Utility function to create slug from text
 */
function createSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Fetch event type by slug
 */
export async function fetchEventTypeBySlug(slug: string, locale: Locale) {
  const eventTypes = await fetchEventTypes(locale);

  const eventType = eventTypes.find((et: any) => {
    const eventSlugEn = createSlug(et.eventTitleEn);
    const eventSlugAr = et.eventTitleAr ? createSlug(et.eventTitleAr) : null;
    return eventSlugEn === slug || eventSlugAr === slug;
  });

  return eventType || null;
}

/**
 * Fetch events by type with localization
 */
export async function fetchEventsByType(eventTypeValue: string, locale: Locale) {
  const allEvents = await fetchEvents(locale);
  
  return allEvents.filter((event: any) => {
    if (event.eventType) {
      return event.eventType === eventTypeValue;
    }
    return event.eventTitleEn === eventTypeValue;
  });
}

/**
 * Fetch event by slug (eventName) with localization
 * Excludes event types (only returns individual events)
 */
export async function fetchEventBySlug(eventNameSlug: string, locale: Locale, eventTypeSlug?: string) {
  const allEvents = await fetchEvents(locale);
  
  // Filter by event type slug if provided
  let eventsToSearch = allEvents;
  if (eventTypeSlug) {
    const eventType = await fetchEventTypeBySlug(eventTypeSlug, locale);
    if (eventType) {
      const filterType = eventType.eventType || eventType.eventTitleEn;
      eventsToSearch = eventsToSearch.filter((event: any) => {
        if (event.eventType) {
          return event.eventType === filterType;
        }
        return event.eventTitleEn === filterType;
      });
    }
  }
  
  // Find event by matching slug
  const event = eventsToSearch.find((event: any) => {
    const eventSlugEn = createSlug(event.eventTitleEn || event.eventTitle);
    const eventSlugAr = event.eventTitleAr ? createSlug(event.eventTitleAr) : null;
    return eventSlugEn === eventNameSlug || eventSlugAr === eventNameSlug;
  });

  return event || null;
}

/**
 * Get unique filter options from events (localized)
 * If eventTypeFilter is provided, only returns options for events of that type
 */
export async function fetchEventFilterOptions(locale: Locale, eventTypeFilter?: string) {
  const allEvents = await fetchEvents(locale);
  
  // Filter events by event type if specified
  const eventsToProcess = eventTypeFilter
    ? allEvents.filter((event: any) => {
        if (event.eventType) {
          return event.eventType === eventTypeFilter;
        }
        return event.eventTitleEn === eventTypeFilter;
      })
    : allEvents;
  
  const eventTypesSet = new Set<string>();
  const typesMap = new Map<string, { en: string; ar: string | null }>();
  const themesMap = new Map<string, { en: string; ar: string | null }>();
  const sizesMap = new Map<string, { en: string; ar: string | null }>();
  
  eventsToProcess.forEach((event: any) => {
    if (event.eventType) eventTypesSet.add(event.eventType);
    
    if (event.typeEn) {
      typesMap.set(event.typeEn, { en: event.typeEn, ar: event.typeAr || null });
    }
    
    if (event.themeEn) {
      themesMap.set(event.themeEn, { en: event.themeEn, ar: event.themeAr || null });
    }
    
    if (event.sizeEn) {
      sizesMap.set(event.sizeEn, { en: event.sizeEn, ar: event.sizeAr || null });
    }
  });
  
  const types = Array.from(typesMap.values())
    .sort((a, b) => a.en.localeCompare(b.en))
    .map(item => ({
      value: item.en,
      label: pickLocalizedString(locale, { en: item.en, ar: item.ar }),
    }));
  
  const themes = Array.from(themesMap.values())
    .sort((a, b) => a.en.localeCompare(b.en))
    .map(item => ({
      value: item.en,
      label: pickLocalizedString(locale, { en: item.en, ar: item.ar }),
    }));
  
  const sizes = Array.from(sizesMap.values())
    .sort((a, b) => a.en.localeCompare(b.en))
    .map(item => ({
      value: item.en,
      label: pickLocalizedString(locale, { en: item.en, ar: item.ar }),
    }));
  
  return {
    eventTypes: Array.from(eventTypesSet).sort().map(type => ({ value: type, label: type })),
    types,
    themes,
    sizes,
  };
}

// ==========================================
// STORIES
// ==========================================

/**
 * Fetch all active stories with localization
 */
export async function fetchStories(locale: Locale, limit?: number) {
  const stories = await fetchActiveDocs<Story>(getStoriesCollection);
  const storiesToMap = limit ? stories.slice(0, limit) : stories;

  return storiesToMap.map((story: Story) => ({
    _id: idToString(story._id),
    image: story.image,
    isActive: story.isActive,
    names: pickLocalizedString(locale, {
      en: story.namesEn ?? story.names,
      ar: story.namesAr ?? null,
    }),
    testimonial: pickLocalizedString(locale, {
      en: story.testimonialEn ?? story.testimonial,
      ar: story.testimonialAr ?? null,
    }),
  }));
}

// ==========================================
// PAGE SETTINGS
// ==========================================

/**
 * Fetch homepage settings
 */
export async function fetchHomepageSettings(): Promise<{ heroImage?: string } | null> {
  try {
    const collection = await getHomepageSettingsCollection();
    const settings = await collection.findOne<HomepageSettings>({}, { sort: { updatedAt: -1 } });
    return settings ? { heroImage: settings.heroImage } : null;
  } catch (error) {
    console.error('[fetchHomepageSettings] Error:', error);
    return null;
  }
}

/**
 * Fetch services page settings
 */
export async function fetchServicesPageSettings(): Promise<{ heroImage?: string } | null> {
  try {
    const collection = await getServicesPageSettingsCollection();
    const settings = await collection.findOne<ServicesPageSettings>({}, { sort: { updatedAt: -1 } });
    return settings ? { heroImage: settings.heroImage } : null;
  } catch (error) {
    console.error('[fetchServicesPageSettings] Error:', error);
    return null;
  }
}

/**
 * Fetch events page settings
 */
export async function fetchEventsPageSettings(): Promise<{ heroImage?: string } | null> {
  try {
    const collection = await getEventsPageSettingsCollection();
    const settings = await collection.findOne<EventsPageSettings>({}, { sort: { updatedAt: -1 } });
    return settings ? { heroImage: settings.heroImage } : null;
  } catch (error) {
    console.error('[fetchEventsPageSettings] Error:', error);
    return null;
  }
}


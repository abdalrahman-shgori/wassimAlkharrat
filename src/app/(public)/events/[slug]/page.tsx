import { cookies } from 'next/headers';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import FilteredEventsSection from '@/components/Events/FilteredEventsSection';
import {
  getEventsCollection,
} from '../../../../../lib/db';
import { Event } from '../../../../../lib/models/Event';
import {
  Locale,
  defaultLocale,
  isLocale,
  getMessages,
} from '@/lib/i18n/config';
import { pickLocalizedString } from '../../../../../lib/i18n/serverLocale';
import HeroSection from '@/components/HeroSection/HeroSection';
import CTASection from '@/components/UI/CTASection';

export const revalidate = 3600; // ISR: Revalidate every hour

/**
 * Safe string ID converter for Mongo documents
 */
const idToString = (id: any): string => id?.toString?.() ?? '';

/**
 * Utility function to create slug from event title
 */
const createSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

/**
 * Get locale from cookies
 */
async function getLocale(): Promise<Locale> {
  try {
    const cookieStore = await cookies();
    const localeValue = cookieStore.get('NEXT_LOCALE')?.value;

    if (isLocale(localeValue)) return localeValue;
  } catch {
    /* fallback */
  }
  return defaultLocale;
}

/**
 * Fetch active docs sorted by createdAt
 */
async function fetchActiveDocs<T>(
  collectionGetter: () => Promise<any>
): Promise<T[]> {
  try {
    const collection = await collectionGetter();
    return await collection
      .find({ isActive: true })
      .sort({ createdAt: -1 })
      .toArray();
  } catch (error) {
    console.error('[fetchActiveDocs] Error:', error);
    return [];
  }
}

/**
 * Fetch active event types only (for hero sections)
 */
async function fetchActiveEventTypes<T>(
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
async function fetchActiveEventsOnly<T>(
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


/**
 * Get all event types with original titles for slug matching (for hero section)
 */
async function getAllEventTypesWithOriginals(locale: Locale) {
  const eventTypes = await fetchActiveEventTypes<Event>(getEventsCollection);

  return eventTypes.map((event: Event) => {
    const eventTitleEn = event.eventTitleEn ?? event.eventTitle;
    const eventTitleAr = event.eventTitleAr ?? null;
    
    return {
      _id: idToString(event._id),
      image: event.image,
      isActive: event.isActive,
      eventTitle: pickLocalizedString(locale, {
        en: eventTitleEn,
        ar: eventTitleAr,
      }),
      eventSubtitle: pickLocalizedString(locale, {
        en: event.eventSubtitleEn ?? event.eventSubtitle,
        ar: event.eventSubtitleAr ?? null,
      }),
      eventTitleEn,
      eventTitleAr,
      // For event types, the eventType is the eventTitleEn (they are the type themselves)
      eventType: eventTitleEn,
    };
  });
}

/**
 * Get all events with original titles for slug matching (exclude event types)
 */
async function getAllEventsWithOriginals(locale: Locale) {
  const events = await fetchActiveEventsOnly<Event>(getEventsCollection);

  return events.map((event: Event) => {
    const eventTitleEn = event.eventTitleEn ?? event.eventTitle;
    const eventTitleAr = event.eventTitleAr ?? null;
    
    return {
      _id: idToString(event._id),
      image: event.image,
      isActive: event.isActive,
      eventTitle: pickLocalizedString(locale, {
        en: eventTitleEn,
        ar: eventTitleAr,
      }),
      eventSubtitle: pickLocalizedString(locale, {
        en: event.eventSubtitleEn ?? event.eventSubtitle,
        ar: event.eventSubtitleAr ?? null,
      }),
      // Keep original titles for slug matching and filtering
      eventTitleEn,
      eventTitleAr,
      // Keep eventType, type, theme, and size for filtering
      eventType: event.eventType || null,
      // Keep both EN and AR for filtering (we match by EN, display by locale)
      type: pickLocalizedString(locale, {
        en: event.type || null,
        ar: event.typeAr || null,
      }),
      typeEn: event.type || null, // EN value for filtering
      typeAr: event.typeAr || null, // AR value for localization
      theme: pickLocalizedString(locale, {
        en: event.theme || null,
        ar: event.themeAr || null,
      }),
      themeEn: event.theme || null, // EN value for filtering
      themeAr: event.themeAr || null, // AR value for localization
      size: pickLocalizedString(locale, {
        en: event.size || null,
        ar: event.sizeAr || null,
      }),
      sizeEn: event.size || null, // EN value for filtering
      sizeAr: event.sizeAr || null, // AR value for localization
    };
  });
}

/**
 * Find event type by slug (only from event types, not individual events)
 */
async function getEventTypeBySlug(slug: string, locale: Locale) {
  const eventTypes = await getAllEventTypesWithOriginals(locale);
  
  // Find the first event type that matches the slug
  const eventType = eventTypes.find((eventType: any) => {
    const eventSlugEn = createSlug(eventType.eventTitleEn);
    const eventSlugAr = eventType.eventTitleAr ? createSlug(eventType.eventTitleAr) : null;
    return eventSlugEn === slug || eventSlugAr === slug;
  });

  return eventType || null;
}

/**
 * Filter events by event type
 */
async function getEventsByType(eventTypeValue: string, locale: Locale) {
  const allEvents = await getAllEventsWithOriginals(locale);
  
  // Filter events that match the event type
  // First try to match by eventType field, then fall back to eventTitleEn for backward compatibility
  return allEvents.filter((event: any) => {
    // If event has eventType field set, match by that
    if (event.eventType) {
      return event.eventType === eventTypeValue;
    }
    // Otherwise, match by eventTitleEn (backward compatibility)
    return event.eventTitleEn === eventTypeValue;
  });
}

/**
 * Get unique filter options from events (localized)
 */
async function getFilterOptions(locale: Locale) {
  const allEvents = await getAllEventsWithOriginals(locale);
  
  const eventTypesSet = new Set<string>();
  const typesMap = new Map<string, { en: string; ar: string | null }>();
  const themesMap = new Map<string, { en: string; ar: string | null }>();
  const sizesMap = new Map<string, { en: string; ar: string | null }>();
  
  allEvents.forEach((event: any) => {
    if (event.eventType) eventTypesSet.add(event.eventType);
    
    // Store type with both EN and AR for localization
    if (event.typeEn) {
      typesMap.set(event.typeEn, { en: event.typeEn, ar: event.typeAr || null });
    }
    
    // Store theme with both EN and AR for localization
    if (event.themeEn) {
      themesMap.set(event.themeEn, { en: event.themeEn, ar: event.themeAr || null });
    }
    
    // Store size with both EN and AR for localization
    if (event.sizeEn) {
      sizesMap.set(event.sizeEn, { en: event.sizeEn, ar: event.sizeAr || null });
    }
  });
  
  // Convert to localized options (use EN as value for filtering, localized label for display)
  const types = Array.from(typesMap.values())
    .sort((a, b) => a.en.localeCompare(b.en))
    .map(item => ({
      value: item.en, // Use EN as value for filtering
      label: pickLocalizedString(locale, { en: item.en, ar: item.ar }),
    }));
  
  const themes = Array.from(themesMap.values())
    .sort((a, b) => a.en.localeCompare(b.en))
    .map(item => ({
      value: item.en, // Use EN as value for filtering
      label: pickLocalizedString(locale, { en: item.en, ar: item.ar }),
    }));
  
  const sizes = Array.from(sizesMap.values())
    .sort((a, b) => a.en.localeCompare(b.en))
    .map(item => ({
      value: item.en, // Use EN as value for filtering
      label: pickLocalizedString(locale, { en: item.en, ar: item.ar }),
    }));
  
  return {
    eventTypes: Array.from(eventTypesSet).sort().map(type => ({ value: type, label: type })),
    types,
    themes,
    sizes,
  };
}

interface EventTypePageProps {
  params: Promise<{ slug: string }>;
}

/**
 * SEO Metadata
 */
export async function generateMetadata({ params }: EventTypePageProps): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const eventType = await getEventTypeBySlug(slug, locale);

  if (!eventType) {
    return {
      title: 'Event Type Not Found',
    };
  }

  const title = eventType.eventTitle;
  const description = eventType.eventSubtitle;
  const ogImage = eventType.image?.startsWith('http') 
    ? eventType.image 
    : `https://wassim-alkharrat.vercel.app${eventType.image}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

/**
 * Page Component
 */
export default async function EventTypePage({ params }: EventTypePageProps) {
  const { slug } = await params;
  const locale = await getLocale();
  const messages = getMessages(locale);
  const heroTranslations = (messages as any).eventsPage?.hero;

  // Get the event type
  const eventType = await getEventTypeBySlug(slug, locale);

  if (!eventType) {
    notFound();
  }

  // Get filtered events for this type
  // Use eventType field if available, otherwise use eventTitleEn for backward compatibility
  const filterType = eventType.eventType || eventType.eventTitleEn;
  const filteredEvents = await getEventsByType(filterType, locale);
  
  // Get filter options
  const filterOptions = await getFilterOptions(locale);

  const heroImage = eventType.image || '/images/services/servicesPage.webp';

  return (
    <>
      <HeroSection
        imageSrc={heroImage}
        title={eventType.eventTitle}
        subtitle={eventType.eventSubtitle}
        ctaText={heroTranslations?.ctaText || 'Events'}
        ctaLink="/events"
        sectionTitle="events.title"
        nextSectionId="events-next-section"
      />

      <FilteredEventsSection
        events={filteredEvents}
        typeOptions={filterOptions.types}
        themeOptions={filterOptions.themes}
        sizeOptions={filterOptions.sizes}
      />

      <CTASection />
    </>
  );
}


import { cookies } from 'next/headers';
import { HomePage } from '@/page/homepage';

import {
  getEventsCollection,
  getHomepageSettingsCollection,
  getServicesCollection,
  getStoriesCollection,
} from '../../../lib/db';

import { Service } from '../../../lib/models/Service';
import { Event } from '../../../lib/models/Event';
import { Story } from '../../../lib/models/Story';
import { HomepageSettings } from '../../../lib/models/HomepageSettings';

import { Locale, defaultLocale, isLocale } from '@/lib/i18n/config';
import { pickLocalizedString } from '../../../lib/i18n/serverLocale';

export const revalidate = 3600; // Revalidate every hour (ISR)

// --------------------------------------------------
//  Shared Utilities
// --------------------------------------------------

async function getLocale(): Promise<Locale> {
  try {
    const cookieStore = await cookies();
    const localeValue = cookieStore.get('NEXT_LOCALE')?.value;

    if (isLocale(localeValue)) return localeValue;
  } catch {
    /* fall back */
  }
  return defaultLocale;
}

/**
 * Fetch active docs sorted by createdAt
 */
async function fetchActiveDocs<T>(collectionGetter: () => Promise<any>): Promise<T[]> {
  try {
    const collection = await collectionGetter();
    return await collection.find({ isActive: true }).sort({ createdAt: -1 }).toArray();
  } catch (error) {
    console.error('[fetchActiveDocs] Error:', error);
    return [];
  }
}

/**
 * Safe string ID converter for Mongo documents
 */
const idToString = (id: any): string => id?.toString?.() ?? '';


// --------------------------------------------------
//  Feature Fetch Functions
// --------------------------------------------------

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

async function getEvents(locale: Locale) {
  // Only fetch event types (categories) for the homepage, not individual events
  try {
    const collection = await getEventsCollection();
    const eventTypes = await collection
      .find({ isActive: true, isEventType: true })
      .sort({ createdAt: -1 })
      .toArray();

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
    }));
  } catch (error) {
    console.error('[getEvents] Error:', error);
    return [];
  }
}

async function getStories(locale: Locale) {
  const stories = await fetchActiveDocs<Story>(getStoriesCollection);

  return stories.map(story => ({
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

async function getHomepageSettings(): Promise<{ heroImage?: string } | null> {
  try {
    const collection = await getHomepageSettingsCollection();
    const settings = await collection.findOne<HomepageSettings>({}, { sort: { updatedAt: -1 } });

    return settings ? { heroImage: settings.heroImage } : null;
  } catch (error) {
    console.error('[getHomepageSettings] Error:', error);
    return null;
  }
}


// --------------------------------------------------
//  Server Component (Page)
// --------------------------------------------------

export default async function Home() {
  const locale = await getLocale();

  const [services, events, stories, homepageSettings] = await Promise.all([
    getServices(locale),
    getEvents(locale),
    getStories(locale),
    getHomepageSettings(),
  ]);

  const heroImage = homepageSettings?.heroImage || '/images/homepage/DSC06702.webp';

  return (
    <HomePage
      services={services}
      events={events}
      stories={stories}
      heroImage={heroImage}
    />
  );
}

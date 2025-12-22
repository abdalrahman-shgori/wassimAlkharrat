import { cookies } from 'next/headers';
import type { Metadata } from 'next';
import EventsGridSection from '@/components/Events/EventsGridSection';
import {
  getEventsPageSettingsCollection,
  getEventsCollection,
} from '../../../../lib/db';
import { Event } from '../../../../lib/models/Event';
import { EventsPageSettings } from '../../../../lib/models/EventsPageSettings';
import {
  Locale,
  defaultLocale,
  isLocale,
  getMessages,
} from '@/lib/i18n/config';
import { pickLocalizedString } from '../../../../lib/i18n/serverLocale';
import HeroSection from '@/components/HeroSection/HeroSection';
import CTASection from '@/components/UI/CTASection';

export const revalidate = 3600; // ISR: Revalidate every hour

/**
 * Safe string ID converter for Mongo documents
 */
const idToString = (id: any): string => id?.toString?.() ?? '';

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
 * Get all event types (localized) - for the main events page showing categories
 */
async function getAllEvents(locale: Locale) {
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
  }));
}

/**
 * Get events page settings (hero image)
 */
async function getEventsPageSettings(): Promise<{ heroImage?: string } | null> {
  try {
    const collection = await getEventsPageSettingsCollection();
    const settings = await collection.findOne<EventsPageSettings>({}, { sort: { updatedAt: -1 } });

    return settings ? { heroImage: settings.heroImage } : null;
  } catch (error) {
    console.error('[getEventsPageSettings] Error:', error);
    return null;
  }
}

/**
 * SEO Metadata
 */
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const messages = getMessages(locale);
  const heroTranslations = (messages as any).servicesPage?.hero;

  const title ="Events";

  const description ="Our curated portfolio of celebrations, defined by unique style and seamless execution. Every detail, meticulously designed.";

  const ogImage = `https://wassim-alkharrat.vercel.app/images/services/servicesPage.webp`;

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
export default async function EventsPage() {
  const locale = await getLocale();
  const [events, eventsPageSettings] = await Promise.all([
    getAllEvents(locale),
    getEventsPageSettings(),
  ]);
  const messages = getMessages(locale);
  const heroTranslations = (messages as any).eventsPage?.hero;

  const heroImage = eventsPageSettings?.heroImage || '/images/services/servicesPage.webp';

  return (
    <>
      <HeroSection
        imageSrc={heroImage}
        title={heroTranslations?.title || 'events.momentsWeveMastered'}
        subtitle={heroTranslations?.subtitle || 'events.subtitle'}
        ctaText={heroTranslations?.ctaText || 'Events'}
        ctaLink="/events"
        sectionTitle="events.title"
        nextSectionId="events-next-section"
      />

      <EventsGridSection events={events} />

      <CTASection />
    </>
  );
}

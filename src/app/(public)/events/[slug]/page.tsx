import { cookies } from 'next/headers';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import FilteredEventsSection from '@/components/Events/FilteredEventsSection';
import { Locale, defaultLocale, isLocale, getMessages } from '@/lib/i18n/config';
import { 
  fetchEventTypeBySlug, 
  fetchEventsByType, 
  fetchEventFilterOptions 
} from '../../../../../lib/api/server';
import HeroSection from '@/components/HeroSection/HeroSection';
import CTASection from '@/components/UI/CTASection';

export const revalidate = 3600; // ISR: Revalidate every hour

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

interface EventTypePageProps {
  params: Promise<{ slug: string }>;
}

/**
 * SEO Metadata
 */
export async function generateMetadata({ params }: EventTypePageProps): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  
  // Get the event type using centralized API
  const eventType = await fetchEventTypeBySlug(slug, locale);

  if (!eventType) {
    return {
      title: 'Event Not Found',
      description: 'The requested event type could not be found.',
    };
  }

  const title = `${eventType.eventTitle} | Events`;
  const description = eventType.eventSubtitle || 'Discover our curated portfolio of celebrations.';
  const ogImage = eventType.image || `https://wassim-alkharrat.vercel.app/images/services/servicesPage.webp`;

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

  // Get the event type using centralized API
  const eventType = await fetchEventTypeBySlug(slug, locale);

  if (!eventType) {
    notFound();
  }

  // Get the filter type value
  const filterType = eventType.eventType || eventType.eventTitleEn;
  
  // Fetch filter options for this specific event type
  const filterOptions = await fetchEventFilterOptions(locale, filterType);

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
        eventType={filterType}
        typeOptions={filterOptions.types}
        themeOptions={filterOptions.themes}
        sizeOptions={filterOptions.sizes}
      />

      <CTASection />
    </>
  );
}

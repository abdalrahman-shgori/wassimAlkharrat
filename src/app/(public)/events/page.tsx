import { cookies } from 'next/headers';
import type { Metadata } from 'next';
import EventsGridSection from '@/components/Events/EventsGridSection';
import { Locale, defaultLocale, isLocale, getMessages } from '@/lib/i18n/config';
import { fetchEventTypes, fetchEventsPageSettings } from '../../../../lib/api/server';
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
  
  // Fetch all data in parallel using centralized API utilities
  const [events, eventsPageSettings] = await Promise.all([
    fetchEventTypes(locale),        // Fetch event types (categories)
    fetchEventsPageSettings(),      // Fetch events page settings
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

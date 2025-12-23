import { cookies } from 'next/headers';
import { HomePage } from '@/page/homepage';
import { Locale, defaultLocale, isLocale } from '@/lib/i18n/config';
import { 
  fetchServices, 
  fetchEventTypes, 
  fetchStories, 
  fetchHomepageSettings 
} from '../../../lib/api/server';

export const revalidate = 3600; // Revalidate every hour (ISR)

/**
 * Get locale from cookies
 */
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
 * Homepage - Server Component
 */
export default async function Home() {
  const locale = await getLocale();

  // Fetch all data in parallel using centralized API utilities
  const [services, events, stories, homepageSettings] = await Promise.all([
    fetchServices(locale, 6),          // Limit to 6 services for homepage
    fetchEventTypes(locale),           // Fetch event types (categories) for homepage
    fetchStories(locale),              // Fetch all stories
    fetchHomepageSettings(),           // Fetch homepage settings
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

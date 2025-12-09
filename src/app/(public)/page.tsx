import { cookies } from 'next/headers';
import { HomePage } from '@/pages/homepage';
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

export const revalidate = 3600; // Revalidate every hour for ISR

async function getServices() {
  try {
    const locale = await getLocale();
    const servicesCollection = await getServicesCollection();
    const services = await servicesCollection
      .find({ isActive: true })
      .sort({ order: 1 })
      .limit(6)
      .toArray();
    
    return services.map((service: Service) => ({
      _id: service._id?.toString() || '',
      name: pickLocalizedString(locale, {
        en: service.nameEn ?? service.name,
        ar: service.nameAr ?? null,
      }),
      slug: service.slug,
      description: pickLocalizedString(locale, {
        en: service.descriptionEn ?? service.description,
        ar: service.descriptionAr ?? null,
      }),
      icon: service.icon,
      image: service.image,
      isActive: service.isActive,
      order: service.order,
    }));
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}

async function getEvents() {
  try {
    const locale = await getLocale();
    const eventsCollection = await getEventsCollection();
    const events = await eventsCollection
      .find({ isActive: true })
      .sort({ order: 1 })
      .toArray();
    
    return events.map((event: Event) => ({
      _id: event._id?.toString() || '',
      image: event.image,
      eventTitle: pickLocalizedString(locale, {
        en: event.eventTitleEn ?? event.eventTitle,
        ar: event.eventTitleAr ?? null,
      }),
      eventSubtitle: pickLocalizedString(locale, {
        en: event.eventSubtitleEn ?? event.eventSubtitle,
        ar: event.eventSubtitleAr ?? null,
      }),
      isActive: event.isActive,
      order: event.order,
    }));
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

async function getStories() {
  try {
    const locale = await getLocale();
    const storiesCollection = await getStoriesCollection();
    const stories = await storiesCollection
      .find({ isActive: true })
      .sort({ order: 1 })
      .toArray();
    
    return stories.map((story: Story) => ({
      _id: story._id?.toString() || '',
      image: story.image,
      names: pickLocalizedString(locale, {
        en: story.namesEn ?? story.names,
        ar: story.namesAr ?? null,
      }),
      testimonial: pickLocalizedString(locale, {
        en: story.testimonialEn ?? story.testimonial,
        ar: story.testimonialAr ?? null,
      }),
      isActive: story.isActive,
      order: story.order,
    }));
  } catch (error) {
    console.error('Error fetching stories:', error);
    return [];
  }
}

async function getHomepageSettings(): Promise<{ heroImage?: string } | null> {
  try {
    const homepageSettingsCollection = await getHomepageSettingsCollection();
    const settings = await homepageSettingsCollection.findOne<HomepageSettings>({}, { sort: { updatedAt: -1 } });

    if (!settings) return null;

    return {
      heroImage: settings.heroImage,
    };
  } catch (error) {
    console.error('Error fetching homepage settings:', error);
    return null;
  }
}

export default async function Home() {
  const [services, events, stories, homepageSettings] = await Promise.all([
    getServices(),
    getEvents(),
    getStories(),
    getHomepageSettings(),
  ]);

  const heroImage = homepageSettings?.heroImage || '/images/homepage/DSC06702.webp';

  // Ensure all values are arrays (fallback to empty arrays if undefined)
  return <HomePage 
    services={services || []} 
    events={events || []} 
    stories={stories || []}
    heroImage={heroImage}
  />;
}

async function getLocale(): Promise<Locale> {
  try {
    const cookieStore = await cookies();
    const cookieValue = cookieStore.get('NEXT_LOCALE')?.value;
    if (isLocale(cookieValue)) {
      return cookieValue;
    }
  } catch {
    // ignore and fall back
  }
  return defaultLocale;
}


import { cookies } from 'next/headers';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Locale, defaultLocale, isLocale } from '@/lib/i18n/config';
import { fetchEventBySlug, fetchEventTypeBySlug } from '../../../../../../lib/api/server';
import { pickLocalizedString } from '../../../../../../lib/i18n/serverLocale';
import Image from 'next/image';
import Link from 'next/link';
import CTASection from '@/components/UI/CTASection';
import HeroSection from '@/components/HeroSection/HeroSection';
import WelcomeToSection from '@/components/welcomeTo/welcomeToSection';
import EventGallerySection from '@/components/Events/EventGallerySection';
import EventHostOpinionSection from '@/components/Events/EventHostOpinionSection';

export const revalidate = 3600; // ISR: Revalidate every hour

/**
 * Get locale from cookies safely
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

interface EventDetailPageProps {
  params: Promise<{ slug: string; eventName: string }>;
}

/**
 * Dynamic SEO Metadata
 */
export async function generateMetadata({ params }: EventDetailPageProps): Promise<Metadata> {
  const { slug, eventName } = await params;
  const locale = await getLocale();
  
  const event = await fetchEventBySlug(eventName, locale, slug);

  if (!event) {
    return {
      title: 'Event Not Found',
      description: 'The requested event could not be found.',
    };
  }

  const title = `${event.eventTitle} | Events`;
  const description = event.eventSubtitle || 'Discover our curated portfolio of celebrations.';
  
  const ogImage = event.image && 
    (event.image.startsWith('http://') || event.image.startsWith('https://'))
    ? event.image
    : `${process.env.NEXT_PUBLIC_SITE_URL || 'https://wassim-alkharrat.vercel.app'}${event.image || '/images/services/servicesPage.webp'}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
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
export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { slug, eventName } = await params;
  const locale = await getLocale();
  
  // Fetch event by slug
  const event = await fetchEventBySlug(eventName, locale, slug);
  const eventType = await fetchEventTypeBySlug(slug, locale);

  if (!event) {
    notFound();
  }

  const imageSrc = event.image && 
    (event.image.startsWith('http://') || event.image.startsWith('https://'))
    ? event.image
    : event.image || '/images/services/servicesPage.webp';

  const isCloudinaryImage = imageSrc.startsWith('http://') || imageSrc.startsWith('https://');

  // Get service names from custom services (localized)
  const serviceNames: string[] = [];
  if (event.servicesUsed && event.servicesUsed.length > 0) {
    serviceNames.push(...event.servicesUsed.map((service: { nameEn: string; nameAr: string }) => 
      pickLocalizedString(locale, {
        en: service.nameEn || service.nameAr,
        ar: service.nameAr || service.nameEn,
      })
    ));
  }

  // Get location (prefer localized, fallback to English)
  const location = event.place || event.placeAr || '';
  
  // Get event type display name (prefer eventType title, fallback to type field)
  const eventTypeDisplay = event.type || eventType?.eventTitle || event.eventType || '';
  // Get event type for section title (the category like "Wedding", "Birthday", etc.) - use localized eventType title
  const sectionTitleText = eventType?.eventTitle || event.eventType || '';

  const hostOpinion = pickLocalizedString(locale, {
    en: (event as any).hostOpinionEn ?? null,
    ar: (event as any).hostOpinionAr ?? null,
  });

  const hostName = pickLocalizedString(locale, {
    en: (event as any).hostNameEn ?? null,
    ar: (event as any).hostNameAr ?? null,
  });

  const hostRole = pickLocalizedString(locale, {
    en: (event as any).hostRoleEn ?? null,
    ar: (event as any).hostRoleAr ?? null,
  });

  // Use testimonial image if available, otherwise fallback to event image
  const testimonialImage = (event as any).hostOpinionImage || imageSrc;

  return (
    <>
      <HeroSection
        imageSrc={imageSrc}
        title={event.eventTitle}
        subtitle={event.eventSubtitle || ''}
        ctaText=""
        ctaLink=""
        sectionTitle={sectionTitleText}
        nextSectionId="event-detail-content"
      />

      <WelcomeToSection
        id='event-detail-content'
        title={event.eventTitle}
        description={event.eventSubtitle || ''}
        services={serviceNames}
        location={location}
        date={event.eventDate as string | undefined}
        eventType={eventTypeDisplay}
      />

      {event.gallery && event.gallery.length > 0 && (
        <EventGallerySection images={event.gallery} />
      )}

      <EventHostOpinionSection
        title={locale === 'ar' ? 'رأي ' : 'Testimonial'}
        quote={hostOpinion || ''}
        hostName={hostName || ''}
        hostRole={hostRole || ''}
        image={testimonialImage}
      />

      <CTASection />
    </>
  );
}


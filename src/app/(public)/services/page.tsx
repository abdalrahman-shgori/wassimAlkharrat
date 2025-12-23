import { cookies } from 'next/headers';
import type { Metadata } from 'next';
import ServicesSection from '@/components/services/ServicesSection';
import { Locale, defaultLocale, isLocale, getMessages } from '@/lib/i18n/config';
import { 
  fetchServices, 
  fetchServiceFilters, 
  fetchServicesPageSettings 
} from '../../../../lib/api/server';
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

  const title ="Services";

  const description ="We transform your vision into exquisite experiences, curated with artistry and intention";

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
export default async function ServicesPage() {
  const locale = await getLocale();
  
  // Fetch all data in parallel using centralized API utilities
  const [services, filters, servicesPageSettings] = await Promise.all([
    fetchServices(locale),              // Fetch all services
    fetchServiceFilters(locale),        // Fetch service filters
    fetchServicesPageSettings(),        // Fetch services page settings
  ]);
  
  const messages = getMessages(locale);
  const heroTranslations = (messages as any).servicesPage?.hero;

  const heroImage = servicesPageSettings?.heroImage || '/images/services/servicesPage.webp';

  return (
    <>
      <HeroSection
        imageSrc={heroImage}
        title={heroTranslations?.title || 'services.EventsThat'}
        subtitle={heroTranslations?.subtitle || 'services.WeTransform'}
        ctaText={heroTranslations?.ctaText || 'Services'}
        ctaLink="/services"
        sectionTitle="services.title"
        nextSectionId="services-next-section"
      />

      <ServicesSection services={services} filters={filters} />

      <CTASection />
    </>
  );
}

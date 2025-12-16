import { cookies } from 'next/headers';
import type { Metadata } from 'next';
import ServicesSection from '@/components/services/ServicesSection';
import {
  getServicesCollection,
  getServiceFiltersCollection,
} from '../../../../lib/db';
import { Service } from '../../../../lib/models/Service';
import { ServiceFilter } from '../../../../lib/models/ServiceFilter';
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
 * Get all services (localized)
 */
async function getAllServices(locale: Locale) {
  const services = await fetchActiveDocs<Service>(getServicesCollection);

  return services.map(service => ({
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
 * Get all service filters (localized)
 */
async function getAllFilters(locale: Locale) {
  try {
    const filtersCollection = await getServiceFiltersCollection();
    const filters = await filtersCollection
      .find({ isActive: { $ne: false } })
      .sort({ createdAt: -1 })
      .toArray();

    return filters.map(filter => ({
      _id: idToString(filter._id),
      key: filter.key,
      name: pickLocalizedString(locale, {
        en: filter.nameEn,
        ar: filter.nameAr,
      }),
      nameEn: filter.nameEn,
      nameAr: filter.nameAr,
    }));
  } catch (error) {
    console.error('[getAllFilters] Error:', error);
    return [];
  }
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
  const services = await getAllServices(locale);
  const filters = await getAllFilters(locale);
  const messages = getMessages(locale);
  const heroTranslations = (messages as any).servicesPage?.hero;

  return (
    <>
      <HeroSection
        imageSrc="/images/services/servicesPage.webp"
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

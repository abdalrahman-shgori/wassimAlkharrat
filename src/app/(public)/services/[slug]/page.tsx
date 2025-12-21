import { cookies } from 'next/headers';
import type { Metadata } from 'next';
import { getServicesCollection } from '../../../../../lib/db';
import { Locale, defaultLocale, isLocale } from '@/lib/i18n/config';
import { pickLocalizedString } from '../../../../../lib/i18n/serverLocale';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import styles from './serviceDetail.module.scss';
import CTASection from '@/components/UI/CTASection';
import HeroSection from '@/components/HeroSection/HeroSection';
import WelcomeToSection from '@/components/welcomeTo/welcomeToSection';
import WhatWeDoSection from '@/components/services/WhatWeDoSection';

export const revalidate = 3600; // ISR: Revalidate every hour

/**
 * Safe string ID converter for Mongo documents
 */
const idToString = (id: any): string => id?.toString?.() ?? '';

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

/**
 * Fetch service by slug and localize fields
 */
async function getServiceBySlug(slug: string, locale: Locale) {
  try {
    const servicesCollection = await getServicesCollection();
    const service = await servicesCollection.findOne({
      slug,
      isActive: true,
    });

    if (!service) return null;

    return {
      _id: idToString(service._id),
      slug: service.slug,
      icon: service.icon,
      image: service.image,
      filterKey: service.filterKey,
      isActive: service.isActive,

      title: pickLocalizedString(locale, {
        en: service.titleEn ?? service.title,
        ar: service.titleAr ?? null,
      }),

      details: pickLocalizedString(locale, {
        en: service.detailsEn ?? service.details,
        ar: service.detailsAr ?? null,
      }),

      name: pickLocalizedString(locale, {
        en: service.nameEn ?? service.name,
        ar: service.nameAr ?? null,
      }),

      description: pickLocalizedString(locale, {
        en: service.descriptionEn ?? service.description,
        ar: service.descriptionAr ?? null,
      }),

      whatWeDo: service.whatWeDo
        ? service.whatWeDo.map((item: any) => ({
          title: pickLocalizedString(locale, {
            en: item.titleEn ?? item.title,
            ar: item.titleAr ?? null,
          }),
          description: pickLocalizedString(locale, {
            en: item.descriptionEn ?? item.description,
            ar: item.descriptionAr ?? null,
          }),
          image: item.image,
        }))
        : [],
    };
  } catch (error) {
    console.error('[getServiceBySlug] Error:', error);
    return null;
  }
}

interface ServiceDetailPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Dynamic SEO Metadata
 */
export async function generateMetadata(
  { params }: ServiceDetailPageProps
): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const service = await getServiceBySlug(slug, locale);

  if (!service) {
    return {
      title: 'Service Not Found',
      description: '',
    };
  }

  const title = service.name;
  const description =
    service.description ||
    service.details ||
    'Discover our professional services';

  const ogImage =
    service.image &&
      (service.image.startsWith('http://') ||
        service.image.startsWith('https://'))
      ? service.image
      : `${process.env.NEXT_PUBLIC_SITE_URL}/images/services/servicesPage.webp`;

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
export default async function ServiceDetailPage({
  params,
}: ServiceDetailPageProps) {
  const { slug } = await params;
  const locale = await getLocale();
  const service = await getServiceBySlug(slug, locale);

  if (!service) {
    notFound();
  }

  const imageSrc =
    service.image &&
      (service.image.startsWith('http://') ||
        service.image.startsWith('https://'))
      ? service.image
      : service.image || '/images/services/servicesPage.webp';

  return (
    <>
      <HeroSection
        imageSrc={imageSrc}
        title={service.name}
        subtitle={service.description}
        ctaText=""
        ctaLink=""
        sectionTitle="services.title"
        nextSectionId="service-detail-content"
      />

      <section
        id="service-detail-content"
        className={styles.serviceDetailSection}
      >
        <WelcomeToSection
          title={service.title || service.name}
          description={service.details || service.description}
        />

        {service.whatWeDo.length > 0 && (
          <WhatWeDoSection items={service.whatWeDo} />
        )}
      </section>

      <CTASection />
    </>
  );
}

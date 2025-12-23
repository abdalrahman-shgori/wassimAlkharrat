import { cookies } from 'next/headers';
import type { Metadata } from 'next';
import { Locale, defaultLocale, isLocale } from '@/lib/i18n/config';
import { fetchServiceBySlug } from '../../../../../lib/api/server';
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
  const service = await fetchServiceBySlug(slug, locale);

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
  
  // Use centralized API utility
  const service = await fetchServiceBySlug(slug, locale);

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

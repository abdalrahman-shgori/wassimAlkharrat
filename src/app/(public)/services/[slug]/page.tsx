import { cookies } from 'next/headers';
import { getServicesCollection } from '../../../../../lib/db';
import { Service } from '../../../../../lib/models/Service';
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

export const revalidate = 3600; // Revalidate every hour (ISR)

/**
 * Safe string ID converter for Mongo documents
 */
const idToString = (id: any): string => id?.toString?.() ?? '';

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

async function getServiceBySlug(slug: string, locale: Locale) {
  try {
    const servicesCollection = await getServicesCollection();
    const service = await servicesCollection.findOne({
      slug,
      isActive: true
    });

    if (!service) {
      return null;
    }

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
      nameEn: service.nameEn ?? service.name,
      nameAr: service.nameAr,
      descriptionEn: service.descriptionEn ?? service.description,
      descriptionAr: service.descriptionAr,
      whatWeDo: service.whatWeDo ? service.whatWeDo.map((item: any) => ({
        title: pickLocalizedString(locale, {
          en: item.titleEn ?? item.title,
          ar: item.titleAr ?? null,
        }),
        description: pickLocalizedString(locale, {
          en: item.descriptionEn ?? item.description,
          ar: item.descriptionAr ?? null,
        }),
        image: item.image,
      })) : [],
    };
  } catch (error) {
    console.error('[getServiceBySlug] Error:', error);
    return null;
  }
}

interface ServiceDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { slug } = await params;
  const locale = await getLocale();
  const service = await getServiceBySlug(slug, locale);

  if (!service) {
    notFound();
  }

  // Get image source - use Cloudinary image if available, otherwise fallback
  const getImageSrc = () => {
    if (service.image) {
      // If it's a Cloudinary URL (starts with http/https), use it directly
      if (service.image.startsWith('http://') || service.image.startsWith('https://')) {
        return service.image;
      }
      // If it's a local path, use it as is
      return service.image;
    }
    return '/images/services/servicesPage.webp'; // Default fallback
  };

  const imageSrc = getImageSrc();
  const isCloudinaryImage = service.image && (service.image.startsWith('http://') || service.image.startsWith('https://'));
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
      <section id="service-detail-content" className={styles.serviceDetailSection}>
        <WelcomeToSection
          title={service.title || service.name}
          description={service.details || service.description}
        />
        {service.whatWeDo && service.whatWeDo.length > 0 && (
          <WhatWeDoSection items={service.whatWeDo} />
        )}
      </section>
      <CTASection />
    </>
  );
}


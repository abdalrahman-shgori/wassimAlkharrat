import { cookies } from 'next/headers';
import type { Metadata } from 'next';
import { Locale, defaultLocale, isLocale, getMessages } from '@/lib/i18n/config';
import HeroSection from '@/components/HeroSection/HeroSection';
import CTASection from '@/components/UI/CTASection';
import GallerySection from '@/components/Gallery/GallerySection';

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
  const galleryTranslations = (messages as any).gallery;

  const title = galleryTranslations?.hero?.title || 'Gallery';
  const description = galleryTranslations?.hero?.subtitle || 'A glimpse into our world—carefully chosen images that reflect our style, vision, and dedication to quality.';

  const ogImage = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://wassim-alkharrat.vercel.app'}/images/galerry/galerry.webp`;

  return {
    title,
    description,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://wassim-alkharrat.vercel.app'}/gallery`,
      languages: {
        'en': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://wassim-alkharrat.vercel.app'}/gallery`,
        'ar': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://wassim-alkharrat.vercel.app'}/gallery`,
      },
    },
    openGraph: {
      title,
      description,
      type: 'website',
      locale,
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://wassim-alkharrat.vercel.app'}/gallery`,
      siteName: 'Wassim Alkharrat Events',
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
export default async function GalleryPage() {
  const locale = await getLocale();
  const messages = getMessages(locale);
  const galleryTranslations = (messages as any).gallery;
  const t = (key: string) => {
    const keys = key.split('.');
    let value: any = galleryTranslations;
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  const heroImage = '/images/galerry/gallery.webp';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://wassim-alkharrat.vercel.app';

  // Structured Data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: t('hero.title'),
    description: t('hero.subtitle'),
    url: `${siteUrl}/gallery`,
    mainEntity: {
      '@type': 'ImageGallery',
      name: t('hero.title'),
      description: t('hero.subtitle'),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <HeroSection
        imageSrc={heroImage}
        title={t('hero.title')}
        subtitle={t('hero.subtitle')}
        ctaText=""
        ctaLink=""
        nextSectionId="gallery-content"
      />

      <GallerySection />

      <CTASection />
    </>
  );
}

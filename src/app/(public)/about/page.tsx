import { cookies } from 'next/headers';
import type { Metadata } from 'next';
import { Locale, defaultLocale, isLocale, getMessages } from '@/lib/i18n/config';
import { fetchStories } from '../../../../lib/api/server';
import HeroSection from '@/components/HeroSection/HeroSection';
import WelcomeToSection from '@/components/welcomeTo/welcomeToSection';
import MissionSection from '@/components/about/MissionSection';
import WhyChooseUsSection from '@/components/about/WhyChooseUsSection';
import StoriesSection from '@/components/Stories/StoriesSection';
import CTASection from '@/components/UI/CTASection';
import styles from './about.module.scss';

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
  const aboutTranslations = (messages as any).about;

  const title = aboutTranslations?.hero?.title || 'About Us';
  const description = aboutTranslations?.hero?.subtitle || 
    'Crafting extraordinary experiences with passion, precision, and creativity';

  const ogImage = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://wassim-alkharrat.vercel.app'}/images/aboutUs/aboutUsHero.webp`;

  return {
    title,
    description,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://wassim-alkharrat.vercel.app'}/about`,
      languages: {
        'en': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://wassim-alkharrat.vercel.app'}/about`,
        'ar': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://wassim-alkharrat.vercel.app'}/about`,
      },
    },
    openGraph: {
      title,
      description,
      type: 'website',
      locale,
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://wassim-alkharrat.vercel.app'}/about`,
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
export default async function AboutPage() {
  const locale = await getLocale();
  const messages = getMessages(locale);
  const aboutTranslations = (messages as any).about;
  const t = (key: string) => {
    const keys = key.split('.');
    let value: any = aboutTranslations;
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  // Fetch stories for the about page
  const stories = await fetchStories(locale);

  const heroImage = '/images/aboutUs/aboutUsHero.webp';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://wassim-alkharrat.vercel.app';

  // Structured Data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: t('hero.title'),
    description: t('hero.subtitle'),
    mainEntity: {
      '@type': 'Organization',
      name: 'Wassim Alkharrat Events',
      description: t('hero.subtitle'),
      url: siteUrl,
      logo: `${siteUrl}/logo.png`,
      founder: {
        '@type': 'Person',
        name: 'Wassim Alkharrat',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '5',
        reviewCount: '100+',
      },
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
        sectionTitle="about.title"
        nextSectionId="about-content"
      />

      <main id="about-content" className={styles.aboutSection}>
        <WelcomeToSection
          title={t('welcome.title')}
          description={t('welcome.description')}
          author={t('welcome.author')}
        />
      </main>

      <MissionSection />
<div className={styles.sectionsWrapper}>
      <WhyChooseUsSection />

      <StoriesSection stories={stories} />

      <CTASection />
      </div>
    </>
  );
}


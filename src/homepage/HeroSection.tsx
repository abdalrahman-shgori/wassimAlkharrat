'use client';

import HeroSection from '@/components/HeroSection/HeroSection';
import { useTranslations } from 'next-intl';

interface HomepageHeroProps {
  imageSrc: string;
  onScrollDown?: () => void;
}

export default function HomepageHero({ imageSrc, onScrollDown }: HomepageHeroProps) {
  const t = useTranslations('hero');

  return (
    <>
      <HeroSection
        imageSrc={imageSrc || "/images/homepage/DSC06702.webp"}
        imageAlt={t('imageAlt')}
        title={t('title')}
        subtitle={t('subtitle')}
        ctaText={t('cta')}
        ctaLink="/services"
        showScrollIndicator={true}
        nextSectionId="homepage-next-section"
        onScrollIndicatorClick={onScrollDown}
      />
    </>
  );
}


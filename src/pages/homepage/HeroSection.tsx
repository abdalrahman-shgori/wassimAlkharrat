import HeroSection from '@/components/HeroSection/HeroSection';

interface HomepageHeroProps {
  imageSrc: string;
}

export default function HomepageHero({ imageSrc }: HomepageHeroProps) {
  return (
    <>
      <HeroSection
        imageSrc={imageSrc || "/images/homepage/DSC06702.webp"}
        imageAlt="Elegant event setup"
        title="Creating Unforgettable Moments"
        subtitle="Transform your vision into reality with elegant, bespoke event planning services that exceed expectations."
        ctaText="Explore Services"
        ctaLink="/services"
        showScrollIndicator={true}
        nextSectionId="homepage-next-section"
      />
    </>
  );
}


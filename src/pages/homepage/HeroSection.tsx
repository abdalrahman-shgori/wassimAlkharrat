import HeroSection from '@/components/HeroSection/HeroSection';

export default function HomepageHero() {
  return (
    <>
      <HeroSection
        imageSrc="/images/homepage/test.webp"
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


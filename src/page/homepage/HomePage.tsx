'use client';
import WelcomeToSection from '@/components/welcomeTo/welcomeToSection';
import HomepageHero from './HeroSection';
import ServicesSection from '@/components/services/ServicesSection';
import EventsSection from '@/components/Events/EventsSection';
import StoriesSection from '@/components/Stories/StoriesSection';
import CTASection from '@/components/UI/CTASection/CTASection';
import styles from './HomePage.module.scss';
import { useTranslations } from 'next-intl';
interface Service {
  _id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image?: string;
  isActive: boolean;
}

interface Event {
  _id: string;
  image: string;
  eventTitle: string;
  eventSubtitle: string;
  isActive: boolean;
}

interface Story {
  _id: string;
  image: string;
  names: string;
  testimonial: string;
  isActive: boolean;
}

interface HomePageProps {
  services: Service[];
  events: Event[];
  stories: Story[];
  heroImage: string;
}

export function HomePage({ services, events, stories, heroImage }: HomePageProps) {
  // Ensure props are always arrays to prevent undefined errors during prerendering
  const safeServices = services || [];
  const safeEvents = events || [];
  const safeStories = stories || [];
  const t = useTranslations('welcome');

  return (
    <>
      <HomepageHero imageSrc={heroImage} isHomePage={true} />
       <WelcomeToSection
       id='homepage-next-section'
       title={t('title')}
       description={t('description')}
       author={t('author')}
       />
       <ServicesSection services={safeServices} isHomePage={true} />
       <div className={styles.sectionsWrapper}>
       <EventsSection events={safeEvents} />
       <StoriesSection stories={safeStories} />
       <CTASection/>
       </div>
     
    </>
  );
}

export default HomePage;

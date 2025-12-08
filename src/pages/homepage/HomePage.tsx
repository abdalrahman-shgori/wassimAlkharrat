import WelcomeToSection from '@/components/welcomeTo/welcomeToSection';
import HomepageHero from './HeroSection';
import ServicesSection from '@/components/services/ServicesSection';
import EventsSection from '@/components/Events/EventsSection';
import StoriesSection from '@/components/Stories/StoriesSection';
import CTASection from '@/components/CTASection/CTASection';
import styles from './HomePage.module.scss';

interface Service {
  _id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image?: string;
  isActive: boolean;
  order: number;
}

interface Event {
  _id: string;
  image: string;
  eventTitle: string;
  eventSubtitle: string;
  isActive: boolean;
  order: number;
}

interface Story {
  _id: string;
  image: string;
  names: string;
  testimonial: string;
  isActive: boolean;
  order: number;
}

interface HomePageProps {
  services: Service[];
  events: Event[];
  stories: Story[];
}

export function HomePage({ services, events, stories }: HomePageProps) {
  // Ensure props are always arrays to prevent undefined errors during prerendering
  const safeServices = services || [];
  const safeEvents = events || [];
  const safeStories = stories || [];

  return (
    <>
      <HomepageHero />
       <WelcomeToSection/>
       <ServicesSection services={safeServices} />
       <div className={styles.sectionsWrapper}>
       <EventsSection events={safeEvents} />
       <StoriesSection stories={safeStories} />
       <CTASection/>
       </div>
     
    </>
  );
}

export default HomePage;

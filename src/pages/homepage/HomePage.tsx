import WelcomeToSection from '@/components/welcomeTo/welcomeToSection';
import HomepageHero from './HeroSection';
import ServicesSection from '@/components/services/ServicesSection';
import EventsSection from '@/components/Events/EventsSection';
import StoriesSection from '@/components/Stories/StoriesSection';
import CTASection from '@/components/CTASection/CTASection';
import styles from './HomePage.module.scss';

export default function HomePage() {
  return (
    <>
      <HomepageHero />
       <WelcomeToSection/>
       <ServicesSection/>
       <div className={styles.sectionsWrapper}>
       <EventsSection/>
       <StoriesSection/>
       <CTASection/>
       </div>
     
    </>
  );
}


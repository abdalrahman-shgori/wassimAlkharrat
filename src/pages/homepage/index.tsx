import { GetServerSideProps } from 'next';
import HomePage from './HomePage';
import { getServicesCollection } from '../../../lib/db';
import { getEventsCollection } from '../../../lib/db';
import { getStoriesCollection } from '../../../lib/db';
import { Service } from '../../../lib/models/Service';
import { Event } from '../../../lib/models/Event';
import { Story } from '../../../lib/models/Story';

// Re-export for other uses
export { HomePage } from './HomePage';
export { default as HomepageHero } from './HeroSection';

interface HomePageProps {
  services: Array<{
    _id: string;
    name: string;
    slug: string;
    description: string;
    icon: string;
    image?: string;
    isActive: boolean;
    order: number;
  }>;
  events: Array<{
    _id: string;
    image: string;
    eventTitle: string;
    eventSubtitle: string;
    isActive: boolean;
    order: number;
  }>;
  stories: Array<{
    _id: string;
    image: string;
    names: string;
    testimonial: string;
    isActive: boolean;
    order: number;
  }>;
}

async function getServices() {
  try {
    const servicesCollection = await getServicesCollection();
    const services = await servicesCollection
      .find({ isActive: true })
      .sort({ order: 1 })
      .limit(6)
      .toArray();
    
    return services.map((service: Service) => ({
      _id: service._id?.toString() || '',
      name: service.name,
      slug: service.slug,
      description: service.description,
      icon: service.icon,
      image: service.image,
      isActive: service.isActive,
      order: service.order,
    }));
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}

async function getEvents() {
  try {
    const eventsCollection = await getEventsCollection();
    const events = await eventsCollection
      .find({ isActive: true })
      .sort({ order: 1 })
      .toArray();
    
    return events.map((event: Event) => ({
      _id: event._id?.toString() || '',
      image: event.image,
      eventTitle: event.eventTitle,
      eventSubtitle: event.eventSubtitle,
      isActive: event.isActive,
      order: event.order,
    }));
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

async function getStories() {
  try {
    const storiesCollection = await getStoriesCollection();
    const stories = await storiesCollection
      .find({ isActive: true })
      .sort({ order: 1 })
      .toArray();
    
    return stories.map((story: Story) => ({
      _id: story._id?.toString() || '',
      image: story.image,
      names: story.names,
      testimonial: story.testimonial,
      isActive: story.isActive,
      order: story.order,
    }));
  } catch (error) {
    console.error('Error fetching stories:', error);
    return [];
  }
}

export const getServerSideProps: GetServerSideProps<HomePageProps> = async () => {
  const [services, events, stories] = await Promise.all([
    getServices(),
    getEvents(),
    getStories(),
  ]);

  return {
    props: {
      services,
      events,
      stories,
    },
  };
};

export default HomePage;


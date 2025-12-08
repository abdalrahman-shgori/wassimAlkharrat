import { HomePage } from '@/pages/homepage';
import { getServicesCollection } from '../../../lib/db';
import { getEventsCollection } from '../../../lib/db';
import { getStoriesCollection } from '../../../lib/db';
import { Service } from '../../../lib/models/Service';
import { Event } from '../../../lib/models/Event';
import { Story } from '../../../lib/models/Story';

export const revalidate = 3600; // Revalidate every hour for ISR

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

export default async function Home() {
  const [services, events, stories] = await Promise.all([
    getServices(),
    getEvents(),
    getStories(),
  ]);

  return <HomePage services={services} events={events} stories={stories} />;
}


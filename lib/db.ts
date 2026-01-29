import clientPromise from "./mongodb";
import { Admin } from "./models/Admin";
import { Service } from "./models/Service";
import { Event } from "./models/Event";
import { Story } from "./models/Story";
import { HomepageSettings } from "./models/HomepageSettings";
import { ServicesPageSettings } from "./models/ServicesPageSettings";
import { EventsPageSettings } from "./models/EventsPageSettings";
import { ServiceFilter } from "./models/ServiceFilter";
import { GalleryImage } from "./models/Gallery";
import { GalleryCategory } from "./models/GalleryCategory";

export async function getAdminsCollection() {
  const client = await clientPromise;
  const db = client.db("event_planner");
  return db.collection<Admin>("admins");
}

export async function getServicesCollection() {
  const client = await clientPromise;
  const db = client.db("event_planner");
  return db.collection<Service>("services");
}

export async function getEventsCollection() {
  const client = await clientPromise;
  const db = client.db("event_planner");
  return db.collection<Event>("events");
}

export async function getStoriesCollection() {
  const client = await clientPromise;
  const db = client.db("event_planner");
  return db.collection<Story>("stories");
}

export async function getHomepageSettingsCollection() {
  const client = await clientPromise;
  const db = client.db("event_planner");
  return db.collection<HomepageSettings>("homepage_settings");
}

export async function getBookingsCollection() {
  const client = await clientPromise;
  const db = client.db("event_planner");
  return db.collection("bookings");
}

export async function getServiceFiltersCollection() {
  const client = await clientPromise;
  const db = client.db("event_planner");
  return db.collection<ServiceFilter>("service_filters");
}

export async function getServicesPageSettingsCollection() {
  const client = await clientPromise;
  const db = client.db("event_planner");
  return db.collection<ServicesPageSettings>("services_page_settings");
}

export async function getEventsPageSettingsCollection() {
  const client = await clientPromise;
  const db = client.db("event_planner");
  return db.collection<EventsPageSettings>("events_page_settings");
}

export async function getGalleryCollection() {
  const client = await clientPromise;
  const db = client.db("event_planner");
  return db.collection<GalleryImage>("gallery");
}

export async function getGalleryCategoriesCollection() {
  const client = await clientPromise;
  const db = client.db("event_planner");
  return db.collection<GalleryCategory>("gallery_categories");
}

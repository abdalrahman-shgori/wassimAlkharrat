import clientPromise from "./mongodb";
import { Admin } from "./models/Admin";
import { Service } from "./models/Service";
import { Event } from "./models/Event";
import { Story } from "./models/Story";
import { HomepageSettings } from "./models/HomepageSettings";

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


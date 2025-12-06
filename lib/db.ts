import clientPromise from "./mongodb";
import { Admin } from "./models/Admin";
import { Service } from "./models/Service";

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
  return db.collection("events");
}

export async function getBookingsCollection() {
  const client = await clientPromise;
  const db = client.db("event_planner");
  return db.collection("bookings");
}


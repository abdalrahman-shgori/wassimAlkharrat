import { ObjectId } from "mongodb";

export interface Event {
  _id?: ObjectId;
  image: string; // URL/path to event image
  eventTitle: string;
  eventSubtitle: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEventInput {
  image: string;
  eventTitle: string;
  eventSubtitle: string;
  isActive?: boolean;
  order?: number;
}

export interface UpdateEventInput {
  image?: string;
  eventTitle?: string;
  eventSubtitle?: string;
  isActive?: boolean;
  order?: number;
}


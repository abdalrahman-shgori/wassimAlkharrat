import { ObjectId } from "mongodb";

export interface Event {
  _id?: ObjectId;
  image: string; // URL/path to event image
  eventTitle: string;
  eventTitleEn?: string;
  eventTitleAr?: string;
  eventSubtitle: string;
  eventSubtitleEn?: string;
  eventSubtitleAr?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEventInput {
  image: string;
  eventTitle: string;
  eventTitleEn?: string;
  eventTitleAr: string;
  eventSubtitle: string;
  eventSubtitleEn?: string;
  eventSubtitleAr: string;
  isActive?: boolean;
}

export interface UpdateEventInput {
  image?: string;
  eventTitle?: string;
  eventTitleEn?: string;
  eventTitleAr?: string;
  eventSubtitle?: string;
  eventSubtitleEn?: string;
  eventSubtitleAr?: string;
  isActive?: boolean;
}


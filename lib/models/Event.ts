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
  eventType?: string; // Event type category (e.g., "Birthday", "Wedding", etc.)
  type?: string; // Event sub-type (e.g., "Baby Birthday", "Adult Birthday", etc.)
  typeAr?: string; // Event sub-type in Arabic
  theme?: string; // Event theme (e.g., "Modern", "Classic", "Rustic", etc.)
  themeAr?: string; // Event theme in Arabic
  size?: string; // Event size (e.g., "Small", "Medium", "Large", etc.)
  sizeAr?: string; // Event size in Arabic
  place?: string; // Event place/location (e.g., "Dama Rose Hotel", "Four Seasons", etc.)
  placeAr?: string; // Event place/location in Arabic
  servicesUsed?: Array<{ nameEn: string; nameAr: string }>; // Array of custom service objects with English and Arabic names
  eventDate?: Date | string; // Date when the event occurred or will occur
  gallery?: Array<string | { type: 'video'; url: string; thumbnail?: string }>; // Array of image URLs or video objects for the event gallery
  hostOpinionEn?: string; // Testimonial / opinion from the party host (EN)
  hostOpinionAr?: string; // Testimonial / opinion from the party host (AR)
  hostOpinionImage?: string; // Host image URL (optional)
  hostNameEn?: string; // Host name in English (optional)
  hostNameAr?: string; // Host name in Arabic (optional)
  hostRoleEn?: string; // Host role/title (EN) (optional)
  hostRoleAr?: string; // Host role/title (AR) (optional)
  isEventType?: boolean; // Flag to distinguish event types from individual events
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
  eventType?: string;
  type?: string;
  typeAr?: string;
  theme?: string;
  themeAr?: string;
  size?: string;
  sizeAr?: string;
  place?: string;
  placeAr?: string;
  servicesUsed?: Array<{ nameEn: string; nameAr: string }>;
  eventDate?: Date | string;
  gallery?: Array<string | { type: 'video'; url: string; thumbnail?: string }>;
  hostOpinionEn?: string;
  hostOpinionAr?: string;
  hostOpinionImage?: string;
  hostNameEn?: string;
  hostNameAr?: string;
  hostRoleEn?: string;
  hostRoleAr?: string;
  isEventType?: boolean;
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
  eventType?: string;
  type?: string;
  typeAr?: string;
  theme?: string;
  themeAr?: string;
  size?: string;
  sizeAr?: string;
  place?: string;
  placeAr?: string;
  servicesUsed?: Array<{ nameEn: string; nameAr: string }>;
  eventDate?: Date | string;
  gallery?: Array<string | { type: 'video'; url: string; thumbnail?: string }>;
  hostOpinionEn?: string;
  hostOpinionAr?: string;
  hostOpinionImage?: string;
  hostNameEn?: string;
  hostNameAr?: string;
  hostRoleEn?: string;
  hostRoleAr?: string;
  isEventType?: boolean;
  isActive?: boolean;
}


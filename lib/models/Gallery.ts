import { ObjectId } from "mongodb";

export interface GalleryImage {
  _id?: ObjectId;
  image: string; // URL/path to gallery image
  category: string; // Filter category: "Weddings", "Birthdays", "Conferences", etc.
  categoryEn?: string; // Category in English
  categoryAr?: string; // Category in Arabic
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateGalleryImageInput {
  image: string;
  category: string;
  categoryEn?: string;
  categoryAr?: string;
  isActive?: boolean;
}

export interface UpdateGalleryImageInput {
  image?: string;
  category?: string;
  categoryEn?: string;
  categoryAr?: string;
  isActive?: boolean;
}
